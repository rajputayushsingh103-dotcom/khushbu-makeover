import React, { useState, useRef } from 'react';
import {
  Sparkles, Upload, Image as ImageIcon, Check, X, Tag, Clock,
  DollarSign, Camera, Scissors, ShieldCheck, Heart, Trash2, Eye
} from 'lucide-react';
import { Service, ServiceCategory } from '../types';
import { salonService } from '../services/salonService';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceAdded: (newService: Service) => void;
}

// Curated studio photos matching all 14 salon services
const PRESET_MAKEUP_PHOTOS = [
  {
    title: 'Hair Cut & Styling',
    url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1000&q=80',
    category: 'hair'
  },
  {
    title: 'Hair Spa & Treatment',
    url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80',
    category: 'hair'
  },
  {
    title: 'Hair Colour & Balayage',
    url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    category: 'hair'
  },
  {
    title: 'Hydra Facial Glow',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    category: 'skin'
  },
  {
    title: 'Customized Facial',
    url: 'https://images.unsplash.com/photo-1512290900672-1f02a0a0e363?auto=format&fit=crop&w=1000&q=80',
    category: 'skin'
  },
  {
    title: 'Bleach & D-Tan Clean',
    url: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=1000&q=80',
    category: 'skin'
  },
  {
    title: 'Royal Bridal Makeup',
    url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
    category: 'bridal'
  },
  {
    title: 'Party & HD Glam',
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80',
    category: 'hd-makeup'
  },
  {
    title: 'Manicure & Pedicure',
    url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1000&q=80',
    category: 'nails'
  },
  {
    title: 'Nail Art Studio',
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80',
    category: 'nails'
  },
  {
    title: 'Kaveri Mehendi Art',
    url: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=1000&q=80',
    category: 'mehendi'
  },
  {
    title: 'Ear Lobe & Essentials',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
    category: 'skin'
  }
];

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onServiceAdded
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('hair');
  const [price, setPrice] = useState<number | ''>(2499);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(3500);
  const [duration, setDuration] = useState('60 mins');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState(PRESET_MAKEUP_PHOTOS[0].url);
  const [photoMode, setPhotoMode] = useState<'upload' | 'preset' | 'url'>('preset');
  const [benefitsStr, setBenefitsStr] = useState('Professional Treatment, Premium Products, Expert Consultation, Instant Glow');
  const [productsStr, setProductsStr] = useState("L'Oréal Professionnel, Kérastase, O3+, MAC, Huda Beauty");
  const [tag, setTag] = useState('Popular');
  const [isPopular, setIsPopular] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload state
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          setPhotoMode('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a service title.');
      return;
    }
    if (price === '' || Number(price) < 0) {
      alert('Please enter a valid price.');
      return;
    }

    setIsSubmitting(true);

    try {
      const benefitsArray = benefitsStr
        ? benefitsStr.split(',').map(b => b.trim()).filter(Boolean)
        : ['Medical Grade Hygiene', 'Top Global Brands', 'Expert Consultation'];

      const productsArray = productsStr
        ? productsStr.split(',').map(p => p.trim()).filter(Boolean)
        : ["L'Oréal Professionnel", 'Kérastase', 'O3+', 'MAC'];

      const categoryLabels: Record<ServiceCategory, string> = {
        'bridal': 'Bridal Artistry',
        'hd-makeup': 'HD Makeup',
        'hair': 'Hair Care',
        'skin': 'Skin & Aesthetics',
        'nails': 'Nail Art Studio',
        'mehendi': 'Mehendi Studio',
        'packages': 'VIP Packages'
      };

      const generatedId = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

      const servicePayload = {
        id: generatedId,
        title: title.trim(),
        category: category,
        categoryLabel: categoryLabels[category] || 'Salon Service',
        description: description.trim() || `${title.trim()} performed by certified luxury salon specialists.`,
        longDescription: description.trim() || `${title.trim()} performed by certified luxury salon specialists using top international brands for superior results.`,
        duration: duration.trim() || '60 mins',
        price: Number(price),
        originalPrice: originalPrice !== '' ? Number(originalPrice) : Math.round(Number(price) * 1.3),
        image: photoUrl || PRESET_MAKEUP_PHOTOS[0].url,
        benefits: benefitsArray,
        productsUsed: productsArray,
        tag: tag.trim() || undefined,
        isPopular: Boolean(isPopular),
        isFeatured: Boolean(isFeatured)
      };

      // Handle async or sync addService safely
      let createdService: Service = servicePayload as Service;
      if (salonService && typeof salonService.addService === 'function') {
        const res = await salonService.addService(servicePayload as any);
        if (res && res.id) {
          createdService = res;
        }
      }

      // Sync to localStorage
      try {
        const storedServices = JSON.parse(localStorage.getItem('km_services') || '[]');
        const updatedServices = [createdService, ...storedServices.filter((s: any) => s.id !== createdService.id)];
        localStorage.setItem('km_services', JSON.stringify(updatedServices));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.warn('LocalStorage save warning:', err);
      }

      onServiceAdded(createdService);
      onClose();

      // Reset Form
      setTitle('');
      setDescription('');
      setTag('');
      setUploadedFileName('');
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Service add karte waqt error aaya. Please dobara try karein.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1A1B] text-stone-900 dark:text-stone-100 rounded-3xl max-w-2xl w-full border border-[#E0A96D]/30 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#241B1C] via-[#332224] to-[#1F1819] text-white flex items-center justify-between border-b border-[#E0A96D]/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E0A96D]/20 text-[#E0A96D] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Service & Makeup Creator
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
              Add New Salon Service
            </h3>
            <p className="text-xs text-stone-300">
              Nayi service add karein, apni price set karein aur photo choose karein.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* 1. BASIC INFORMATION */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <Sparkles className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
              1. Basic Information
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Service / Makeup Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hair Cut & Styling, Hydra Facial, Kaveri Mehendi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D] focus:ring-1 focus:ring-[#E0A96D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                >
                  <option value="hair">💇‍♀️ Hair (Cut, Spa, Color)</option>
                  <option value="skin">🌸 Skin (Facial, D-Tan, Waxing, Piercing)</option>
                  <option value="bridal">👑 Bridal Makeup</option>
                  <option value="hd-makeup">✨ HD Party Makeup</option>
                  <option value="nails">💅 Nails & Pedicure</option>
                  <option value="mehendi">🌿 Mehendi (Kaveri)</option>
                  <option value="packages">💎 VIP Packages</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Duration (Estimated Time)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. 45 mins / 60 mins / 2 hours"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. PRICING CONFIGURATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF0E6] to-[#F5E6D3]/60 dark:from-[#241F20] dark:to-[#2B2325] border border-[#E0A96D]/40 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
                2. Price Configuration (कीमत सेट करें) *
              </h4>
              {originalPrice && price && Number(originalPrice) > Number(price) && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                  {Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}% Discount
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Active Price (₹) * <span className="text-[11px] font-normal text-stone-500">(Final Amount)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-serif font-bold text-stone-500">₹</span>
                  <input
                    type="number"
                    required
                    min={0}
                    step={50}
                    placeholder="2499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 text-sm font-bold font-serif rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D] focus:ring-1 focus:ring-[#E0A96D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Original / MRP Price (₹) <span className="text-[11px] font-normal text-stone-500">(Strikethrough)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-serif font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    placeholder="3500"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 text-sm font-serif rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#E0A96D]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. PHOTO UPLOAD & PRESETS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
              <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
                3. Service Photo (फोटो लगाएं) *
              </h4>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPhotoMode('preset')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    photoMode === 'preset'
                      ? 'bg-[#E0A96D] text-stone-950'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('upload')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    photoMode === 'upload'
                      ? 'bg-[#E0A96D] text-stone-950'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    photoMode === 'url'
                      ? 'bg-[#E0A96D] text-stone-950'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {/* Photo Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              <div className="sm:col-span-4 flex flex-col items-center">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#E0A96D]/40 bg-stone-100 dark:bg-stone-800 shadow-md">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Service preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4 text-center">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span className="text-[11px]">No photo chosen</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium text-center truncate">
                    Preview
                  </span>
                </div>
              </div>

              <div className="sm:col-span-8 space-y-3">
                {photoMode === 'upload' && (
                  <div className="p-4 rounded-2xl border-2 border-dashed border-[#E0A96D]/40 bg-stone-50 dark:bg-stone-900/60 text-center space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-[#E0A96D] text-stone-950 font-bold text-xs hover:bg-[#C58F5E] transition-colors shadow-sm cursor-pointer"
                      >
                        Choose Photo from Device
                      </button>
                      <p className="text-[11px] text-stone-500 mt-1">
                        {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Supports JPG, PNG, WEBP from your phone or PC'}
                      </p>
                    </div>
                  </div>
                )}

                {photoMode === 'preset' && (
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1.5">
                      Choose matching photo:
                    </label>
                    <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
                      {PRESET_MAKEUP_PHOTOS.map((preset, idx) => {
                        const isSelected = photoUrl === preset.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPhotoUrl(preset.url)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                              isSelected ? 'border-[#E0A96D] ring-2 ring-[#E0A96D]/40 scale-105' : 'border-stone-200 dark:border-stone-700 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.title}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                <Check className="w-4 h-4 text-[#E0A96D] stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {photoMode === 'url' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Direct Image Web Link (HTTPS)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. DESCRIPTION & HIGHLIGHTS */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <Tag className="w-4 h-4 text-[#8C5E35] dark:text-[#E0A96D]" />
              4. Description, Brands & Highlights
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Service Description
              </label>
              <textarea
                rows={2}
                placeholder="Describe what makes this service special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Key Benefits (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Deep Cleansing, Instant Glow, 100% Organic"
                  value={benefitsStr}
                  onChange={(e) => setBenefitsStr(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Brands / Products Used
                </label>
                <input
                  type="text"
                  placeholder="L'Oréal, Kérastase, O3+, MAC"
                  value={productsStr}
                  onChange={(e) => setProductsStr(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Highlight Tag / Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bestseller, Trending, New 2026"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded accent-[#E0A96D] w-4 h-4"
                  />
                  <span>Mark as Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded accent-[#E0A96D] w-4 h-4"
                  />
                  <span>Show on Home</span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#E0A96D]/25 hover:opacity-95 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save & Publish Service'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};