import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, Navigation } from 'lucide-react';
import { SalonInfo } from '../types';
import { SALON_INFO } from '../data/initialData';

interface ContactSectionProps {
  salonInfo?: SalonInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ salonInfo }) => {
  const info = salonInfo || SALON_INFO;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Bridal Makeup Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addressText = typeof info.address === 'string'
    ? info.address
    : [info.address?.street, info.address?.landmark, info.address?.city, info.address?.state, info.address?.pincode].filter(Boolean).join(', ');

  const googleMapsLink = info.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(addressText || info.name)}`;
  const mapEmbedLink = info.googleMapsEmbedUrl || info.address?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120638.16781223945!2d72.8258336!3d19.0821978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, subject, message })
      });
    } catch (e) {}

    setSubmitting(false);
    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div id="contact-us-component" className="space-y-12 py-6">
      {/* 2-Column Grid: Contact Info & Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Salon Direct Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#1C1A1B] rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B76E79] dark:text-[#E0A96D] font-bold">VIP Studio Access</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mt-1">Get in Touch with Our Concierge</h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
                We are delighted to assist you with wedding dates, trials, custom bridal packages, and VIP private suite bookings.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                <MapPin className="w-5 h-5 text-[#E0A96D] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-stone-900 dark:text-white block">Studio Location & Address</span>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{addressText}</p>
                  {(info.landmark || info.directionsNote) && (
                    <p className="text-[11px] text-[#8C5E35] dark:text-[#E0A96D] pt-0.5">
                      📍 {info.landmark ? `Landmark: ${info.landmark}. ` : ''}{info.directionsNote || ''}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                <Phone className="w-5 h-5 text-[#E0A96D] shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Direct Booking Hotline</span>
                  <a href={`tel:${info.phone.replace(/\s+/g, '')}`} className="hover:text-[#E0A96D] transition-colors font-medium">
                    {info.phone} {info.phoneAlt ? ` / ${info.phoneAlt}` : ''}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                <Mail className="w-5 h-5 text-[#E0A96D] shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Bridal Concierge Email</span>
                  <a href={`mailto:${info.email || 'appointments@khushboomakeover.com'}`} className="hover:text-[#E0A96D] transition-colors font-medium">
                    {info.email || 'appointments@khushboomakeover.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                <Clock className="w-5 h-5 text-[#E0A96D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">Salon Operating Hours</span>
                  <p className="text-stone-600 dark:text-stone-400">Mon – Sat: {info.hours?.weekdays || '9:30 AM – 8:30 PM'}</p>
                  <p className="text-stone-600 dark:text-stone-400">Sunday: {info.hours?.weekends || '9:00 AM – 9:00 PM'}</p>
                  <p className="text-[#8C5E35] dark:text-[#E0A96D] font-medium mt-0.5">VIP Bridal Bookings: {info.hours?.bridal || '24/7 By Prior VIP Booking'}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Direct Button */}
            <a
              href={`https://wa.me/${(info.whatsapp || '919876543210').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(info.name || 'Khushboo Makeover')},%20I%20would%20like%20to%20inquire%20about%20a%20bridal%20appointment.`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Directly on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#1C1A1B] rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B76E79] dark:text-[#E0A96D] font-bold">Write to {info.founder || 'Khushboo Sharma'}</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mt-1">Send a Message or Request Call Back</h3>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-[#E0A96D]/10 rounded-2xl border border-[#E0A96D]/30 animate-in zoom-in-95 duration-300">
                <CheckCircle2 className="w-12 h-12 text-[#E0A96D] mx-auto" />
                <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-white">Inquiry Received Successfully!</h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                  Thank you, our senior beauty advisor will contact you on your WhatsApp / Phone within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Verma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 95985 38006"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. radhika@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Inquiry Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    >
                      <option value="Bridal Makeup Inquiry">Bridal Makeup Inquiry</option>
                      <option value="Destination Wedding Makeup">Destination Wedding Makeup</option>
                      <option value="Pre-Bridal 7-Day Package">Pre-Bridal 7-Day Package</option>
                      <option value="Keratin / Hair Smoothening">Keratin / Hair Smoothening</option>
                      <option value="HydraFacial Consultation">HydraFacial Consultation</option>
                      <option value="Other Inquiries">Other Inquiries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Your Message & Wedding Date Details</label>
                  <textarea
                    rows={4}
                    placeholder={`Provide your event date, venue location, or any questions for ${info.founder || 'Khushboo'}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs sm:text-sm shadow-md hover:scale-102 transition-transform flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Luxury Google Map */}
      <div className="bg-white dark:bg-[#1C1A1B] rounded-3xl overflow-hidden border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-xl">
        <div className="p-4 sm:p-6 bg-[#161415] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#E0A96D] font-bold">Interactive Studio Location</span>
            <h4 className="font-serif text-lg font-bold">{info.name || 'Khushboo Makeover'} Flagship Arcade</h4>
            <p className="text-xs text-stone-400 mt-0.5">{addressText}</p>
          </div>

          <a
            href={googleMapsLink}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#E0A96D] text-stone-950 text-xs font-bold hover:bg-[#C58F5E] transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps / Directions</span>
          </a>
        </div>

        <div className="relative h-72 sm:h-96 w-full bg-stone-900 overflow-hidden">
          <iframe
            title={`${info.name || 'Khushbu Makeover'} Location Map`}
            src={mapEmbedLink}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(15%) contrast(1.05)' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};
