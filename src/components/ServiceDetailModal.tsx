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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FAF7F5] dark:bg-[#1A1818] rounded-3xl shadow-2xl border border-[#E0A96D]/30 text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F5] dark:from-[#1A1818] via-transparent to-black/30" />

          {/* Badges on Image */}
          <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-stone-900/90 text-[#8C5E35] dark:text-[#E0A96D] shadow-sm">
              {service.categoryLabel}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#E0A96D]" />
              {service.duration}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                {service.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#8C5E35] dark:text-[#E0A96D] mt-1 font-medium">
                Master Stylist Protocol • Luxury VIP Suite Experience
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-stone-400 block font-medium">Package Investment</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#8C5E35] dark:text-[#E0A96D]">
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
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400">Overview</h4>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
              {service.longDescription || service.description}
            </p>
          </div>

          {/* Benefits & Inclusions */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400">Treatment Highlights & Perks</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 text-xs sm:text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#E0A96D]/20 text-[#8C5E35] dark:text-[#E0A96D] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 font-bold" />
                  </span>
                  <span className="text-stone-700 dark:text-stone-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Products Used */}
          {service.productsUsed && service.productsUsed.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400">Authentic Luxury Brands Used</h4>
              <div className="flex flex-wrap gap-2">
                {service.productsUsed.map((prod, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#E0A96D]/10 text-[#8C5E35] dark:text-[#E0A96D] border border-[#E0A96D]/20 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    {prod}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Guarantee / Hygiene Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-stone-700 dark:text-stone-300 text-xs flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#E0A96D] shrink-0" />
            <div>
              <p className="font-semibold text-stone-900 dark:text-white">100% Medical-Grade Sanitation & Patch Guarantee</p>
              <p className="text-stone-500 dark:text-stone-400">All makeup brushes and skin instruments are UV-C sterilized. We conduct pre-application skin evaluations.</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
            <button
              id="modal-confirm-book-service-btn"
              onClick={() => {
                onClose();
                onBookService(service);
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-semibold text-sm shadow-lg shadow-[#E0A96D]/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
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
