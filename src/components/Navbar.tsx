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
            <s