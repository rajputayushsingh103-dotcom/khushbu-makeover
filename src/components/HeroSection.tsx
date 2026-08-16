import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowRight, Star, Award, ShieldCheck, Heart, Users, Clock, Play } from 'lucide-react';
import { Service, SalonInfo } from '../types';
import { SALON_INFO as DEFAULT_SALON_INFO } from '../data/initialData';

interface HeroSectionProps {
  onOpenBooking: (service?: Service) => void;
  onExploreServices: () => void;
  onOpenAIConsult: () => void;
  services: Service[];
  onOpenVideoTour?: () => void;
  salonInfo?: SalonInfo;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onExploreServices,
  onOpenAIConsult,
  services,
  onOpenVideoTour,
  salonInfo = DEFAULT_SALON_INFO
}) => {
  const info = salonInfo || DEFAULT_SALON_INFO;
  const [quickServiceId, setQuickServiceId] = useState(services[0]?.id || '');
  const [quickDate, setQuickDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [quickTime, setQuickTime] = useState('11:30 AM - 01:30 PM');

  const handleQuickBook = () => {
    const svc = services.find(s => s.id === quickServiceId);
    onOpenBooking(svc);
  };

  return (
    <section id="hero-section" className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden pt-8 pb-16 bg-[#161415] text-white">
      {/* Background Image with Luxury Rose Gold Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={info.hero?.backgroundImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85"}
          alt="Luxury Salon Interior"
          className="w-full h-full object-cover object-center opacity-30 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#161415] via-[#161415]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161415] via-transparent to-black/60" />
      </div>

      {/* Decorative Shimmer Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#B76E79]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[30rem] h-[30rem] bg-[#E0A96D]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Subheadline & Action CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Prestige Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#E0A96D]/15 border border-[#E0A96D]/30 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E0A96D]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#E0A96D] uppercase">
                {info.hero?.badgeText || "India's Award-Winning Bridal Studio 2026"}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08]">
                {info.hero?.headlineLine1 || "Where Every Bride"} <br />
                <span className="text-rose-gold-gradient italic font-normal">
                  {info.hero?.headlineLine2 || "Becomes Royalty"}
                </span>
              </h1>
              <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed pt-2">
                {info.hero?.subheadline || (
                  <>
                    Elevate your wedding & celebration glamour with celebrity master artist <strong>{info.founder || 'Khushboo Sharma'}</strong>. 
                    Experience bespoke HD Airbrush makeup, French Balayage, Brazilian Keratin, and HydraFacial MD® in private VIP suites.
                  </>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                id="hero-book-now-cta"
                onClick={() => onOpenBooking()}
                className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#E0A96D]/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5"
              >
                <Calendar className="w-4 h-4" />
                <span>{info.hero?.primaryCtaText || "Reserve Appointment"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-ai-consult-cta"
                onClick={onOpenAIConsult}
                className="px-6 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-[#E0A96D]/20 text-[#E0A96D] border border-[#E0A96D]/40 backdrop-blur-md font-semibold text-sm sm:text-base transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-[#E0A96D]" />
                <span>{info.hero?.secondaryCtaText || "AI Bridal Stylist"}</span>
              </button>

              <button
                onClick={onExploreServices}
                className="px-5 py-3.5 text-stone-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <span>View Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-8 border-t border-stone-800 text-stone-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-white">{info.stats?.rating || '4.95'} / 5.0</span>
                <span className="text-stone-500">({info.stats?.bridesCount || '12,500+'} Verified Reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E0A96D]" />
                <span className="text-stone-300 font-medium">100% Authentic Luxury Brands</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card + Live Transformation Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E0A96D]/40 group bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=85"
                alt="Khushboo Makeover Signature Royal Bride"
                className="w-full aspect-[4/5] object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Real-Bride Badge */}
              <div className="absolute top-4 right-4 bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E0A96D]/40 text-xs font-semibold text-[#E0A96D] flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3 text-[#E0A96D]" />
                <span>By {info.founder || 'Khushboo Sharma'}</span>
              </div>

              {/* Bottom Card Info */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/65 backdrop-blur-md border border-white/10 space-y-1">
                <p className="text-xs font-bold text-[#E0A96D] uppercase tracking-wider">Signature Creation</p>
                <h4 className="font-serif text-lg font-bold text-white">Royal Crimson HD Airbrush Transformation</h4>
                <p className="text-xs text-stone-300">Curated with Dior Backstage, Charlotte Tilbury & 24K Gold prep.</p>
              </div>
            </div>

            {/* Floating Quick Feature Card */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-stone-900/95 backdrop-blur-md p-4 rounded-2xl border border-[#E0A96D]/30 shadow-2xl items-center gap-3.5 z-20">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#E0A96D] flex items-center justify-center text-white shrink-0 shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium">Certified Excellence</p>
                <p className="text-sm font-bold text-white">London & Zurich Certified</p>
                <p className="text-[11px] text-[#E0A96D]">{info.stats?.yearsExperience || '15+'} Years Master Artistry</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Booking Bar Floating Strip */}
        <div className="mt-14 lg:mt-16 bg-[#1F1C1D]/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-[#E0A96D]/30 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#E0A96D]" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Instant Online Slot Reservation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
            {/* Pick Service */}
            <div>
              <label className="block text-[11px] text-stone-400 uppercase font-semibold mb-1">1. Choose Service</label>
              <select
                value={quickServiceId}
                onChange={(e) => setQuickServiceId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-[#E0A96D]"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.title} (₹{s.price.toLocaleString()})</option>
                ))}
              </select>
            </div>

            {/* Pick Date */}
            <div>
              <label className="block text-[11px] text-stone-400 uppercase font-semibold mb-1">2. Preferred Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-[#E0A96D]"
              />
            </div>

            {/* Pick Time */}
            <div>
              <label className="block text-[11px] text-stone-400 uppercase font-semibold mb-1">3. Time Window</label>
              <select
                value={quickTime}
                onChange={(e) => setQuickTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-[#E0A96D]"
              >
                <option value="09:30 AM - 11:30 AM">09:30 AM - 11:30 AM (Morning)</option>
                <option value="11:30 AM - 01:30 PM">11:30 AM - 01:30 PM (Mid-day)</option>
                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                <option value="04:30 PM - 06:30 PM">04:30 PM - 06:30 PM (Evening)</option>
                <option value="06:30 PM - 08:30 PM">06:30 PM - 08:30 PM (Night)</option>
              </select>
            </div>

            {/* Book Now Button */}
            <div className="pt-2 sm:pt-4">
              <button
                id="hero-instant-quick-book-btn"
                onClick={handleQuickBook}
                className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#E0A96D]/20 hover:shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Selected Slot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Salon Metric Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-stone-800/80 text-center">
          <div>
            <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#E0A96D]">{info.stats?.bridesCount || '12,500+'}</span>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Bridal Makeovers</p>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#E0A96D]">{info.stats?.yearsExperience || '15+'}</span>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Years of Mastery</p>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#E0A96D]">{info.stats?.rating || '4.95'} ★</span>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Client Satisfaction</p>
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#E0A96D]">{info.stats?.stylists || '35+'}</span>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Certified Artists</p>
          </div>
        </div>
      </div>
    </section>
  );
};
