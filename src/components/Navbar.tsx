import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Moon, Sun, Search, Menu, X, Shield, Phone, ArrowRight, User } from 'lucide-react';
import { PageView, Service, SalonInfo } from '../types';
import { SALON_INFO as DEFAULT_SALON_INFO } from '../data/initialData';
import { UserLoginPage } from './UserLoginPage';
import { UserProfileModal } from './UserProfileModal';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenBooking: (service?: Service) => void;
  services: Service[];
  onSelectService: (service: Service) => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  salonInfo?: SalonInfo;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  darkMode,
  setDarkMode,
  onOpenBooking,
  services,
  onSelectService,
  isAdminLoggedIn,
  onOpenAdmin,
  salonInfo = DEFAULT_SALON_INFO
}) => {
  const info = salonInfo || DEFAULT_SALON_INFO;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // User Authentication States
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; picture: string } | null>(() => {
    try {
      const saved = localStorage.getItem('km_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('km_user');
    setCurrentUser(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: PageView }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Reviews', page: 'reviews' },
    { label: 'Offers', page: 'offers' },
    { label: 'Beauty Blog', page: 'blog' },
    { label: 'Contact & Location', page: 'contact' },
  ];

  const filteredServices = searchQuery.trim()
    ? services.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleNavClick = (page: PageView) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nameParts = (info.name || 'Khushboo Makeover').split(' ');
  const firstName = nameParts[0] || 'Khushboo';
  const restName = nameParts.slice(1).join(' ') || 'Makeover';
  const initials = ((nameParts[0]?.[0] || 'K') + (nameParts[1]?.[0] || 'M')).toUpperCase();

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div id="top-announcement-bar" className="bg-[#1C1819] text-[#E0A96D] text-xs py-1.5 px-4 tracking-wider border-b border-[#E0A96D]/20 z-50 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left font-medium">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-rose-300">
              <Sparkles className="w-3.5 h-3.5 text-[#E0A96D] animate-spin" style={{ animationDuration: '8s' }} />
              2026 Bridal Bookings Now Open!
            </span>
            <span className="hidden md:inline text-stone-400">|</span>
            <span className="hidden md:inline text-stone-300">Flat 20% OFF with code: <strong className="text-[#E0A96D]">ROYALBRIDAL2026</strong></span>
          </div>

          <div className="flex items-center gap-4 text-stone-300">
            <a href={`tel:${info.phone.replace(/\s+/g, '')}`} className="flex items-center gap-1 hover:text-[#E0A96D] transition-colors">
              <Phone className="w-3 h-3 text-[#E0A96D]" />
              <span className="hidden sm:inline">{info.phone}</span>
            </a>
            <span className="text-stone-500">|</span>
            <button
              id="admin-login-top-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-[#E0A96D] transition-colors"
            >
              <Shield className="w-3 h-3 text-[#E0A96D]" />
              {isAdminLoggedIn ? 'Admin Panel' : 'Staff Portal'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Luxury Sticky Navbar */}
      <header
        id="main-salon-navbar"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F5]/95 dark:bg-[#161415]/95 backdrop-blur-md shadow-md shadow-black/5 dark:shadow-black/40 py-3 border-b border-[#E0A96D]/20'
            : 'bg-[#FAF7F5]/90 dark:bg-[#161415]/90 backdrop-blur-sm py-4 border-b border-[#E0A96D]/15'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#B76E79] via-[#E0A96D] to-[#F3D1A5] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-[#1A1818] flex items-center justify-center">
                <span className="font-serif text-lg font-bold text-[#E0A96D] tracking-tighter">{initials}</span>
              </div>
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1A1818] dark:text-[#FBF7F5] group-hover:text-[#B76E79] dark:group-hover:text-[#E0A96D] transition-colors flex items-center gap-1.5">
                {firstName}
                <span className="font-light italic text-[#B76E79] dark:text-[#E0A96D]">{restName}</span>
              </span>
              <span className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500 dark:text-stone-400">
                {info.tagline || 'Luxury Bridal Studio & Salon'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  id={`nav-link-${link.page}`}
                  onClick={() => handleNavClick(link.page)}
                  className={`px-3.5 py-2 text-sm font-medium transition-all duration-200 relative rounded-full ${
                    isActive
                      ? 'text-[#8C5E35] dark:text-[#E0A96D] font-semibold bg-[#E0A96D]/15 dark:bg-[#E0A96D]/10'
                      : 'text-stone-700 dark:text-stone-300 hover:text-[#B76E79] dark:hover:text-[#E0A96D] hover:bg-stone-100 dark:hover:bg-stone-800/40'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#B76E79] dark:bg-[#E0A96D] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Search, Theme Toggle, User Login, Book Appointment */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <div className="relative">
              <button
                id="search-toggle-btn"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
                aria-label="Search Services"
                title="Search services"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Quick Search Popover */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#1E1C1D] rounded-2xl shadow-2xl border border-[#E0A96D]/30 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search bridal, hair, facials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-8 py-2 text-sm bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 absolute right-2.5 top-2.5"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Search Results dropdown */}
                  {searchQuery.trim() && (
                    <div className="mt-2 divide-y divide-stone-100 dark:divide-stone-800 max-h-60 overflow-y-auto">
                      {filteredServices.length > 0 ? (
                        filteredServices.map(service => (
                          <div
                            key={service.id}
                            onClick={() => {
                              onSelectService(service);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="py-2 px-2 hover:bg-[#E0A96D]/10 dark:hover:bg-[#E0A96D]/15 rounded-lg cursor-pointer flex items-center justify-between text-left transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <img src={service.image} alt={service.title} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="text-xs font-semibold text-stone-900 dark:text-white line-clamp-1">{service.title}</p>
                                <p className="text-[10px] text-[#B76E79] dark:text-[#E0A96D]">{service.categoryLabel} • ₹{service.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-stone-500 dark:text-stone-400 py-3 text-center">No matching services found.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle Theme"
              title={darkMode ? "Switch to Luxury Light" : "Switch to Midnight Rose"}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-[#E0A96D] animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-[#8C5E35]" />
              )}
            </button>

            {/* ⭐ USER GOOGLE LOGIN & PROFILE BUTTON */}
            {currentUser ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 p-1 sm:pr-3 rounded-full border border-[#E0A96D]/30 transition-all shadow-sm"
                title="View My Bookings & Profile"
              >
                <img
                  src={currentUser.picture}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full border border-[#E0A96D] object-cover"
                />
                <span className="hidden sm:inline text-xs font-semibold text-stone-800 dark:text-stone-200">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E0A96D]/40 text-stone-700 dark:text-stone-200 hover:bg-[#E0A96D]/15 text-xs font-medium transition-all"
              >
                <User className="w-3.5 h-3.5 text-[#E0A96D]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Book Appointment CTA Button */}
            <button
              id="header-book-appointment-btn"
              onClick={() => onOpenBooking()}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#E0A96D]/20 hover:shadow-lg hover:shadow-[#E0A96D]/35 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-700 dark:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F5] dark:bg-[#161415] border-b border-[#E0A96D]/20 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-300">
            
            {/* Mobile User Profile Button */}
            <div className="pb-2">
              {currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={currentUser.picture} className="w-9 h-9 rounded-full border border-amber-500" alt={currentUser.name} />
                    <div className="text-left">
                      <p className="text-sm font-bold text-stone-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">View My Bookings</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 border border-stone-300/40 dark:border-stone-700"
                >
                  <User className="w-4 h-4 text-[#E0A96D]" />
                  Sign In with Google
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map(link => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className={`py-2.5 px-4 rounded-xl text-left text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E0A96D]/20 text-[#8C5E35] dark:text-[#E0A96D] font-bold border border-[#E0A96D]/30'
                        : 'bg-white/60 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <Calendar className="w-4 h-4" />
                Book Your VIP Appointment
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 rounded-xl border border-[#E0A96D]/30 text-stone-600 dark:text-stone-300 text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#E0A96D]/10"
              >
                <Shield className="w-3.5 h-3.5 text-[#E0A96D]" />
                {isAdminLoggedIn ? 'Open Admin Portal' : 'Admin & Staff Login'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* User Login Modal */}
      <UserLoginPage
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* User Profile & Bookings History Modal */}
      {currentUser && (
        <UserProfileModal
          user={currentUser}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};