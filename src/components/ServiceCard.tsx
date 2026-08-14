import React from 'react';
import { Clock, Sparkles, ArrowRight, Check, Eye } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onBookNow: (service: Service) => void;
  onViewDetails: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBookNow,
  onViewDetails
}) => {
  return (
    <div
      id={`service-card-${service.id}`}
      className="group bg-white dark:bg-[#1C1A1B] rounded-3xl overflow-hidden border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-lg hover:shadow-2xl hover:border-[#E0A96D]/50 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image Container with Zoom Effect */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-900">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Pill */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 backdrop-blur-md shadow-sm border border-stone-200/40 dark:border-stone-700">
            {service.categoryLabel}
          </span>
        </div>

        {/* Highlight Tag */}
        {service.tag && (
          <div className="absolute top-3.5 right-3.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#B76E79] to-[#E0A96D] text-white shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {service.tag}
            </span>
          </div>
        )}

        {/* Quick View Button on Image */}
        <button
          onClick={() => onViewDetails(service)}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-stone-950/70 text-white border border-[#E0A96D]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 shadow-xl backdrop-blur-sm"
          title="View Service Details"
        >
          <Eye className="w-5 h-5 text-[#E0A96D]" />
        </button>

        {/* Duration Badge at Bottom Left */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-xs text-stone-100 font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5 text-[#E0A96D]" />
          <span>{service.duration}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-[#B76E79] dark:group-hover:text-[#E0A96D] transition-colors leading-snug">
            {service.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Key Benefits snippet */}
          <div className="mt-3.5 space-y-1.5">
            {service.benefits.slice(0, 2).map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                <span className="w-4 h-4 rounded-full bg-[#E0A96D]/15 text-[#8C5E35] dark:text-[#E0A96D] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </span>
                <span className="line-clamp-1">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-stone-400 font-semibold block">Investment</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl sm:text-2xl font-extrabold text-[#8C5E35] dark:text-[#E0A96D]">
                ₹{service.price.toLocaleString()}
              </span>
              {service.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{service.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(service)}
              className="px-3 py-2 text-xs font-semibold rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Details
            </button>
            <button
              id={`book-service-btn-${service.id}`}
              onClick={() => onBookNow(service)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white shadow-md shadow-[#E0A96D]/20 hover:shadow-lg hover:shadow-[#E0A96D]/35 hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
