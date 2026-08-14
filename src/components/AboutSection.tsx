import React from 'react';
import { Sparkles, Award, Star, CheckCircle2, Heart, Instagram, Users, ShieldCheck, Clock, Calendar } from 'lucide-react';
import { TEAM_MEMBERS, SALON_INFO as DEFAULT_SALON_INFO } from '../data/initialData';
import { SalonInfo } from '../types';

interface AboutSectionProps {
  onOpenBooking: () => void;
  salonInfo?: SalonInfo;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenBooking,
  salonInfo = DEFAULT_SALON_INFO
}) => {
  const info = salonInfo || DEFAULT_SALON_INFO;

  const timelineMilestones = [
    {
      year: '2011',
      title: 'The Inception & First Studio',
      description: `Founded by ${info.founder || 'Khushboo Sharma'} after completing international makeup diploma in London, pioneering luxury bridal airbrush techniques in Mumbai.`
    },
    {
      year: '2015',
      title: 'Celebrity Makeup & Fashion Weeks',
      description: 'Became the preferred bridal and red carpet artistry studio for Bollywood celebrities, models, and international destination weddings.'
    },
    {
      year: '2019',
      title: 'State-of-the-Art Aesthetic Center',
      description: 'Expanded into a luxury beauty arcade featuring VIP private suites, Kérastase caviar bar, and HydraFacial MD® clinical suites.'
    },
    {
      year: '2023',
      title: 'National Bridal Studio of the Year',
      description: 'Awarded India’s Best Bridal Makeup & Hair Artistry Studio by the International Beauty Excellence Guild.'
    },
    {
      year: '2026',
      title: `${info.stats?.bridesCount || '12,500+'} Happy Brides & Beyond`,
      description: 'Continuing the legacy of crafting timeless, bespoke elegance for brides across the globe.'
    }
  ];

  const certifications = [
    { name: 'London School of Makeup & Fashion Artistry (UK)', year: 'Honorary Fellow' },
    { name: 'CIDESCO International Certified Esthetics (Zurich)', year: 'Master Diploma' },
    { name: 'HydraFacial MD® Medical Grade Certified Specialist', year: 'Authorized Studio' },
    { name: 'Kérastase Paris Advanced Hair Reconstruction Master', year: 'Flagship Partner' },
    { name: 'Olaplex USA Bond Multiplying Certified Artistry', year: 'Gold Tier' }
  ];

  return (
    <div id="about-us-component" className="space-y-16 py-6">
      {/* 1. Founder Story & Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E0A96D]/40 bg-stone-900">
            <img
              src={info.founderImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"}
              alt={`${info.founder || 'Khushboo Sharma'} Founder`}
              className="w-full aspect-[4/5] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#E0A96D] font-bold">Founder & Creative Director</span>
              <h3 className="font-serif text-2xl font-bold">{info.founder || 'Khushboo Sharma'}</h3>
              <p className="text-xs text-stone-300">{info.founderTitle || 'Celebrity Makeup Artist • 15+ Years Mastery'}</p>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 bg-stone-900 p-4 rounded-2xl border border-[#E0A96D]/40 shadow-xl hidden sm:flex items-center gap-3">
            <Award className="w-8 h-8 text-[#E0A96D]" />
            <div>
              <p className="text-xs text-stone-400">Awarded</p>
              <p className="text-sm font-bold text-white">Best Bridal Artist</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Our Heritage & Story
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white leading-tight">
            Crafting Unforgettable Elegance with Passion & Precision
          </h2>

          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {info.about?.storyP1 || `At ${info.name || 'Khushboo Makeover'}, we believe every woman possesses a distinctive radiance. Our mission is not to mask your features, but to sculpt, illuminate, and celebrate your natural beauty with world-class artistry and supreme dermatological care.`}
          </p>

          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {info.about?.storyP2 || 'From our private bridal dressing sanctuaries to our clinical HydraFacial suites, every touchpoint is designed to deliver absolute relaxation, hygiene, and imperial luxury.'}
          </p>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1A1B] border border-stone-200 dark:border-stone-800 shadow-sm">
              <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 text-[#8C5E35] dark:text-[#E0A96D]">
                <Heart className="w-4 h-4" />
                Our Mission
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                {info.about?.mission || 'To deliver flawless, confidence-boosting bridal artistry and aesthetic therapies with zero-compromise hygiene and top global cosmetic brands.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1A1B] border border-stone-200 dark:border-stone-800 shadow-sm">
              <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 text-[#8C5E35] dark:text-[#E0A96D]">
                <Sparkles className="w-4 h-4" />
                Our Vision
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                {info.about?.vision || 'To set the benchmark for luxury bridal transformations and hair/skin aesthetics across India through authentic international products and innovation.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Master Artists & Team */}
      <div className="space-y-8 pt-8 border-t border-stone-200 dark:border-stone-800">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#B76E79] dark:text-[#E0A96D] font-bold">The Artistry Collective</span>
          <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">Meet Our Master Artists</h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
            Each specialist brings over a decade of dedicated expertise, global certification, and passion to every appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map(member => (
            <div
              key={member.id}
              className="bg-white dark:bg-[#1C1A1B] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-900">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold text-[#E0A96D] tracking-wider block">{member.experience}</span>
                  <h4 className="font-serif text-lg font-bold">{member.name}</h4>
                  <p className="text-xs text-stone-300">{member.role}</p>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{member.rating} ({member.reviewsCount})</span>
                  </div>
                  {member.instagram && (
                    <span className="text-[11px] text-[#B76E79] dark:text-[#E0A96D]">{member.instagram}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Certifications & Global Affiliations */}
      <div className="bg-white dark:bg-[#1C1A1B] rounded-3xl p-8 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#B76E79] dark:text-[#E0A96D] font-bold">Uncompromising Standards</span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mt-1">
            Global Accreditations & Certifications
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, i) => (
            <div key={i} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#E0A96D] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-xs text-stone-900 dark:text-white leading-snug">{cert.name}</h5>
                <span className="text-[10px] text-[#8C5E35] dark:text-[#E0A96D] font-bold block mt-1">{cert.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 15-Year Timeline */}
      <div className="space-y-8 pt-4">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#B76E79] dark:text-[#E0A96D] font-bold">Our Journey</span>
          <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">15-Year Experience Timeline</h3>
        </div>

        <div className="relative border-l-2 border-[#E0A96D]/40 ml-4 sm:ml-32 space-y-8 pl-6 sm:pl-8">
          {timelineMilestones.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Year marker on the left */}
              <div className="sm:absolute sm:-left-36 top-0 font-serif text-lg font-bold text-[#8C5E35] dark:text-[#E0A96D]">
                {item.year}
              </div>

              {/* Dot on line */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#E0A96D] border-4 border-[#FAF7F5] dark:border-[#161415] shadow-md group-hover:scale-125 transition-transform" />

              <div className="bg-white dark:bg-[#1C1A1B] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">{item.title}</h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
