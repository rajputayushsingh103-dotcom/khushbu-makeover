import React, { useState, useEffect } from 'react';
import {
  X, Calendar, Clock, Sparkles, CheckCircle2, User, Phone, Mail,
  MessageSquare, ShieldCheck, Tag, ArrowRight, Download, Share2,
  QrCode, CreditCard, Copy, Check, Lock, Percent, Smartphone, AlertCircle, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Service, Appointment, Offer, SalonInfo } from '../types';
import { SALON_INFO as DEFAULT_SALON_INFO } from '../data/initialData';
import { salonService } from '../services/salonService';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: Service | null;
  services: Service[];
  offers: Offer[];
  onAppointmentCreated: (appointment: Appointment) => void;
  salonInfo?: SalonInfo;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedService,
  services,
  offers,
  onAppointmentCreated,
  salonInfo = DEFAULT_SALON_INFO
}) => {
  const info = salonInfo || DEFAULT_SALON_INFO;
  const [serviceId, setServiceId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM - 1:00 PM');
  const [stylist, setStylist] = useState<string>(`${info.founder || "Khushbu's Makeover"} (Celebrity Master Artist)`);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  // Payment Option
  const [paymentOption, setPaymentOption] = useState<'token_10_percent' | 'full_payment' | 'pay_at_salon'>('token_10_percent');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [utrError, setUtrError] = useState<string>('');
  const [isCopiedUPI, setIsCopiedUPI] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // UPI Configuration
  const SALON_UPI_ID = info.upiId || info.payment?.upiId || 'ayush6242@ptyes';
  const SALON_PAYEE_NAME = info.name || info.payment?.payeeName || "Ayush Singh";
  const rawDepositPercent = info.depositPercentage || info.payment?.tokenPercentage || 10;
  const depositPercentRate = rawDepositPercent / 100;
  const depositPercentLabel = `${rawDepositPercent}%`;

  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('km_user');
      if (savedUserStr) {
        const user = JSON.parse(savedUserStr);
        if (user.name && !name) setName(user.name);
        if (user.phone && !phone) setPhone(user.phone);
        if (user.email && !email) setEmail(user.email);
      }
    } catch (e) {
      console.warn("User autofill error", e);
    }

    if (selectedService) {
      setServiceId(selectedService.id);
    } else if (services.length > 0 && !serviceId) {
      setServiceId(services[0].id);
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, [selectedService, services, isOpen]);

  if (!isOpen) return null;

  const currentService = services.find(s => s.id === serviceId) || services[0];

  const timeSlots = [
    '09:30 AM - 11:30 AM',
    '11:30 AM - 01:30 PM',
    '02:00 PM - 04:00 PM',
    '04:30 PM - 06:30 PM',
    '06:30 PM - 08:30 PM'
  ];

  const stylists = [
    "Khushbu's Makeover (Founder & Master Artist)",
    'Priya Mehra (Senior Hair & Color Director)',
    'Aisha Khan (Lead Clinical Aesthetician)',
    'Riya Sen (Master Nail & Lash Stylist)',
    'First Available Master Artist'
  ];

  const addonOptions = [
    { name: 'Ultra 24H Airbrush Shield Base', price: 1999 },
    { name: 'Swarovski 3D Mink Silk Eyelashes', price: 999 },
    { name: 'Royal Saree/Lehenga Dupatta Draping', price: 1499 },
    { name: 'Aroma Scalp & Shoulder Massage (20m)', price: 1199 }
  ];

  const toggleAddon = (addonName: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonName) ? prev.filter(a => a !== addonName) : [...prev, addonName]
    );
  };

  const calculateTotal = () => {
    let base = currentService ? currentService.price : 0;
    const addonsTotal = selectedAddons.reduce((acc, curr) => {
      const found = addonOptions.find(a => a.name === curr);
      return acc + (found ? found.price : 0);
    }, 0);
    let total = base + addonsTotal;
    if (appliedDiscount) {
      total = Math.max(0, total - appliedDiscount.amount);
    }
    return total;
  };

  const totalPrice = calculateTotal();
  const token10Percent = Math.round(totalPrice * depositPercentRate);
  const remainingDue = paymentOption === 'token_10_percent' 
    ? (totalPrice - token10Percent) 
    : paymentOption === 'full_payment' 
    ? 0 
    : totalPrice;

  const payableNow = paymentOption === 'token_10_percent'
    ? token10Percent
    : paymentOption === 'full_payment'
    ? totalPrice
    : 0;

  // Standard NPCI Dynamic UPI URI
  const cleanPayeeName = encodeURIComponent(SALON_PAYEE_NAME.replace(/[^a-zA-Z0-9 ]/g, '').trim());
  const cleanTransactionNote = encodeURIComponent(`Booking ${currentService?.title || 'Salon Service'}`);
  const dynamicUpiIntentUri = `upi://pay?pa=${encodeURIComponent(SALON_UPI_ID.trim())}&pn=${cleanPayeeName}&am=${payableNow}&cu=INR&tn=${cleanTransactionNote}`;
  
  // High-Resolution QR Generator
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(dynamicUpiIntentUri)}&margin=8`;

  const copyUpiId = () => {
    navigator.clipboard?.writeText(SALON_UPI_ID);
    setIsCopiedUPI(true);
    setTimeout(() => setIsCopiedUPI(false), 2500);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) return;

    const offer = offers.find(o => o.code.toUpperCase() === couponCode.trim().toUpperCase() && o.isActive);
    if (!offer) {
      setCouponError('Invalid or expired promo code.');
      return;
    }

    let discount = 0;
    const base = currentService ? currentService.price : 0;

    if (offer.minBookingValue && base < offer.minBookingValue) {
      setCouponError(`Min booking value of ₹${offer.minBookingValue} required for this coupon.`);
      return;
    }

    if (offer.discountPercentage) {
      discount = Math.round((base * offer.discountPercentage) / 100);
    } else if (offer.discountAmount) {
      discount = offer.discountAmount;
    }

    setAppliedDiscount({ code: offer.code, amount: discount });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUtrError('');

    if (!name.trim() || !phone.trim() || !date || !currentService) {
      return;
    }

    // Mandatory UTR validation for Online Payments
    if (paymentOption !== 'pay_at_salon' && !paymentRef.trim()) {
      setUtrError('Payment confirm karne ke liye 12-digit UTR / UPI Transaction ID enter karna zaroori hai.');
      return;
    }

    setIsSubmitting(true);

    try {
      let loggedInUserId = '';
      try {
        const u = JSON.parse(localStorage.getItem('km_user') || '{}');
        if (u.id) loggedInUserId = u.id;
      } catch (err) {}

      const newApt = await salonService.createAppointment({
        name,
        phone,
        email,
        serviceId: currentService.id,
        serviceName: currentService.title,
        servicePrice: currentService.price,
        date,
        timeSlot,
        stylist,
        addons: selectedAddons,
        totalPrice,
        paymentOption,
        advancePaid: payableNow,
        remainingDue,
        paymentRef: paymentRef.trim() || undefined,
        message,
        userId: loggedInUserId || undefined
      });

      try {
        const existingBookings = JSON.parse(localStorage.getItem('km_bookings') || '[]');
        const updatedBookings = [newApt, ...existingBookings.filter((b: any) => b.id !== newApt.id)];
        localStorage.setItem('km_bookings', JSON.stringify(updatedBookings));
        localStorage.setItem('salon_appointments', JSON.stringify(updatedBookings));

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('bookingUpdated', { detail: newApt }));
      } catch (saveErr) {
        console.error("Profile save error:", saveErr);
      }

      setConfirmedBooking(newApt);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E0A96D', '#B76E79', '#F9D5A7', '#D4AF37', '#ffffff']
        });
      } catch (e) {}
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppUrl = () => {
    if (!confirmedBooking) return '';
    const paymentStatusText = confirmedBooking.paymentOption === 'token_10_percent'
      ? `*Pre-Booking Token Paid (${depositPercentLabel}):* ₹${(confirmedBooking.advancePaid || 0).toLocaleString()}\n*Remaining Balance (Pay at Studio):* ₹${(confirmedBooking.remainingDue || 0).toLocaleString()}`
      : confirmedBooking.paymentOption === 'full_payment'
      ? `*Payment Status:* Full Amount Paid Online (₹${confirmedBooking.totalPrice.toLocaleString()})`
      : `*Payment Status:* Pay at Studio (₹${confirmedBooking.totalPrice.toLocaleString()})`;

    const text = encodeURIComponent(
      `✨ *Appointment Confirmation - ${info.name || "Khushbu's Makeover"}* ✨\n\n` +
      `*Booking Code:* ${confirmedBooking.bookingCode}\n` +
      `*Client Name:* ${confirmedBooking.name}\n` +
      `*Mobile:* ${confirmedBooking.phone}\n` +
      `*Service:* ${confirmedBooking.serviceName}\n` +
      `*Stylist:* ${confirmedBooking.stylist}\n` +
      `*Date:* ${confirmedBooking.date}\n` +
      `*Time Slot:* ${confirmedBooking.timeSlot}\n` +
      `*Total Price:* ₹${confirmedBooking.totalPrice.toLocaleString()}\n` +
      `${paymentStatusText}\n` +
      (confirmedBooking.paymentRef ? `*UPI / UTR Ref:* ${confirmedBooking.paymentRef}\n` : '') +
      (confirmedBooking.addons && confirmedBooking.addons.length > 0 ? `*Add-ons:* ${confirmedBooking.addons.join(', ')}\n` : '') +
      `\n📍 *Studio Address:* Near Dolphin Public School, Village Chheetpur, Dileeppur, Uttar Pradesh 230127\n\n` +
      `Thank you! My booking is confirmed.`
    );
    
    const waNumber = (info.whatsapp || '918382088707').replace(/\D/g, '');
    return `https://wa.me/${waNumber}?text=${text}`;
  };

  const handleSendWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getWhatsAppUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleCloseModal = () => {
    if (confirmedBooking) {
      onAppointmentCreated(confirmedBooking);
      setConfirmedBooking(null);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F5] dark:bg-[#1A1818] rounded-3xl shadow-2xl border border-[#E0A96D]/30 text-stone-900 dark:text-stone-100 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E1B1C] via-[#2A2324] to-[#1E1B1C] p-6 sm:p-7 border-b border-[#E0A96D]/30 relative">
          <button
            type="button"
            onClick={handleCloseModal}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 text-stone-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0A96D]/15 text-[#E0A96D] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            VIP Studio Reservation
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Book Your Beauty Experience
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Personalized pampering with Master Artist Khushboo & Senior Stylists.
          </p>
        </div>

        {/* Content */}
        {confirmedBooking ? (
          /* Confirmation Receipt View */
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border-2 border-emerald-500 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#B76E79] dark:text-[#E0A96D] font-bold">
                {confirmedBooking.paymentOption === 'token_10_percent' ? 'Date Locked & Reserved (10% Token Paid)' : 'Booking Confirmed'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mt-1">
                We Can't Wait to Glam You Up, {confirmedBooking.name.split(' ')[0]}!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1.5">
                Receipt saved! WhatsApp button par click karke details send karein.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 text-left space-y-3.5 shadow-inner">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100 dark:border-stone-800">
                <span className="text-xs text-stone-400 font-semibold uppercase">Booking Code</span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#8C5E35] dark:text-[#E0A96D] px-2.5 py-0.5 rounded bg-[#E0A96D]/15">
                  {confirmedBooking.bookingCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-400 text-[11px] block">Selected Service</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{confirmedBooking.serviceName}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Dedicated Stylist</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{confirmedBooking.stylist}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Date & Time</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Total Package Amount</span>
                  <span className="font-serif text-base font-bold text-stone-900 dark:text-white">₹{confirmedBooking.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#FAF0E6] dark:bg-[#241F20] border border-[#E0A96D]/30 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600 dark:text-stone-300 font-medium">
                    {confirmedBooking.paymentOption === 'token_10_percent' ? '10% Advance Token Paid:' : 'Advance Paid:'}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{(confirmedBooking.advancePaid || 0).toLocaleString()}
                  </span>
                </div>
                {confirmedBooking.paymentOption === 'token_10_percent' && (
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-600 dark:text-stone-300 font-medium">
                      Remaining Balance (Pay at Studio):
                    </span>
                    <span className="font-serif font-bold text-[#8C5E35] dark:text-[#E0A96D]">
                      ₹{(confirmedBooking.remainingDue || 0).toLocaleString()}
                    </span>
                  </div>
                )}
                {confirmedBooking.paymentRef && (
                  <div className="text-[11px] text-stone-500 pt-1 border-t border-[#E0A96D]/20">
                    UPI / UTR Ref: <span className="font-mono font-semibold text-stone-900 dark:text-white">{confirmedBooking.paymentRef}</span>
                  </div>
                )}
              </div>

              {confirmedBooking.addons && confirmedBooking.addons.length > 0 && (
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                  <span className="text-stone-400 block text-[11px]">Add-ons:</span>
                  <span className="text-stone-700 dark:text-stone-300">{confirmedBooking.addons.join(', ')}</span>
                </div>
              )}
            </div>

            {/* WhatsApp Share & Print */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Send Receipt on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="py-3.5 px-5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
              >
                Done / Close Receipt
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Service & Stylist */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    Select Service / Makeup *
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.title} (₹{s.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    Preferred Artist / Stylist
                  </label>
                  <select
                    value={stylist}
                    onChange={(e) => setStylist(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  >
                    {stylists.map((st, i) => (
                      <option key={i} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    Appointment Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  >
                    {timeSlots.map((ts, i) => (
                      <option key={i} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Addons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  Enhance Your Ritual (Optional Add-ons)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {addonOptions.map((addon, i) => {
                    const isSelected = selectedAddons.includes(addon.name);
                    return (
                      <div
                        key={i}
                        onClick={() => toggleAddon(addon.name)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-[#E0A96D]/15 border-[#E0A96D] text-stone-900 dark:text-white font-medium'
                            : 'bg-white/60 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-[#B76E79] focus:ring-[#E0A96D]"
                          />
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-semibold text-[#8C5E35] dark:text-[#E0A96D] shrink-0">+₹{addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guest Info */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Guest Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Radhika Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                      />
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">WhatsApp / Mobile Phone *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 8382088707"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. radhika@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                      />
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">Special Occasion / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Wedding reception"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter promo coupon (e.g. ROYALBRIDAL2026)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase font-mono rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-stone-900 dark:bg-stone-700 hover:bg-[#E0A96D] hover:text-stone-950 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscount && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coupon {appliedDiscount.code} applied! ₹{appliedDiscount.amount.toLocaleString()} discount saved.
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-rose-500 font-medium">{couponError}</p>
                )}
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF0E6] to-[#F5E6D3]/60 dark:from-[#241F20] dark:to-[#2B2325] border border-[#E0A96D]/40 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E0A96D]/20 text-[#8C5E35] dark:text-[#E0A96D] flex items-center justify-center font-bold text-xs">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-white">
                      Pre-Booking & Reservation Option
                    </h4>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      10% advance token pay karke date lock karein, ya salon me pay karein.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E0A96D]/20 text-[#8C5E35] dark:text-[#E0A96D] font-bold">
                  Instant Date Lock
                </span>
              </div>

              {/* Payment Mode Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div
                  onClick={() => {
                    setPaymentOption('token_10_percent');
                    setUtrError('');
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                    paymentOption === 'token_10_percent'
                      ? 'bg-white dark:bg-stone-900 border-[#E0A96D] ring-2 ring-[#E0A96D]/40 shadow-sm'
                      : 'bg-white/50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider">
                    Recommended
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-white mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />
                      <span>10% Advance Token</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Reserve slot now; 90% balance on salon visit.
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-baseline justify-between">
                    <span className="text-[10px] text-stone-400">Pay Now:</span>
                    <span className="font-serif font-bold text-sm text-[#8C5E35] dark:text-[#E0A96D]">
                      ₹{token10Percent.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setPaymentOption('full_payment');
                    setUtrError('');
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    paymentOption === 'full_payment'
                      ? 'bg-white dark:bg-stone-900 border-[#E0A96D] ring-2 ring-[#E0A96D]/40 shadow-sm'
                      : 'bg-white/50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-white mb-1">
                      <CreditCard className="w-3.5 h-3.5 text-[#E0A96D]" />
                      <span>Full 100% Online</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Complete upfront payment via UPI QR.
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-baseline justify-between">
                    <span className="text-[10px] text-stone-400">Pay Now:</span>
                    <span className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setPaymentOption('pay_at_salon');
                    setUtrError('');
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    paymentOption === 'pay_at_salon'
                      ? 'bg-white dark:bg-stone-900 border-[#E0A96D] ring-2 ring-[#E0A96D]/40 shadow-sm'
                      : 'bg-white/50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-white mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#E0A96D]" />
                      <span>Pay at Salon</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Standard slot; pay full amount on appointment day.
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-baseline justify-between">
                    <span className="text-[10px] text-stone-400">Pay Now:</span>
                    <span className="font-serif font-bold text-sm text-stone-500">₹0</span>
                  </div>
                </div>
              </div>

              {/* Dynamic NPCI Auto-Amount UPI QR Code */}
              {paymentOption !== 'pay_at_salon' && (
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-[#E0A96D]/30 space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    
                    {/* QR Code */}
                    <div className="flex flex-col items-center bg-white p-3 rounded-2xl border-2 border-[#E0A96D]/40 shadow-md shrink-0">
                      <img
                        src={qrCodeImageUrl}
                        alt="Khushboo Makeover UPI QR Code"
                        className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg object-contain"
                      />
                      <div className="mt-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
                        <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Scan & Pay: ₹{payableNow.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 flex-1 w-full text-left">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400">
                          <span>Total Service Price:</span>
                          <span className="font-medium text-stone-900 dark:text-white">₹{totalPrice.toLocaleString()}</span>
                        </div>

                        {paymentOption === 'token_10_percent' ? (
                          <>
                            <div className="flex justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 py-0.5 border-y border-stone-100 dark:border-stone-800">
                              <span>⚡ 10% Advance Token (Auto in QR):</span>
                              <span className="font-serif text-sm">₹{token10Percent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                              <span>Remaining Balance (at Studio):</span>
                              <span className="font-semibold text-stone-700 dark:text-stone-300">₹{remainingDue.toLocaleString()}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 py-0.5 border-y border-stone-100 dark:border-stone-800">
                            <span>Full 100% Payment (Auto in QR):</span>
                            <span className="font-serif text-sm">₹{totalPrice.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* 1-Click Copy UPI ID & Instructions */}
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-stone-400 block">UPI ID / VPA</span>
                            <span className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200">{SALON_UPI_ID}</span>
                          </div>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="px-3 py-1.5 rounded-lg bg-[#E0A96D] hover:bg-[#C58F5E] text-stone-950 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm active:scale-95"
                          >
                            {isCopiedUPI ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy UPI ID</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                          💡 <strong>How to Pay:</strong> UPI ID copy karke Paytm/GPay mein "To UPI ID" par paste karein ya upar diya gaya QR code scan karein.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mandatory UTR Input */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                    <label className="block text-[11px] font-bold text-stone-800 dark:text-stone-200 mb-1">
                      UPI Transaction ID / 12-Digit UTR Number * <span className="text-rose-500 font-semibold">(Mandatory for Online Payment)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter 12-digit UTR (e.g. 423871928392)"
                      value={paymentRef}
                      onChange={(e) => {
                        setPaymentRef(e.target.value);
                        setUtrError('');
                      }}
                      className="w-full px-3.5 py-2.5 text-xs font-mono font-semibold rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D] focus:ring-1 focus:ring-[#E0A96D]"
                    />
                    {utrError && (
                      <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{utrError}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Total Calculation & Submit Button */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                  {paymentOption === 'token_10_percent' ? '10% Advance Token Payable' : 'Total Investment'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#8C5E35] dark:text-[#E0A96D]">
                    ₹{(paymentOption === 'token_10_percent' ? token10Percent : totalPrice).toLocaleString()}
                  </span>
                  {paymentOption === 'token_10_percent' && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      (Locks Appointment Date)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-1/2 sm:w-auto px-5 py-3 rounded-full text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-appointment-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-semibold text-sm shadow-lg shadow-[#E0A96D]/25 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Reserving...</span>
                  ) : (
                    <>
                      <span>{paymentOption === 'token_10_percent' ? 'Lock Date (10% Token)' : paymentOption === 'full_payment' ? 'Pay & Confirm' : 'Confirm Reservation'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};