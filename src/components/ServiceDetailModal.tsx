import React from 'react';
import { X, Clock, Check, Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { Service } from '../types';

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
  onBookService: (service: Service) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#E0A96D]/40 text-stone-100 bg-[#161415] overflow-hidden my-6"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(20, 18, 19, 0.88), rgba(15, 13, 14, 0.94)), url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'local'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black/90 flex items-center justify-center transition-all backdrop-blur-md border border-white/15 cursor-pointer shadow-lg active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Section */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161415] via-transparent to-black/50" />

          {/* Badges on Image */}
          <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#E0A96D] text-stone-950 shadow-md">
              {service.categoryLabel}
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-black/70 text-white backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-[#E0A96D]" />
              {service.duration}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Title & Price */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0A96D]/20 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E0A96D]/15 text-[#E0A96D] text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                Khushboo Makeover Signature Ritual
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {service.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#E0A96D] mt-1 font-medium">
                Master Stylist Protocol • Luxury VIP Studio Experience
              </p>
            </div>

            <div className="text-left sm:text-right bg-white/5 p-3.5 rounded-2xl border border-white/10 sm:bg-transparent sm:p-0 sm:border-0">
              <span className="text-xs text-stone-400 block font-medium">Package Investment</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-extrabold text-[#E0A96D]">
                  ₹{service.price.toLocaleString()}
                </span>
                {service.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{service.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-stone-800/80">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#E0A96D] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Overview & Ritual Details
            </h4>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              {service.longDescription || service.description}
            </p>
          </div>

          {/* Benefits & Inclusions */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-300">
              Treatment Highlights & Inclusions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-stone-900/70 backdrop-blur-sm border border-stone-800 text-xs sm:text-sm shadow-sm hover:border-[#E0A96D]/40 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-[#E0A96D]/20 text-[#E0A96D] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 font-bold stroke-[3]" />
                  </span>
                  <span className="text-stone-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Products Used */}
          {service.productsUsed && service.productsUsed.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest font-bold text-stone-300">
                Authentic International Luxury Brands Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.productsUsed.map((prod, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#E0A96D]/15 text-[#E0A96D] border border-[#E0A96D]/30 flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-[#E0A96D]" />
                    {prod}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Guarantee / Hygiene Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-stone-200 text-xs flex items-center gap-3 backdrop-blur-sm">
            <ShieldCheck className="w-6 h-6 text-[#E0A96D] shrink-0" />
            <div>
              <p className="font-bold text-white">100% Medical-Grade Sanitation & Patch Guarantee</p>
              <p className="text-stone-300 mt-0.5">
                All brushes and instruments are UV-C sterilized. We conduct personal skin evaluations before every session.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#E0A96D]/20">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              id="modal-confirm-book-service-btn"
              onClick={() => {
                onClose();
                onBookService(service);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-sm shadow-lg shadow-[#E0A96D]/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book This Experience</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};