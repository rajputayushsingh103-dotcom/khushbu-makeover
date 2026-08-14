import React, { useState } from 'react';
import { Sparkles, Eye, X, ChevronLeft, ChevronRight, Play, Filter } from 'lucide-react';
import { GalleryItem } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface GalleryLightboxProps {
  galleryItems: GalleryItem[];
  onOpenBooking: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  galleryItems,
  onOpenBooking
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Portfolio' },
    { id: 'bridal', label: 'Royal Bridal' },
    { id: 'hd-makeup', label: 'HD & Party Glam' },
    { id: 'hair', label: 'Hair & Balayage' },
    { id: 'skin', label: 'Skin & Facials' },
    { id: 'nail-art', label: 'Nail Art' },
    { id: 'mehendi', label: 'Mehendi' },
    { id: 'salon', label: 'VIP Studio' }
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const activeItem = activeItemIndex !== null ? filteredItems[activeItemIndex] : null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeItemIndex !== null) {
      setActiveItemIndex((activeItemIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeItemIndex !== null) {
      setActiveItemIndex((activeItemIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div id="gallery-component" className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 no-scrollbar">
        {categories.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#E0A96D] text-white shadow-md shadow-[#E0A96D]/25'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-[#E0A96D]/40'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Gallery Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => {
          const hasComparison = !!(item.beforeImage && item.afterImage);
          return (
            <div
              key={item.id}
              onClick={() => setActiveItemIndex(index)}
              className="group relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-200/60 dark:border-[#E0A96D]/20 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-[3/4]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag / Category Badge */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                {item.tag && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E0A96D] text-stone-950 shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {item.tag}
                  </span>
                )}
                {hasComparison && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-stone-900 backdrop-blur-sm">
                    Before / After
                  </span>
                )}
              </div>

              {/* Zoom Action Icon */}
              <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4 text-[#E0A96D]" />
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <h4 className="font-serif text-base font-bold text-white group-hover:text-[#E0A96D] transition-colors leading-snug">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-stone-300 mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200"
          onClick={() => setActiveItemIndex(null)}
        >
          {/* Close Lightbox */}
          <button
            onClick={() => setActiveItemIndex(null)}
            className="absolute top-6 right-6 z-30 w-11 h-11 rounded-full bg-stone-900/90 text-stone-200 hover:text-white border border-white/20 flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-30 w-11 h-11 rounded-full bg-stone-900/90 text-stone-200 hover:text-[#E0A96D] border border-white/20 flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-30 w-11 h-11 rounded-full bg-stone-900/90 text-stone-200 hover:text-[#E0A96D] border border-white/20 flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div
            className="relative max-w-4xl w-full max-h-[85vh] bg-[#161415] rounded-3xl overflow-hidden border border-[#E0A96D]/30 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Display Before/After Comparison IF available, otherwise High-Res Photo */}
            <div className="relative flex-1 max-h-[65vh] overflow-hidden flex items-center justify-center bg-black">
              {activeItem.beforeImage && activeItem.afterImage ? (
                <div className="w-full max-w-2xl p-4">
                  <BeforeAfterSlider
                    beforeImage={activeItem.beforeImage}
                    afterImage={activeItem.afterImage}
                    title={activeItem.title}
                    tag={activeItem.tag}
                  />
                </div>
              ) : (
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
                />
              )}
            </div>

            {/* Bottom Details & Booking CTA */}
            <div className="p-6 bg-[#1C1A1B] border-t border-[#E0A96D]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E0A96D] font-bold">Khushboo Makeover Master Artistry</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">{activeItem.title}</h3>
                {activeItem.description && (
                  <p className="text-xs sm:text-sm text-stone-300 mt-1">{activeItem.description}</p>
                )}
              </div>

              <button
                onClick={() => {
                  setActiveItemIndex(null);
                  onOpenBooking();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-semibold text-xs sm:text-sm shadow-md hover:scale-105 transition-transform shrink-0"
              >
                Book This Look
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
