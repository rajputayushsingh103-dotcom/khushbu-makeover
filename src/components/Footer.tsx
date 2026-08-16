import React, { useState } from 'react';
import { Sparkles, Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageView, SalonInfo } from '../types';
import { SALON_INFO } from '../data/initialData';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  onOpenBooking: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  salonInfo?: SalonInfo;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentPage,
  onOpenBooking,
  onOpenPrivacy,
  onOpenTerms,
  salonInfo
}) => {
  const info = salonInfo || SALON_INFO;
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // 📍 Studio Official Address
  const EXACT_STUDIO_ADDRESS = "Near Dolphin Public School, VILLAGE CHHEETPUR, POST, Dileeppur, Cheetpur, Uttar Pradesh 230127, India";

  const addressText = EXACT_STUDIO_ADDRESS;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <footer id="main-salon-footer" className="bg-[#121011] text-stone-300 border-t border-[#E0A96D]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top VIP Invitation Banner */}
        <div className="bg-gradient-to-r from-[#1E1B1C] via-[#2D2324] to-[#1E1B1C] rounded-3xl p-8 sm:p-10 border border-[#E0A96D]/30 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E0A96D]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#E0A96D] text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                VIP Experience Awaits
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Ready to Experience Royal Beauty Artistry?
              </h3>
              <p className="text-stone-300 text-sm sm:text-base mt-2">
                Reserve your bridal makeover or luxury hair and skincare session with Master Artist {info.founder || "Khushbu's Makeover"}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                id="footer-book-vip-btn"
                onClick={onOpenBooking}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#E0A96D]/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Book Appointment Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`https://wa.me/${(info.whatsapp || '95985 38006').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(info.name || "Khushbu's Makeover")},%20I%20would%20like%20to%20inquire%20about%20booking%20an%20appointment.`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-full border border-[#E0A96D]/40 text-[#E0A96D] hover:bg-[#E0A96D]/10 font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
              >
                <span>WhatsApp VIP Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#E0A96D] p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-[#121011] flex items-center justify-center">
                  <span className="font-serif text-lg font-bold text-[#E0A96D]">KM</span>
                </div>
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-white">{info.name || "Khushbu's Makeover"}</h4>
                <p className="text-[10px] tracking-widest text-[#E0A96D] uppercase">{info.tagline || 'Luxury Salon & Bridal Studio'}</p>
              </div>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              {info.about?.mission || "Uttar Pradesh's premier luxury salon and celebrity bridal destination. Perfecting bridal artistry, HD glow, hair restoration, and aesthetic rituals."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {info.socials?.instagram && (
                <a
                  href={info.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-[#E0A96D] hover:border-[#E0A96D]/40 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {info.socials?.facebook && (
                <a
                  href={info.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-[#E0A96D] hover:border-[#E0A96D]/40 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {info.socials?.youtube && (
                <a
                  href={info.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-[#E0A96D] hover:border-[#E0A96D]/40 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="font-serif text-base font-semibold text-white tracking-wide mb-4 border-l-2 border-[#E0A96D] pl-2.5">
              Explore Studio
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <li>
                <button onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E0A96D] transition-colors">
                  Our Story & {info.founder || "Khushbu's Makeover"}
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E0A96D] transition-colors">
                  Royal Bridal & HD Makeup
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E0A96D] transition-colors">
                  Keratin, Botox & Hair Spa
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E0A96D] transition-colors">
                  HydraFacial & 24K Gold Therapy
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E0A96D] transition-colors">
                  Before & After Transformations
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('offers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E0A96D] transition-colors">
                  Bridal Packages & Festive Deals
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#E0A96D] transition-colors">
                  Beauty & Skincare Journal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Visiting Hours (📍 Exact Address Updated) */}
          <div>
            <h5 className="font-serif text-base font-semibold text-white tracking-wide mb-4 border-l-2 border-[#E0A96D] pl-2.5">
              Contact & Hours
            </h5>
            <div className="space-y-3 text-xs sm:text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E0A96D] shrink-0 mt-0.5" />
                <span className="leading-relaxed text-stone-300 font-medium">{addressText}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E0A96D] shrink-0" />
                <a href={`tel:${info.phone?.replace(/\s+/g, '') || '919876543210'}`} className="hover:text-white transition-colors">{info.phone || '+91 98765 43210'}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E0A96D] shrink-0" />
                <a href={`mailto:${info.email || 'appointments@khushboomakeover.com'}`} className="hover:text-white transition-colors">{info.email || 'appointments@khushboomakeover.com'}</a>
              </div>
              <div className="flex items-start gap-2.5 pt-2 border-t border-stone-800">
                <Clock className="w-4 h-4 text-[#E0A96D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-300 font-medium">Mon - Sat: {info.hours?.weekdays || '9:30 AM – 8:30 PM'}</p>
                  <p className="text-stone-400 text-xs">Sunday: {info.hours?.weekends || '9:00 AM – 9:00 PM'}</p>
                  <p className="text-[#E0A96D] text-[11px] font-medium mt-0.5">VIP Bridal: {info.hours?.bridal || '24/7 By Prior VIP Booking'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter & Exclusive Offers */}
          <div>
            <h5 className="font-serif text-base font-semibold text-white tracking-wide mb-4 border-l-2 border-[#E0A96D] pl-2.5">
              The Beauty Gazette
            </h5>
            <p className="text-xs text-stone-400 mb-3">
              Subscribe for exclusive pre-bridal skincare tips, secret discount coupons, and VIP event invitations.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-900 border border-stone-700 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:border-[#E0A96D]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#E0A96D] hover:bg-[#C58F5E] text-stone-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>New Register Inner Circle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {newsletterSubscribed && (
              <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Thank you! Your 15% VIP welcome coupon is on its way.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {info.name || "Khushbu's Makeover"}. All Rights Reserved. Master Bridal Studio.</p>
          <div className="flex items-center gap-6">
            <button onClick={onOpenPrivacy} className="hover:text-stone-300 transition-colors">Privacy Policy</button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:text-stone-300 transition-colors">Terms of Service</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('contact')} className="hover:text-stone-300 transition-colors">Studio Map & Directions</button>
          </div>
        </div>
      </div>
    </footer>
  );
};