import React, { useState, useEffect } from 'react';
import {
  Shield, Calendar, Users, DollarSign, Star, Plus, Trash2, CheckCircle,
  Clock, XCircle, AlertCircle, Edit, Search, ArrowRight, Share2, Tag, Image as ImageIcon,
  Sparkles, Lock, LogOut, Check, Filter, Upload, Camera, Settings, MapPin, Phone,
  Mail, Globe, Save, RefreshCw, Layers, Award, IndianRupee, QrCode, Type
} from 'lucide-react';
import { Appointment, Service, Review, GalleryItem, Offer, SalonInfo } from '../types';
import { salonService } from '../services/salonService';
import { SALON_INFO } from '../data/initialData';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  offers: Offer[];
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  salonInfo?: SalonInfo;
  setSalonInfo?: React.Dispatch<React.SetStateAction<SalonInfo>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  appointments,
  setAppointments,
  services,
  setServices,
  reviews,
  setReviews,
  gallery,
  setGallery,
  offers,
  setOffers,
  isLoggedIn,
  setIsLoggedIn,
  salonInfo = SALON_INFO,
  setSalonInfo
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'services' | 'gallery' | 'reviews' | 'offers' | 'analytics' | 'settings'>('appointments');
  const [siteInfo, setSiteInfo] = useState<SalonInfo>(salonInfo || SALON_INFO);
  const [siteSaveSuccess, setSiteSaveSuccess] = useState(false);
  const [siteSettingsSection, setSiteSettingsSection] = useState<'identity' | 'address' | 'contact' | 'payments' | 'hero' | 'about' | 'stats'>('identity');

  useEffect(() => {
    if (salonInfo) {
      setSiteInfo(salonInfo);
    }
  }, [salonInfo]);

  const [username, setUsername] = useState('khushbusingh');
  const [password, setPassword] = useState('khushbu@6971');
  const [loginError, setLoginError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Services Management State
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [priceFeedback, setPriceFeedback] = useState<Record<string, string>>({});
  const [quickPriceInputs, setQuickPriceInputs] = useState<Record<string, number>>({});
  const [quickOrigPriceInputs, setQuickOrigPriceInputs] = useState<Record<string, number | undefined>>({});

  // Bulk Price Tool
  const [showBulkPriceTool, setShowBulkPriceTool] = useState(false);
  const [bulkCategory, setBulkCategory] = useState<string>('bridal');
  const [bulkPercentage, setBulkPercentage] = useState<number>(10);
  const [bulkNotification, setBulkNotification] = useState<string>('');

  // New Service Modal
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newSvcTitle, setNewSvcTitle] = useState('');
  const [newSvcCategory, setNewSvcCategory] = useState<Service['category']>('bridal');
  const [newSvcPrice, setNewSvcPrice] = useState(14999);
  const [newSvcOriginalPrice, setNewSvcOriginalPrice] = useState<number | undefined>(18999);
  const [newSvcDuration, setNewSvcDuration] = useState('120 mins');
  const [newSvcImage, setNewSvcImage] = useState('https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80');
  const [newSvcDescription, setNewSvcDescription] = useState('');
  const [newSvcBenefits, setNewSvcBenefits] = useState('Airbrush Perfection, 24-hr Longevity, Luxury Kit');
  const [newSvcProducts, setNewSvcProducts] = useState('Charlotte Tilbury, Dior, MAC, Huda Beauty');
  const [newSvcTag, setNewSvcTag] = useState('');
  const [newSvcIsPopular, setNewSvcIsPopular] = useState(false);
  const [newSvcIsFeatured, setNewSvcIsFeatured] = useState(false);

  // New Gallery Item Modal
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState<GalleryItem['category']>('bridal');
  const [newGalImage, setNewGalImage] = useState('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80');
  const [newGalTag, setNewGalTag] = useState('Signature Look');

  // New Offer Modal
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState(20);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();

  if (username === 'khushbusingh' && password === 'khushbu@6971') {
    setIsLoggedIn(true);
    setLoginError('');
  } else {
    setLoginError('Galat Username ya Password! Kripya sahi details daalein.');
  }
};

const handleStatusChange = async (
  aptId: string,
  newStatus: Appointment['status']
) => {
  const updated = await salonService.updateAppointmentStatus(aptId, newStatus);
  setAppointments(updated);
};
  const handleDeleteAppointment = async (aptId: string) => {
    if (confirm('Delete this appointment record?')) {
      const updated = await salonService.deleteAppointment(aptId);
      setAppointments(updated);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvcTitle.trim()) return;

    const benefitsArray = newSvcBenefits
      ? newSvcBenefits.split(',').map(b => b.trim()).filter(Boolean)
      : ['Medical Grade Hygiene', 'Top Global Brands', 'Expert Consultation'];

    const productsArray = newSvcProducts
      ? newSvcProducts.split(',').map(p => p.trim()).filter(Boolean)
      : ['Charlotte Tilbury', 'Dior', 'Huda Beauty', 'MAC'];

    const added = salonService.addService({
      title: newSvcTitle,
      category: newSvcCategory,
      categoryLabel: newSvcCategory.toUpperCase(),
      description: newSvcDescription || 'Luxury personalized salon experience.',
      duration: newSvcDuration,
      price: Number(newSvcPrice),
      originalPrice: newSvcOriginalPrice ? Number(newSvcOriginalPrice) : undefined,
      image: newSvcImage,
      benefits: benefitsArray,
      productsUsed: productsArray,
      tag: newSvcTag || undefined,
      isPopular: newSvcIsPopular,
      isFeatured: newSvcIsFeatured
    });

    setServices([added, ...services]);
    setShowAddServiceModal(false);
    setNewSvcTitle('');
    setNewSvcDescription('');
    setNewSvcTag('');
  };

  const handleSaveQuickPrice = (svcId: string) => {
    const currentSvc = services.find(s => s.id === svcId);
    if (!currentSvc) return;

    const newPrice = quickPriceInputs[svcId] !== undefined ? quickPriceInputs[svcId] : currentSvc.price;
    const newOrig = quickOrigPriceInputs[svcId] !== undefined ? quickOrigPriceInputs[svcId] : currentSvc.originalPrice;

    if (isNaN(newPrice) || newPrice < 0) return;

    const updated = salonService.updateServicePrice(svcId, newPrice, newOrig);
    setServices(updated);

    // Show temporary success feedback
    setPriceFeedback(prev => ({ ...prev, [svcId]: 'Saved!' }));
    setTimeout(() => {
      setPriceFeedback(prev => {
        const copy = { ...prev };
        delete copy[svcId];
        return copy;
      });
    }, 2500);
  };

  const handleQuickDelta = (svcId: string, delta: number) => {
    const currentSvc = services.find(s => s.id === svcId);
    if (!currentSvc) return;

    const currentVal = quickPriceInputs[svcId] !== undefined ? quickPriceInputs[svcId] : currentSvc.price;
    const updatedVal = Math.max(100, currentVal + delta);

    setQuickPriceInputs(prev => ({ ...prev, [svcId]: updatedVal }));
  };

  const handleSaveEditedService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const updated = salonService.updateService(editingService);
    setServices(updated);
    setEditingService(null);
  };

  const handleApplyBulkPrice = () => {
    if (bulkPercentage === 0) return;
    const updated = salonService.bulkUpdatePrices(bulkCategory, bulkPercentage);
    setServices(updated);
    const catLabel = bulkCategory === 'all' ? 'All Services' : bulkCategory.toUpperCase();
    setBulkNotification(`Successfully applied ${bulkPercentage > 0 ? '+' : ''}${bulkPercentage}% price adjustment across ${catLabel}!`);
    setTimeout(() => setBulkNotification(''), 4000);
    setShowBulkPriceTool(false);
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Delete this service?')) {
      const updated = salonService.deleteService(id);
      setServices(updated);
    }
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitle.trim()) return;

    const added = salonService.addGalleryItem({
      title: newGalTitle,
      category: newGalCategory,
      image: newGalImage,
      tag: newGalTag
    });

    setGallery([added, ...gallery]);
    setShowAddGalleryModal(false);
    setNewGalTitle('');
  };

  const handleDeleteGallery = (id: string) => {
    const updated = salonService.deleteGalleryItem(id);
    setGallery(updated);
  };

  const handleDeleteReview = (id: string) => {
    const updated = salonService.deleteReview(id);
    setReviews(updated);
  };

  const handleToggleOffer = (id: string) => {
    const updated = salonService.toggleOfferActive(id);
    setOffers(updated);
  };

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = salonService.saveSalonInfo(siteInfo);
    setSiteInfo(updated);
    if (setSalonInfo) {
      setSalonInfo(updated);
    }
    setSiteSaveSuccess(true);
    setTimeout(() => setSiteSaveSuccess(false), 4000);
  };

  const handleResetSiteSettings = () => {
    if (window.confirm('Reset all website text, address, prices and details to default?')) {
      const reset = salonService.resetSalonInfo();
      setSiteInfo(reset);
      if (setSalonInfo) {
        setSalonInfo(reset);
      }
      setSiteSaveSuccess(true);
      setTimeout(() => setSiteSaveSuccess(false), 4000);
    }
  };

  const totalRevenue = appointments.reduce((acc, curr) => acc + (curr.status !== 'cancelled' ? curr.totalPrice : 0), 0);
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm) ||
      apt.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-6xl max-h-[92vh] bg-[#FAF7F5] dark:bg-[#161415] rounded-3xl shadow-2xl border border-[#E0A96D]/30 text-stone-900 dark:text-stone-100 flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#1C1819] px-6 py-4 border-b border-[#E0A96D]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#E0A96D] flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Khushboo Makeover <span className="text-xs px-2 py-0.5 rounded bg-[#E0A96D]/20 text-[#E0A96D] font-mono">ADMIN SUITE</span>
              </h2>
              <p className="text-[11px] text-stone-400">Master Studio Management, Appointments & Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-xs text-stone-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg border border-stone-800"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Auth Check */}
        {!isLoggedIn ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E0A96D]/15 border border-[#E0A96D]/40 text-[#E0A96D] flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">Studio Admin Authentication</h3>
              <p className="text-xs text-stone-500 mt-1">Please enter your authorized credentials to access appointments, client records, and service settings.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                />
              </div>

              {loginError && (
                <p className="text-xs text-rose-500 bg-rose-500/10 p-2 rounded-lg">{loginError}</p>
              )}

              

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs sm:text-sm shadow-md hover:scale-102 transition-transform"
              >
                Access Admin Portal
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="bg-stone-100 dark:bg-stone-900 px-6 py-2.5 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'appointments'
                    ? 'bg-[#E0A96D] text-stone-950 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Appointments ({appointments.length})</span>
                {pendingCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'services'
                    ? 'bg-[#E0A96D] text-stone-950 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Services ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'gallery'
                    ? 'bg-[#E0A96D] text-stone-950 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Gallery ({gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'reviews'
                    ? 'bg-[#E0A96D] text-stone-950 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Reviews ({reviews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('offers')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'offers'
                    ? 'bg-[#E0A96D] text-stone-950 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Offers ({offers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-[#E0A96D] text-stone-950 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-[#E0A96D] text-stone-950 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Site Content & Address (हर शब्द बदलें)</span>
              </button>
            </div>

            {/* Tab Viewport */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 1. APPOINTMENTS TAB */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        placeholder="Search client, phone, booking ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:border-[#E0A96D]"
                      />
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200"
                      >
                        <option value="all">All Statuses ({appointments.length})</option>
                        <option value="pending">Pending ({pendingCount})</option>
                        <option value="confirmed">Confirmed ({confirmedCount})</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Appointments Table */}
                  <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 dark:bg-stone-800/80 text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Code / Client</th>
                            <th className="py-3 px-4">Service & Stylist</th>
                            <th className="py-3 px-4">Date & Time</th>
                            <th className="py-3 px-4">Investment</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                          {filteredAppointments.length > 0 ? (
                            filteredAppointments.map(apt => (
                              <tr key={apt.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                <td className="py-3.5 px-4">
                                  <span className="font-mono font-bold text-[#8C5E35] dark:text-[#E0A96D] block">{apt.bookingCode}</span>
                                  <span className="font-semibold text-stone-900 dark:text-white block">{apt.name}</span>
                                  <span className="text-[11px] text-stone-400">{apt.phone}</span>
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="font-medium text-stone-900 dark:text-white block">{apt.serviceName}</span>
                                  <span className="text-[11px] text-stone-400 block">By: {apt.stylist || 'Assigned Stylist'}</span>
                                  {apt.message && <span className="text-[10px] text-stone-400 italic block mt-0.5">Note: {apt.message}</span>}
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="font-medium text-stone-900 dark:text-white block">{apt.date}</span>
                                  <span className="text-[11px] text-stone-400">{apt.timeSlot}</span>
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="font-serif font-bold text-stone-900 dark:text-white text-sm block">
                                    ₹{apt.totalPrice.toLocaleString()}
                                  </span>
                                  {apt.paymentOption === 'token_10_percent' ? (
                                    <div className="mt-1 space-y-0.5">
                                      <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                                        10% Token: ₹{(apt.advancePaid || Math.round(apt.totalPrice * 0.1)).toLocaleString()}
                                      </span>
                                      <span className="block text-[10px] text-[#8C5E35] dark:text-[#E0A96D]">
                                        Due: ₹{(apt.remainingDue !== undefined ? apt.remainingDue : Math.round(apt.totalPrice * 0.9)).toLocaleString()}
                                      </span>
                                    </div>
                                  ) : apt.paymentOption === 'full_payment' ? (
                                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold text-[10px]">
                                      100% Online Paid
                                    </span>
                                  ) : (
                                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 text-[10px]">
                                      Pay at Salon
                                    </span>
                                  )}
                                  {apt.paymentRef && (
                                    <span className="text-[9px] font-mono text-stone-400 block mt-0.5 truncate max-w-[120px]">
                                      Ref: {apt.paymentRef}
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4">
                                  <select
                                    value={apt.status}
                                    onChange={(e) => handleStatusChange(apt.id, e.target.value as any)}
                                    className={`px-2 py-1 rounded-lg text-xs font-semibold focus:outline-none ${
                                      apt.status === 'confirmed'
                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                        : apt.status === 'pending'
                                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                        : apt.status === 'completed'
                                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                    }`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>

                                <td className="py-3.5 px-4 text-right space-x-2">
                                  <a
                                    href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${apt.name}, your appointment (${apt.bookingCode}) at Khushboo Makeover on ${apt.date} at ${apt.timeSlot} is ${apt.status.toUpperCase()}. We look forward to welcoming you!`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center"
                                    title="Send WhatsApp Reminder"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </a>

                                  <button
                                    onClick={() => handleDeleteAppointment(apt.id)}
                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 inline-flex items-center"
                                    title="Delete record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-stone-400">
                                No appointments found matching your search.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SERVICES TAB & MAKEUP PRICING MANAGER */}
              {activeTab === 'services' && (
                <div className="space-y-5">
                  {/* Top Bar with Stats & Controls */}
                  <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                        <span>Makeup & Service Pricing Suite</span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E0A96D]/20 text-[#8C5E35] dark:text-[#E0A96D] font-mono font-semibold">
                          {services.length} Services
                        </span>
                      </h3>
                      <p className="text-xs text-stone-500">
                        Set, edit, and adjust custom makeup prices, bridal packages, and festive discounts in real-time.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button
                        onClick={() => setShowBulkPriceTool(!showBulkPriceTool)}
                        className={`px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors border ${
                          showBulkPriceTool
                            ? 'bg-[#E0A96D] text-stone-950 border-[#E0A96D]'
                            : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-[#E0A96D]'
                        }`}
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>{showBulkPriceTool ? 'Close Bulk Pricing' : '⚡ Seasonal / Bulk Adjuster'}</span>
                      </button>

                      <button
                        onClick={() => setShowAddServiceModal(true)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#E0A96D] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#E0A96D]/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Service</span>
                      </button>
                    </div>
                  </div>

                  {/* Bulk Price Notification */}
                  {bulkNotification && (
                    <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{bulkNotification}</span>
                    </div>
                  )}

                  {/* Seasonal Bulk Pricing Panel (Expandable) */}
                  {showBulkPriceTool && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF0E6] to-[#F5E6D3] dark:from-[#241F20] dark:to-[#2B2325] border border-[#E0A96D]/40 shadow-md space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-stone-900 dark:text-white">
                          <Tag className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
                          <h4 className="font-serif font-bold text-sm">Festive / Seasonal Bulk Price Tool</h4>
                        </div>
                        <span className="text-[11px] text-stone-500">Instant batch price update</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">
                            Target Category
                          </label>
                          <select
                            value={bulkCategory}
                            onChange={(e) => setBulkCategory(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                          >
                            <option value="bridal">Royal Bridal Makeup Only</option>
                            <option value="hd-makeup">HD Makeup Only</option>
                            <option value="hair">Hair & Spa Only</option>
                            <option value="skin">Skin & Facials Only</option>
                            <option value="nails">Nails & Lashes Only</option>
                            <option value="packages">VIP Packages Only</option>
                            <option value="all">All Services (Entire Salon)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">
                            Price Adjustment Percentage (%)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={bulkPercentage}
                              onChange={(e) => setBulkPercentage(Number(e.target.value))}
                              placeholder="+10 or -15"
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => setBulkPercentage(10)}
                                className="px-2 py-1 text-[10px] rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                              >
                                +10%
                              </button>
                              <button
                                type="button"
                                onClick={() => setBulkPercentage(20)}
                                className="px-2 py-1 text-[10px] rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                              >
                                +20%
                              </button>
                              <button
                                type="button"
                                onClick={() => setBulkPercentage(-15)}
                                className="px-2 py-1 text-[10px] rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                              >
                                -15%
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={handleApplyBulkPrice}
                            className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-[#E0A96D] text-white dark:text-stone-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <span>Apply Price Update Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filters and Search Bar for Services */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800">
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        placeholder="Search makeup or service title..."
                        value={serviceSearchTerm}
                        onChange={(e) => setServiceSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                      />
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      {serviceSearchTerm && (
                        <button
                          onClick={() => setServiceSearchTerm('')}
                          className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <select
                        value={serviceCategoryFilter}
                        onChange={(e) => setServiceCategoryFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#E0A96D]"
                      >
                        <option value="all">All Categories ({services.length})</option>
                        <option value="bridal">Royal Bridal Makeup ({services.filter(s => s.category === 'bridal').length})</option>
                        <option value="hd-makeup">HD Makeup ({services.filter(s => s.category === 'hd-makeup').length})</option>
                        <option value="hair">Hair Styling & Spa ({services.filter(s => s.category === 'hair').length})</option>
                        <option value="skin">Facials & Skin ({services.filter(s => s.category === 'skin').length})</option>
                        <option value="nails">Nail Art & Lashes ({services.filter(s => s.category === 'nails').length})</option>
                        <option value="mehendi">Mehendi Art ({services.filter(s => s.category === 'mehendi').length})</option>
                        <option value="packages">VIP Packages ({services.filter(s => s.category === 'packages').length})</option>
                      </select>
                    </div>
                  </div>

                  {/* Services Grid with Direct Inline Price Setting */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services
                      .filter(svc => {
                        const matchesCategory = serviceCategoryFilter === 'all' || svc.category === serviceCategoryFilter;
                        const matchesSearch =
                          svc.title.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
                          svc.categoryLabel.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
                          svc.description.toLowerCase().includes(serviceSearchTerm.toLowerCase());
                        return matchesCategory && matchesSearch;
                      })
                      .map(svc => {
                        const currentDisplayPrice =
                          quickPriceInputs[svc.id] !== undefined ? quickPriceInputs[svc.id] : svc.price;
                        const currentOrigPrice =
                          quickOrigPriceInputs[svc.id] !== undefined ? quickOrigPriceInputs[svc.id] : (svc.originalPrice || '');
                        const isSaved = priceFeedback[svc.id];

                        return (
                          <div
                            key={svc.id}
                            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                          >
                            {/* Service Header */}
                            <div className="flex gap-3 items-start">
                              <img
                                src={svc.image}
                                alt={svc.title}
                                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D]">
                                    {svc.categoryLabel}
                                  </span>
                                  {svc.tag && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                                      {svc.tag}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-semibold text-xs text-stone-900 dark:text-white truncate mt-1">
                                  {svc.title}
                                </h4>
                                <p className="text-[11px] text-stone-400">{svc.duration}</p>
                              </div>
                            </div>

                            {/* PRICE EDITOR SECTION (Direct Admin Price Control) */}
                            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-stone-700 dark:text-stone-300">Set Service Price (₹)</span>
                                {isSaved ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[10px] animate-in fade-in">
                                    <Check className="w-3 h-3" /> Saved!
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-stone-400">Live on website</span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] text-stone-500 mb-0.5">Selling Price *</label>
                                  <div className="relative">
                                    <span className="absolute left-2.5 top-1.5 text-xs text-stone-400 font-bold">₹</span>
                                    <input
                                      type="number"
                                      min={0}
                                      step={100}
                                      value={currentDisplayPrice}
                                      onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setQuickPriceInputs(prev => ({ ...prev, [svc.id]: val }));
                                      }}
                                      className="w-full pl-6 pr-2 py-1.5 text-xs font-bold font-serif rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] text-stone-500 mb-0.5">Original (Strike)</label>
                                  <div className="relative">
                                    <span className="absolute left-2.5 top-1.5 text-xs text-stone-400 font-bold">₹</span>
                                    <input
                                      type="number"
                                      min={0}
                                      step={100}
                                      placeholder="Optional"
                                      value={currentOrigPrice}
                                      onChange={(e) => {
                                        const val = e.target.value ? Number(e.target.value) : undefined;
                                        setQuickOrigPriceInputs(prev => ({ ...prev, [svc.id]: val }));
                                      }}
                                      className="w-full pl-6 pr-2 py-1.5 text-xs font-serif rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 focus:outline-none focus:border-[#E0A96D]"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Quick Adjustment Increment Buttons */}
                              <div className="flex items-center justify-between gap-1 pt-1">
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleQuickDelta(svc.id, -500)}
                                    className="px-2 py-1 text-[10px] font-semibold rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300"
                                    title="Decrease by ₹500"
                                  >
                                    -500
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickDelta(svc.id, 500)}
                                    className="px-2 py-1 text-[10px] font-semibold rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300"
                                    title="Increase by ₹500"
                                  >
                                    +500
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickDelta(svc.id, 1000)}
                                    className="px-2 py-1 text-[10px] font-semibold rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300"
                                    title="Increase by ₹1000"
                                  >
                                    +1k
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleSaveQuickPrice(svc.id)}
                                  className="px-3 py-1 text-[11px] rounded-lg bg-[#E0A96D] hover:bg-[#C58F5E] text-stone-950 font-bold shadow-sm transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Update Price</span>
                                </button>
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
                              <button
                                type="button"
                                onClick={() => setEditingService({ ...svc })}
                                className="text-xs text-[#8C5E35] dark:text-[#E0A96D] hover:underline font-semibold flex items-center gap-1 py-1"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit Full Details</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteService(svc.id)}
                                className="text-stone-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                                title="Delete Service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* 3. GALLERY TAB */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">Studio Transformation Portfolio</h3>
                    <button
                      onClick={() => setShowAddGalleryModal(true)}
                      className="px-4 py-2 rounded-xl bg-[#E0A96D] hover:bg-[#C58F5E] text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Gallery Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map(item => (
                      <div key={item.id} className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-stone-900 group">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                        <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-white/90 text-stone-900 font-semibold">{item.category}</span>
                        <p className="absolute bottom-2 left-2 right-2 text-xs font-bold text-white truncate">{item.title}</p>
                        <button
                          onClick={() => handleDeleteGallery(item.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">Customer Reviews Moderation</h3>
                  <div className="space-y-3">
                    {reviews.map(rev => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-stone-900 dark:text-white">{rev.name}</span>
                            <span className="text-[11px] text-amber-500 font-bold">{rev.rating} ★</span>
                            <span className="text-[10px] text-stone-400">• {rev.service}</span>
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 italic">"{rev.comment}"</p>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-stone-400 hover:text-rose-500 p-1 shrink-0"
                          title="Remove review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. OFFERS TAB */}
              {activeTab === 'offers' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">Promo Coupons & Bridal Packages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offers.map(off => (
                      <div key={off.id} className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#8C5E35] dark:text-[#E0A96D] px-2 py-0.5 rounded bg-[#E0A96D]/15">{off.code}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${off.isActive ? 'bg-emerald-500/15 text-emerald-600' : 'bg-stone-200 text-stone-600'}`}>
                              {off.isActive ? 'ACTIVE' : 'PAUSED'}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-stone-900 dark:text-white mt-1">{off.title}</p>
                          <p className="text-[11px] text-stone-500">{off.subtitle}</p>
                        </div>
                        <button
                          onClick={() => handleToggleOffer(off.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            off.isActive ? 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {off.isActive ? 'Pause' : 'Activate'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. ANALYTICS TAB */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
                      <span className="text-[11px] uppercase font-bold text-stone-400">Total Bookings</span>
                      <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mt-1">{appointments.length}</p>
                      <span className="text-[11px] text-emerald-500 font-medium">↑ 18% this month</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
                      <span className="text-[11px] uppercase font-bold text-stone-400">Revenue (Pipeline)</span>
                      <p className="font-serif text-2xl sm:text-3xl font-bold text-[#8C5E35] dark:text-[#E0A96D] mt-1">₹{totalRevenue.toLocaleString()}</p>
                      <span className="text-[11px] text-stone-400 font-medium">Avg ticket: ₹16,400</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
                      <span className="text-[11px] uppercase font-bold text-stone-400">Active Services</span>
                      <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mt-1">{services.length}</p>
                      <span className="text-[11px] text-stone-400 font-medium">6 Categories</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
                      <span className="text-[11px] uppercase font-bold text-stone-400">Client Satisfaction</span>
                      <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-400 mt-1">4.95 ★</p>
                      <span className="text-[11px] text-stone-400 font-medium">{reviews.length} total reviews</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. SITE SETTINGS & CONTENT CMS TAB (हर शब्द और एड्रेस बदलें) */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Top Notification Banner */}
                  {siteSaveSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>Website Content, Address & Settings updated successfully across the entire app!</span>
                      </div>
                      <span className="text-[11px] font-semibold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">Live Updated</span>
                    </div>
                  )}

                  {/* Header & Main Save Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-[#8C5E35] dark:text-[#E0A96D]" />
                        <span>Site Content & Address CMS</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E0A96D]/20 text-[#8C5E35] dark:text-[#E0A96D] font-mono">
                          LIVE EDITOR
                        </span>
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        Edit every single headline, paragraph, address, Google map link, phone number, UPI ID, and deposit % instantly.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetSiteSettings}
                        className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Reset all fields to factory defaults"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSiteSettings}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs shadow-md shadow-[#E0A96D]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save All Changes</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Tabs */}
                  <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-stone-200/70 dark:bg-stone-900 border border-stone-300/50 dark:border-stone-800">
                    <button
                      type="button"
                      onClick={() => setSiteSettingsSection('identity')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        siteSettingsSection === 'identity'
                          ? 'bg-white dark:bg-stone-800 text-[#8C5E35] dark:text-[#E0A96D] shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>1. Brand & Founder</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSiteSettingsSection('address')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        siteSettingsSection === 'address'
                          ? 'bg-white dark:bg-stone-800 text-[#8C5E35] dark:text-[#E0A96D] shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>2. Studio Address & Map (कहाँ पे है)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSiteSettingsSection('contact')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        siteSettingsSection === 'contact'
                          ? 'bg-white dark:bg-stone-800 text-[#8C5E35] dark:text-[#E0A96D] shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>3. Phone, WhatsApp & Socials</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSiteSettingsSection('payments')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        siteSettingsSection === 'payments'
                          ? 'bg-white dark:bg-stone-800 text-[#8C5E35] dark:text-[#E0A96D] shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>4. UPI & 10% Pre-Booking Deposit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSiteSettingsSection('hero')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        siteSettingsSection === 'hero'
                          ? 'bg-white dark:bg-stone-800 text-[#8C5E35] dark:text-[#E0A96D] shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      <Type className="w-3.5 h-3.5" />
                      <span>5. Hero Headlines & Banner</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSiteSettingsSection('about')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        siteSettingsSection === 'about'
                          ? 'bg-white dark:bg-stone-800 text-[#8C5E35] dark:text-[#E0A96D] shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>6. About Us Story & Philosophy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSiteSettingsSection('stats')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        siteSettingsSection === 'stats'
                          ? 'bg-white dark:bg-stone-800 text-[#8C5E35] dark:text-[#E0A96D] shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>7. Live Stats & Counters</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                    {/* SECTION 1: IDENTITY */}
                    {siteSettingsSection === 'identity' && (
                      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                          <Sparkles className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
                          <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                            Salon Brand & Founder Information
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Salon / Brand Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={siteInfo.name || ''}
                              onChange={(e) => setSiteInfo({ ...siteInfo, name: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Brand Tagline
                            </label>
                            <input
                              type="text"
                              value={siteInfo.tagline || ''}
                              onChange={(e) => setSiteInfo({ ...siteInfo, tagline: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Founder & Master Artist Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={siteInfo.founder || ''}
                              onChange={(e) => setSiteInfo({ ...siteInfo, founder: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Founder Professional Title
                            </label>
                            <input
                              type="text"
                              value={siteInfo.founderTitle || ''}
                              onChange={(e) => setSiteInfo({ ...siteInfo, founderTitle: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <label className="text-stone-600 dark:text-stone-300 font-semibold">
                              Founder Portrait / Profile Image
                            </label>
                            <label className="inline-flex items-center gap-1 text-[11px] text-[#8C5E35] dark:text-[#E0A96D] cursor-pointer hover:underline">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Photo from Device</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      if (ev.target?.result) {
                                        setSiteInfo({ ...siteInfo, founderImage: ev.target.result as string });
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          <div className="flex gap-3 items-center">
                            {siteInfo.founderImage && (
                              <img
                                src={siteInfo.founderImage}
                                alt="Founder"
                                className="w-12 h-12 rounded-full object-cover border-2 border-[#E0A96D] shrink-0"
                              />
                            )}
                            <input
                              type="text"
                              placeholder="Paste Image URL or click Upload"
                              value={siteInfo.founderImage || ''}
                              onChange={(e) => setSiteInfo({ ...siteInfo, founderImage: e.target.value })}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 2: ADDRESS & STUDIO LOCATION (कहाँ पे है) */}
                    {siteSettingsSection === 'address' && (
                      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
                            <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                              Studio Physical Address & Map (कहाँ पे है पूरा पता)
                            </h4>
                          </div>
                          <span className="text-[11px] text-[#8C5E35] dark:text-[#E0A96D] font-bold">
                            Live on Contact Page & Footer
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="sm:col-span-2">
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Street / Suite / Building Address *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Suite 402, 4th Floor, Crystal Heritage Plaza, Linking Road"
                              value={siteInfo.address?.street || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  address: { ...siteInfo.address, street: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Landmark
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Opp. National College, Next to Zara"
                              value={siteInfo.address?.landmark || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  address: { ...siteInfo.address, landmark: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              City & Area *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Bandra West, Mumbai"
                              value={siteInfo.address?.city || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  address: { ...siteInfo.address, city: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              State & Country
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Maharashtra, India"
                              value={siteInfo.address?.state || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  address: { ...siteInfo.address, state: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Pincode
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 400050"
                              value={siteInfo.address?.pincode || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  address: { ...siteInfo.address, pincode: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Studio Operating Timings & Days
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Mon - Sun: 09:30 AM - 08:30 PM (Early bridal slots by appointment)"
                              value={siteInfo.address?.timings || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  address: { ...siteInfo.address, timings: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Google Maps Navigation Link
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. https://maps.google.com/?q=..."
                              value={siteInfo.address?.googleMapsUrl || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  address: { ...siteInfo.address, googleMapsUrl: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Google Maps Iframe Embed URL
                            </label>
                            <input
                              type="text"
                              placeholder="https://www.google.com/maps/embed?pb=..."
                              value={siteInfo.address?.mapEmbedUrl || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  address: { ...siteInfo.address, mapEmbedUrl: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 3: CONTACT & SOCIALS */}
                    {siteSettingsSection === 'contact' && (
                      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                          <Phone className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
                          <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                            Contact Numbers & Social Profiles
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Primary Studio Phone *
                            </label>
                            <input
                              type="text"
                              required
                              value={siteInfo.phone || ''}
                              onChange={(e) => setSiteInfo({ ...siteInfo, phone: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              WhatsApp Booking Number (with country code) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="+919820012345"
                              value={siteInfo.whatsapp || ''}
                              onChange={(e) => setSiteInfo({ ...siteInfo, whatsapp: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={siteInfo.email || ''}
                              onChange={(e) => setSiteInfo({ ...siteInfo, email: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Instagram Handle / Link
                            </label>
                            <input
                              type="text"
                              placeholder="https://instagram.com/khushboomakeover"
                              value={siteInfo.socials?.instagram || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  socials: { ...siteInfo.socials, instagram: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Facebook Page Link
                            </label>
                            <input
                              type="text"
                              placeholder="https://facebook.com/..."
                              value={siteInfo.socials?.facebook || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  socials: { ...siteInfo.socials, facebook: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              YouTube Channel Link
                            </label>
                            <input
                              type="text"
                              placeholder="https://youtube.com/..."
                              value={siteInfo.socials?.youtube || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  socials: { ...siteInfo.socials, youtube: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 4: PAYMENTS & 10% PRE-BOOKING */}
                    {siteSettingsSection === 'payments' && (
                      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                          <div className="flex items-center gap-2">
                            <QrCode className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
                            <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                              Online Payments, UPI & 10% Pre-Booking Token
                            </h4>
                          </div>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-bold">
                            Dynamic QR Generation Active
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Salon Business UPI ID *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. khushboomakeover@okaxis"
                              value={siteInfo.upiId || ''}
                              onChange={(e) => setSiteInfo({ ...siteInfo, upiId: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                            <p className="text-[10px] text-stone-400 mt-1">Clients use this UPI ID to pay 10% date reservation token</p>
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Advance Token Deposit Percentage (%)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={5}
                                max={100}
                                required
                                value={siteInfo.depositPercentage || 10}
                                onChange={(e) => setSiteInfo({ ...siteInfo, depositPercentage: Number(e.target.value) })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold focus:outline-none focus:border-[#E0A96D]"
                              />
                              <span className="text-sm font-bold text-[#8C5E35] dark:text-[#E0A96D] shrink-0">%</span>
                            </div>
                            <p className="text-[10px] text-stone-400 mt-1">Default 10% — calculates token amount and QR code dynamically</p>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#FAF0E6]/60 dark:bg-stone-800/50 border border-[#E0A96D]/30 space-y-2 text-xs">
                          <span className="font-bold text-[#8C5E35] dark:text-[#E0A96D] block">
                            How the 10% Pre-Booking Token Works:
                          </span>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                            When a client selects any makeup service (e.g. ₹15,000 package), the system automatically calculates exactly 10% (₹1,500) and produces an instant dynamic UPI QR Code linking directly to <strong>{siteInfo.upiId || 'khushboomakeover@okaxis'}</strong>. Once scanned and booked, their appointment date is reserved in the Studio calendar.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* SECTION 5: HERO HEADLINES & BANNER */}
                    {siteSettingsSection === 'hero' && (
                      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                          <Type className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
                          <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                            Hero Section Main Headlines & CTA Buttons
                          </h4>
                        </div>

                        <div className="space-y-4 text-xs">
                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Prestige Badge Text (Top Pill)
                            </label>
                            <input
                              type="text"
                              value={siteInfo.hero?.badgeText || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  hero: { ...siteInfo.hero, badgeText: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                                Main Headline (Line 1) *
                              </label>
                              <input
                                type="text"
                                required
                                value={siteInfo.hero?.headlineLine1 || ''}
                                onChange={(e) =>
                                  setSiteInfo({
                                    ...siteInfo,
                                    hero: { ...siteInfo.hero, headlineLine1: e.target.value }
                                  })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                                Main Headline (Line 2 - Highlighted Gradient) *
                              </label>
                              <input
                                type="text"
                                required
                                value={siteInfo.hero?.headlineLine2 || ''}
                                onChange={(e) =>
                                  setSiteInfo({
                                    ...siteInfo,
                                    hero: { ...siteInfo.hero, headlineLine2: e.target.value }
                                  })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Subheadline Paragraph Description
                            </label>
                            <textarea
                              rows={2}
                              value={siteInfo.hero?.subheadline || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  hero: { ...siteInfo.hero, subheadline: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                                Primary Button Text
                              </label>
                              <input
                                type="text"
                                value={siteInfo.hero?.primaryCtaText || ''}
                                onChange={(e) =>
                                  setSiteInfo({
                                    ...siteInfo,
                                    hero: { ...siteInfo.hero, primaryCtaText: e.target.value }
                                  })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                                Secondary Button Text
                              </label>
                              <input
                                type="text"
                                value={siteInfo.hero?.secondaryCtaText || ''}
                                onChange={(e) =>
                                  setSiteInfo({
                                    ...siteInfo,
                                    hero: { ...siteInfo.hero, secondaryCtaText: e.target.value }
                                  })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-stone-600 dark:text-stone-300 font-semibold">
                                Hero Background Image URL
                              </label>
                              <label className="inline-flex items-center gap-1 text-[11px] text-[#8C5E35] dark:text-[#E0A96D] cursor-pointer hover:underline">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Banner</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        if (ev.target?.result) {
                                          setSiteInfo({
                                            ...siteInfo,
                                            hero: { ...siteInfo.hero, backgroundImage: ev.target.result as string }
                                          });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={siteInfo.hero?.backgroundImage || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  hero: { ...siteInfo.hero, backgroundImage: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 6: ABOUT US */}
                    {siteSettingsSection === 'about' && (
                      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                          <Layers className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
                          <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                            About Us Story, Mission & Vision Texts
                          </h4>
                        </div>

                        <div className="space-y-4 text-xs">
                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Our Story (Paragraph 1)
                            </label>
                            <textarea
                              rows={3}
                              value={siteInfo.about?.storyP1 || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  about: { ...siteInfo.about, storyP1: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Our Story (Paragraph 2)
                            </label>
                            <textarea
                              rows={3}
                              value={siteInfo.about?.storyP2 || ''}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  about: { ...siteInfo.about, storyP2: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                                Studio Mission Statement
                              </label>
                              <textarea
                                rows={2}
                                value={siteInfo.about?.mission || ''}
                                onChange={(e) =>
                                  setSiteInfo({
                                    ...siteInfo,
                                    about: { ...siteInfo.about, mission: e.target.value }
                                  })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                                Studio Vision Statement
                              </label>
                              <textarea
                                rows={2}
                                value={siteInfo.about?.vision || ''}
                                onChange={(e) =>
                                  setSiteInfo({
                                    ...siteInfo,
                                    about: { ...siteInfo.about, vision: e.target.value }
                                  })
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 7: STATS */}
                    {siteSettingsSection === 'stats' && (
                      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                          <Award className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
                          <h4 className="font-serif text-base font-bold text-stone-900 dark:text-white">
                            Live Stats & Counter Badges
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Brides Styled
                            </label>
                            <input
                              type="text"
                              value={siteInfo.stats?.bridesCount || '12,500+'}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  stats: { ...siteInfo.stats, bridesCount: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold font-serif focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Years Experience
                            </label>
                            <input
                              type="text"
                              value={siteInfo.stats?.yearsExperience || '15+'}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  stats: { ...siteInfo.stats, yearsExperience: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold font-serif focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Average Star Rating
                            </label>
                            <input
                              type="text"
                              value={siteInfo.stats?.rating || '4.95'}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  stats: { ...siteInfo.stats, rating: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold font-serif focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                              Certified Stylists
                            </label>
                            <input
                              type="text"
                              value={siteInfo.stats?.stylists || '35+'}
                              onChange={(e) =>
                                setSiteInfo({
                                  ...siteInfo,
                                  stats: { ...siteInfo.stats, stylists: e.target.value }
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-bold font-serif focus:outline-none focus:border-[#E0A96D]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                      <button
                        type="button"
                        onClick={handleResetSiteSettings}
                        className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#E0A96D]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All Changes to Live Website</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Service Modal */}
        {showAddServiceModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-lg w-full border border-[#E0A96D]/30 space-y-4 my-8 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-stone-800">
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#8C5E35] dark:text-[#E0A96D]" />
                  <span>Add New Makeup & Salon Service</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="text-stone-400 hover:text-stone-600 p-1 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddService} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal HD Destination Bridal Look"
                    value={newSvcTitle}
                    onChange={(e) => setNewSvcTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Category *</label>
                    <select
                      value={newSvcCategory}
                      onChange={(e) => setNewSvcCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    >
                      <option value="bridal">Royal Bridal Makeup</option>
                      <option value="hd-makeup">HD Makeup & Reception</option>
                      <option value="hair">Hair Styling & Spa</option>
                      <option value="skin">Facial & Skin Rituals</option>
                      <option value="nails">Nails & Lash Extension</option>
                      <option value="mehendi">Mehendi Art</option>
                      <option value="packages">VIP Bridal Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 150 mins"
                      value={newSvcDuration}
                      onChange={(e) => setNewSvcDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                </div>

                {/* Pricing Fields */}
                <div className="p-3.5 rounded-2xl bg-[#FAF0E6]/70 dark:bg-stone-800/60 border border-[#E0A96D]/30 space-y-2.5">
                  <span className="font-bold text-[11px] text-[#8C5E35] dark:text-[#E0A96D] block">Pricing Setup</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Admin Price (₹) *</label>
                      <input
                        type="number"
                        required
                        min={100}
                        step={100}
                        value={newSvcPrice}
                        onChange={(e) => setNewSvcPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-bold font-serif rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Original / Strikethrough Price (₹)</label>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        placeholder="e.g. 19999"
                        value={newSvcOriginalPrice || ''}
                        onChange={(e) => setNewSvcOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full px-3 py-2 text-xs font-serif rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#E0A96D]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold">
                      Makeup Profile Photo / Image
                    </label>
                    <label className="inline-flex items-center gap-1 text-[10px] text-[#8C5E35] dark:text-[#E0A96D] cursor-pointer hover:underline">
                      <Upload className="w-3 h-3" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) setNewSvcImage(ev.target.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    {newSvcImage && (
                      <img
                        src={newSvcImage}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Paste image URL or click Upload from Device"
                      value={newSvcImage}
                      onChange={(e) => setNewSvcImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short description of service..."
                    value={newSvcDescription}
                    onChange={(e) => setNewSvcDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Key Benefits (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Airbrush, 24hr stay, Lashes"
                      value={newSvcBenefits}
                      onChange={(e) => setNewSvcBenefits(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Products Used</label>
                    <input
                      type="text"
                      placeholder="Charlotte Tilbury, Dior, MAC"
                      value={newSvcProducts}
                      onChange={(e) => setNewSvcProducts(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSvcIsPopular}
                      onChange={(e) => setNewSvcIsPopular(e.target.checked)}
                      className="rounded accent-[#E0A96D]"
                    />
                    <span className="text-stone-700 dark:text-stone-300">Mark as Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSvcIsFeatured}
                      onChange={(e) => setNewSvcIsFeatured(e.target.checked)}
                      className="rounded accent-[#E0A96D]"
                    />
                    <span className="text-stone-700 dark:text-stone-300">Feature on Homepage</span>
                  </label>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setShowAddServiceModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#E0A96D] text-white font-bold shadow-md shadow-[#E0A96D]/20"
                  >
                    Save & Publish Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Full Service Details Modal */}
        {editingService && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-lg w-full border border-[#E0A96D]/30 space-y-4 my-8 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Edit className="w-5 h-5 text-[#8C5E35] dark:text-[#E0A96D]" />
                    <span>Edit Service & Makeup Pricing</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">ID: {editingService.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="text-stone-400 hover:text-stone-600 p-1 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEditedService} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Category</label>
                    <select
                      value={editingService.category}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          category: e.target.value as any,
                          categoryLabel: e.target.value.toUpperCase()
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    >
                      <option value="bridal">Royal Bridal Makeup</option>
                      <option value="hd-makeup">HD Makeup & Reception</option>
                      <option value="hair">Hair Styling & Spa</option>
                      <option value="skin">Facial & Skin Rituals</option>
                      <option value="nails">Nails & Lash Extension</option>
                      <option value="mehendi">Mehendi Art</option>
                      <option value="packages">VIP Bridal Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Duration</label>
                    <input
                      type="text"
                      value={editingService.duration}
                      onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                </div>

                {/* Price Setting Box */}
                <div className="p-3.5 rounded-2xl bg-[#FAF0E6]/70 dark:bg-stone-800/60 border border-[#E0A96D]/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-[#8C5E35] dark:text-[#E0A96D]">Admin Pricing Configuration</span>
                    {editingService.originalPrice && editingService.originalPrice > editingService.price && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                        {Math.round(((editingService.originalPrice - editingService.price) / editingService.originalPrice) * 100)}% OFF Discount
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                        Active Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        step={100}
                        value={editingService.price}
                        onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs font-bold font-serif rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                        Original / Strikethrough (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        placeholder="Optional"
                        value={editingService.originalPrice || ''}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            originalPrice: e.target.value ? Number(e.target.value) : undefined
                          })
                        }
                        className="w-full px-3 py-2 text-xs font-serif rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#E0A96D]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold">
                      Makeup Profile Photo / Image
                    </label>
                    <label className="inline-flex items-center gap-1 text-[10px] text-[#8C5E35] dark:text-[#E0A96D] cursor-pointer hover:underline">
                      <Upload className="w-3 h-3" />
                      <span>Upload New Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setEditingService({
                                  ...editingService,
                                  image: ev.target.result as string
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    {editingService.image && (
                      <img
                        src={editingService.image}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Paste image URL or click Upload New Photo"
                      value={editingService.image}
                      onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                      Benefits (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingService.benefits?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          benefits: e.target.value.split(',').map(b => b.trim()).filter(Boolean)
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                      Products Used (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingService.productsUsed?.join(', ') || ''}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          productsUsed: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">Highlight Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Signature Look"
                      value={editingService.tag || ''}
                      onChange={(e) => setEditingService({ ...editingService, tag: e.target.value || undefined })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-5">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingService.isPopular)}
                        onChange={(e) => setEditingService({ ...editingService, isPopular: e.target.checked })}
                        className="rounded accent-[#E0A96D]"
                      />
                      <span className="text-stone-700 dark:text-stone-300">Popular</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingService.isFeatured)}
                        onChange={(e) => setEditingService({ ...editingService, isFeatured: e.target.checked })}
                        className="rounded accent-[#E0A96D]"
                      />
                      <span className="text-stone-700 dark:text-stone-300">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#E0A96D] text-white font-bold shadow-md shadow-[#E0A96D]/20"
                  >
                    Save & Update Price
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Gallery Modal */}
        {showAddGalleryModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-md w-full border border-[#E0A96D]/30 space-y-4">
              <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">Upload Gallery Image</h3>
              <form onSubmit={handleAddGallery} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-500 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Gold Bridal Makeup"
                    value={newGalTitle}
                    onChange={(e) => setNewGalTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Category</label>
                  <select
                    value={newGalCategory}
                    onChange={(e) => setNewGalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                  >
                    <option value="bridal">Bridal</option>
                    <option value="hd-makeup">HD Makeup</option>
                    <option value="hair">Hair</option>
                    <option value="skin">Skin</option>
                    <option value="nail-art">Nail Art</option>
                    <option value="mehendi">Mehendi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Image URL *</label>
                  <input
                    type="text"
                    required
                    value={newGalImage}
                    onChange={(e) => setNewGalImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGalleryModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#E0A96D] text-stone-950 font-bold"
                  >
                    Publish to Gallery
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
