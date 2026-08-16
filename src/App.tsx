import { AuthScreen } from './components/AuthScreen';
import React, { useState, useEffect } from 'react';
import {
  Sparkles, Calendar, ArrowRight, Star, Award, ShieldCheck, Heart, Users,
  Clock, CheckCircle2, Phone, MapPin, Search, Filter, MessageCircle, ChevronRight,
  Eye, Tag, HelpCircle, BookOpen, Scissors, Flame, Gem, Shield, Plus, Check
} from 'lucide-react';
import { PageView, Service, Appointment, Review, GalleryItem, Offer } from './types';
import { salonService } from './services/salonService';
import { SALON_INFO, INITIAL_SERVICES } from './data/initialData';

// Component Imports
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServiceCard } from './components/ServiceCard';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { AppointmentModal } from './components/AppointmentModal';
import { AddServiceModal } from './components/AddServiceModal';
import { BeautyAIAssistant } from './components/BeautyAIAssistant';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutSection } from './components/AboutSection';
import { GalleryLightbox } from './components/GalleryLightbox';
import { ReviewSection } from './components/ReviewSection';
import { OffersSection } from './components/OffersSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { Footer } from './components/Footer';
import { FloatingSocialWidget } from './components/FloatingSocialWidget';
import { ScrollToTop } from './components/ScrollToTop';
import { LegalModals } from './components/LegalModals';

export default function App() {
  // ⭐ User Login & Auth State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('km_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation & View State
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('km_theme');
      if (saved) return saved === 'dark';
      return false; // Default to luxury warm light
    } catch {
      return false;
    }
  });

  // Main Data States
  const [services, setServices] = useState<Service[]>(() => salonService.getServices());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>(() => salonService.getReviews());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => salonService.getGallery());
  const [offers, setOffers] = useState<Offer[]>(() => salonService.getOffers());

  // Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [serviceAddedNotification, setServiceAddedNotification] = useState<string | null>(null);
  const [isAIConsultOpen, setIsAIConsultOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  // Services Catalog Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [priceSort, setPriceSort] = useState<'default' | 'low-to-high' | 'high-to-low'>('default');

  // 🔒 AGAR USER LOGIN NAHI HAI TO SIRF AUTH/LOGIN SCREEN DIKHEGI:
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }
  // Synchronize Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('km_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('km_theme', 'light');
    }
  }, [darkMode]);

  // Load appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await salonService.getAppointments();
      setAppointments(data);
    };
    fetchAppointments();
  }, []);

  // Handlers
  const handleOpenBooking = (service?: Service) => {
    setSelectedServiceForBooking(service || null);
    setIsBookingOpen(true);
  };

  const handleOpenServiceDetail = (service: Service) => {
    setDetailService(service);
  };

  const handleAppointmentCreated = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
  };

  const handleServiceAdded = (newSvc: Service) => {
    setServices(prev => [newSvc, ...prev]);
    setServiceAddedNotification(`✨ "${newSvc.title}" has been successfully added with price ₹${newSvc.price.toLocaleString()} and is now live!`);
    setSelectedCategory('all');
    setServiceSearch('');
    setTimeout(() => {
      setServiceAddedNotification(null);
    }, 6000);
  };

  const handleReviewAdded = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const handleClaimOffer = (offer: Offer) => {
    handleOpenBooking();
  };

  // Filtered Services List
  const filteredServices = services
    .filter(svc => {
      const matchesCategory = selectedCategory === 'all' || svc.category === selectedCategory;
      const matchesSearch =
        svc.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        svc.categoryLabel.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        svc.description.toLowerCase().includes(serviceSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (priceSort === 'low-to-high') return a.price - b.price;
      if (priceSort === 'high-to-low') return b.price - a.price;
      return 0;
    });

  const featuredServices = services.filter(s => s.isFeatured || s.isPopular).slice(0, 6);

  const categoriesList = [
    { id: 'all', label: 'All Services' },
    { id: 'bridal', label: 'Royal Bridal' },
    { id: 'hd-makeup', label: 'HD Makeup' },
    { id: 'hair', label: 'Hair & Spa' },
    { id: 'skin', label: 'Skin & Facials' },
    { id: 'nails', label: 'Nails & Lashes' },
    { id: 'mehendi', label: 'Mehendi' },
    { id: 'packages', label: 'VIP Packages' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F5] dark:bg-[#141213] text-stone-900 dark:text-stone-100 transition-colors duration-300 font-sans flex flex-col justify-between selection:bg-[#E0A96D]/30 selection:text-[#8C5E35]">
      {/* Sticky Header Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenBooking={handleOpenBooking}
        services={services}
        onSelectService={(s) => {
          setDetailService(s);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Dynamic Main Body Content */}
      <main className="flex-1">
        {/* ========================================================================= */}
        {/* VIEW 1: HOME PAGE */}
        {/* ========================================================================= */}
        {currentPage === 'home' && (
          <div className="space-y-20 pb-20">
            {/* 1. Hero Section */}
            <HeroSection
              onOpenBooking={handleOpenBooking}
              onExploreServices={() => {
                setCurrentPage('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAIConsult={() => setIsAIConsultOpen(true)}
              services={services}
            />

            {/* 2. Why Choose Khushboo Makeover (Prestige Pillars) */}
            <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  The Gold Standard of Beauty
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
                  Why Discerning Brides Choose Us
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                  Every ritual at Khushboo Makeover is orchestrated with clinical precision, international luxury brands, and personal care.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                {/* Pillar 1 */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A1B] border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B76E79] to-[#E0A96D] flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white mb-2">
                    15+ Years Celebrity Mastery
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Led personally by Master Artist Khushboo Sharma with global diplomas from London and Zurich. Over 12,500 royal brides styled.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A1B] border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B76E79] to-[#E0A96D] flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                    <Gem className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white mb-2">
                    100% Authentic Luxury Brands
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Zero compromise. We exclusively formulate using Dior, Charlotte Tilbury, Huda Beauty, MAC, Kérastase Paris, and Olaplex.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A1B] border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B76E79] to-[#E0A96D] flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white mb-2">
                    Hospital-Grade UV Sanitation
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Strict medical-grade hygiene protocols. All brushes and beauty instruments undergo ultrasonic and UV-C disinfection after every client.
                  </p>
                </div>

                {/* Pillar 4 */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A1B] border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B76E79] to-[#E0A96D] flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white mb-2">
                    Private VIP Dressing Suites
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Luxurious private bridal suites with personalized mood lighting, beverage service, and dedicated family vanity areas for serene preparation.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Featured Services Showcase */}
            <section id="featured-services-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Signature Collection
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
                    Most Loved Salon & Bridal Experiences
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                    Carefully curated treatments loved by brides, influencers, and beauty enthusiasts.
                  </p>
                </div>

                <button
                  id="view-all-services-btn"
                  onClick={() => {
                    setCurrentPage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E0A96D]/40 text-[#8C5E35] dark:text-[#E0A96D] hover:bg-[#E0A96D]/10 font-semibold text-xs sm:text-sm transition-colors self-start sm:self-auto"
                >
                  <span>Explore Complete Menu ({services.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onBookNow={handleOpenBooking}
                    onViewDetails={handleOpenServiceDetail}
                  />
                ))}
              </div>
            </section>

            {/* 4. Interactive Transformation Spotlight (Before & After Slider) */}
            <section id="transformation-spotlight" className="bg-[#1C1A1B] text-white py-16 sm:py-20 border-y border-[#E0A96D]/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-6 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      Live Transformation Artistry
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                      See the Real Magic of <br />
                      <span className="text-rose-gold-gradient italic font-normal">
                        Bespoke Bridal Craft
                      </span>
                    </h2>

                    <p className="text-sm text-stone-300 leading-relaxed font-light">
                      We highlight your authentic bone structure, enhance eye depth, and create skin that glows with dewy perfection under 4K video cameras and flashbulbs.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-300">
                        <CheckCircle2 className="w-4 h-4 text-[#E0A96D] shrink-0" />
                        <span>Weightless HD Airbrush Micro-Mist application</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-300">
                        <CheckCircle2 className="w-4 h-4 text-[#E0A96D] shrink-0" />
                        <span>24-Hour sweatproof, tearproof & transfer-resistant longevity</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-300">
                        <CheckCircle2 className="w-4 h-4 text-[#E0A96D] shrink-0" />
                        <span>Customized contouring tailored for Indian skin tones</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => handleOpenBooking()}
                        className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#E0A96D]/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Book Your Transformation
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('gallery');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-5 py-3.5 text-stone-300 hover:text-[#E0A96D] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <span>View 50+ Gallery Looks</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <BeforeAfterSlider
                      beforeImage="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
                      afterImage="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80"
                      beforeLabel="Pre-Treatment Bare Skin"
                      afterLabel="Royal HD Airbrush Bride"
                      title="Bride Natasha • Grand Royal Sangeet & Pheras"
                      tag="Look: Crimson Velvet with 3D Silk Lashes"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 5. AI Bridal Stylist Feature Banner */}
            <section id="ai-stylist-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-[#241B1C] via-[#332224] to-[#1F1819] rounded-3xl p-8 sm:p-12 border border-[#E0A96D]/30 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#E0A96D]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/20 text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                      Instant AI Beauty & Outfit Consultation
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                      Confused About Your Makeup & Hairstyle?
                    </h3>
                    <p className="text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-light">
                      Describe your outfit color, event type, and skin tone. Our AI Beauty Stylist trained on Khushboo Sharma’s bridal aesthetics will generate a custom hair, makeup, and pre-bridal schedule in seconds!
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex justify-start lg:justify-end">
                    <button
                      id="home-open-ai-consult-btn"
                      onClick={() => setIsAIConsultOpen(true)}
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-sm shadow-xl shadow-[#E0A96D]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>Launch AI Bridal Stylist</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Client Testimonials & Star Reviews Preview */}
            <section id="home-reviews-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider mb-2">
                    <Star className="w-3.5 h-3.5 fill-[#E0A96D]" />
                    Real Love & Praise
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
                    Words from Our Glowing Brides
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                    Rated 4.95 / 5.0 across 1,250+ verified wedding & salon reviews.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentPage('reviews');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E0A96D]/40 text-[#8C5E35] dark:text-[#E0A96D] hover:bg-[#E0A96D]/10 font-semibold text-xs sm:text-sm transition-colors self-start sm:self-auto"
                >
                  <span>Read All Client Reviews</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.slice(0, 3).map(rev => (
                  <div
                    key={rev.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#1C1A1B] border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        {rev.verified && (
                          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Verified Bride
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-white">{rev.name}</h4>
                        <p className="text-[11px] text-[#8C5E35] dark:text-[#E0A96D]">{rev.service} • {rev.city || 'Mumbai'}</p>
                      </div>
                      <span className="text-[10px] text-stone-400">{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Limited-Time Bridal & Festive Deals Strip */}
            <section id="home-deals-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                    <Tag className="w-3 h-3" />
                    Special 2026 Season Promo
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                    Pre-Book 2026 Bridal Package & Get 20% Flat Discount
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90">
                    Use coupon code <strong>ROYALBRIDAL2026</strong> at online checkout. Includes complimentary Airbrush trial!
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setCurrentPage('offers');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-full bg-stone-950 hover:bg-stone-900 text-white text-xs sm:text-sm font-bold shadow-lg transition-colors"
                  >
                    View All Offers
                  </button>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="px-6 py-3 rounded-full bg-white text-stone-900 hover:bg-stone-100 text-xs sm:text-sm font-bold shadow-lg transition-colors"
                  >
                    Claim Discount Now
                  </button>
                </div>
              </div>
            </section>

            {/* 8. Studio FAQ Preview */}
            <section id="home-faq-preview" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FaqSection />
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ABOUT US */}
        {/* ========================================================================= */}
        {currentPage === 'about' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Page Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Celebrity Bridal Studio
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white">
                About Khushboo Makeover
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                15 years of curating regal memories, timeless transformations, and clinical beauty excellence.
              </p>
            </div>

            <AboutSection onOpenBooking={handleOpenBooking} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: SERVICES CATALOG */}
        {/* ========================================================================= */}
        {currentPage === 'services' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Success Notification after adding a makeup service */}
            {serviceAddedNotification && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{serviceAddedNotification}</span>
                </div>
                <button
                  onClick={() => setServiceAddedNotification(null)}
                  className="text-stone-400 hover:text-stone-600 p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
                  <Scissors className="w-3.5 h-3.5" />
                  The Luxury Menu
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white">
                  Salon & Bridal Services
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                  Explore our international bridal artistry, HD reception looks, and luxury treatments.
                </p>
              </div>

              {/* Add Custom Makeup / Service Action Button */}
              <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                <button
                  id="open-add-service-btn"
                  onClick={() => setIsAddServiceOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#E0A96D]/25 hover:opacity-95 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add Makeup / Service</span>
                </button>
              </div>
            </div>

            {/* Filter Bar & Search */}
            <div className="bg-white dark:bg-[#1C1A1B] rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-lg space-y-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search Box */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search by name, treatment, or brand..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  {serviceSearch && (
                    <button
                      onClick={() => setServiceSearch('')}
                      className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Sort dropdown & AI helper & Quick Add */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-stone-400" />
                    <select
                      value={priceSort}
                      onChange={(e: any) => setPriceSort(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#E0A96D]"
                    >
                      <option value="default">Featured First</option>
                      <option value="low-to-high">Price: Low to High</option>
                      <option value="high-to-low">Price: High to Low</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsAIConsultOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] hover:bg-[#E0A96D]/25 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-[#E0A96D]/30"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Recommender</span>
                  </button>

                  <button
                    onClick={() => setIsAddServiceOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-stone-800 text-stone-100 hover:bg-stone-800 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-stone-700"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#E0A96D]" />
                    <span>Add New Makeup</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categoriesList.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#B76E79] to-[#E0A96D] text-white shadow-md shadow-[#E0A96D]/25'
                          : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onBookNow={handleOpenBooking}
                    onViewDetails={handleOpenServiceDetail}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-[#1C1A1B] rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
                <Search className="w-8 h-8 text-stone-400 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-white">No Matching Services Found</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing your search keyword or add a new custom makeup look to this catalog.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setServiceSearch('');
                    }}
                    className="px-5 py-2.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold text-xs transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsAddServiceOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E0A96D] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Custom Makeup Look</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: GALLERY & PORTFOLIO */}
        {/* ========================================================================= */}
        {currentPage === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5" />
                Artistry Portfolio
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white">
                Transformation Gallery
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Explore real bridal makeovers, HD contouring, French balayage, and luxurious salon interiors.
              </p>
            </div>

            <GalleryLightbox
              galleryItems={gallery}
              onOpenBooking={handleOpenBooking}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: REVIEWS & TESTIMONIALS */}
        {/* ========================================================================= */}
        {currentPage === 'reviews' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-[#E0A96D]" />
                Client Testimonials
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white">
                Bride & Client Reviews
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Real feedback from our brides, fashion models, and regular salon patrons.
              </p>
            </div>

            <ReviewSection
              reviews={reviews}
              services={services}
              onReviewAdded={handleReviewAdded}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 6: OFFERS & PACKAGES */}
        {/* ========================================================================= */}
        {currentPage === 'offers' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                VIP Discounts & Packages
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white">
                Exclusive Salon Offers
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Claim bridal combo codes, festive pampering vouchers, and first-visit luxury privileges.
              </p>
            </div>

            <OffersSection
              offers={offers}
              onClaimOffer={handleClaimOffer}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 7: BEAUTY BLOG */}
        {/* ========================================================================= */}
        {currentPage === 'blog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <BlogSection onOpenBooking={handleOpenBooking} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 8: CONTACT & LOCATION */}
        {/* ========================================================================= */}
        {currentPage === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                Visit Our Studio
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white">
                Get In Touch With Khushboo
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Book a personalized studio walkthrough, bridal consultation, or on-location wedding booking.
              </p>
            </div>

            <ContactSection />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
        onOpenBooking={handleOpenBooking}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      {/* ⭐ Floating Action Utilities: WhatsApp & Instagram Multi-Button */}
      <FloatingSocialWidget />
      <ScrollToTop />

      {/* ========================================================================= */}
      {/* GLOBAL MODALS */}
      {/* ========================================================================= */}

      {/* 1. Appointment Booking Modal */}
      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedServiceForBooking(null);
        }}
        selectedService={selectedServiceForBooking}
        services={services}
        offers={offers}
        onAppointmentCreated={handleAppointmentCreated}
      />

      {/* 2. Service Detail Modal */}
      <ServiceDetailModal
        service={detailService}
        onClose={() => setDetailService(null)}
        onBookService={(s) => {
          setDetailService(null);
          handleOpenBooking(s);
        }}
      />

      {/* 3. Add Custom Makeup / Service Modal */}
      <AddServiceModal
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        onServiceAdded={handleServiceAdded}
      />

      {/* 4. AI Beauty Assistant Modal */}
      <BeautyAIAssistant
        isOpen={isAIConsultOpen}
        onClose={() => setIsAIConsultOpen(false)}
        onOpenBooking={handleOpenBooking}
        services={services}
      />

      {/* 5. Staff & Admin Portal Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        appointments={appointments}
        setAppointments={setAppointments}
        services={services}
        setServices={setServices}
        reviews={reviews}
        setReviews={setReviews}
        gallery={gallery}
        setGallery={setGallery}
        offers={offers}
        setOffers={setOffers}
        isLoggedIn={isAdminLoggedIn}
        setIsLoggedIn={setIsAdminLoggedIn}
      />

      {/* 6. Legal Terms & Privacy Modal */}
      <LegalModals
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}