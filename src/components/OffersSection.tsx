import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Offer } from '../types';

interface OffersSectionProps {
  offers: Offer[];
  onClaimOffer: (offer: Offer) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  offers,
  onClaimOffer
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const activeOffers = offers.filter(o => o.isActive);

  return (
    <div id="offers-component" className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeOffers.map(offer => (
          <div
            key={offer.id}
            className="group bg-white dark:bg-[#1C1A1B] rounded-3xl overflow-hidden border border-stone-200/80 dark:border-[#E0A96D]/20 shadow-xl hover:shadow-2xl hover:border-[#E0A96D]/50 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Image Banner */}
            <div className="relative aspect-[16/9] overflow-hidden bg-stone-950">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-3.5 left-3.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E0A96D] text-stone-950 shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {offer.badge}
                </span>
              </div>

              <div className="absolute bottom-3 right-3.5 flex items-center gap-1 text-[11px] font-semibold text-stone-200 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                <Clock className="w-3 h-3 text-[#E0A96D]" />
                <span>Valid till: {offer.validTill}</span>
              </div>
            </div>

            {/* Offer Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white leading-snug">
                  {offer.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed">
                  {offer.subtitle}
                </p>

                {/* Included services */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                    Package Inclusions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {offer.servicesIncluded.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 text-[11px] rounded-lg bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-medium">
                        • {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promo Code & Claim Button */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                {/* Coupon Code Pill */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E0A96D]/10 dark:bg-[#E0A96D]/15 border border-dashed border-[#E0A96D]/40">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#B76E79] dark:text-[#E0A96D]" />
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#8C5E35] dark:text-[#E0A96D] tracking-wider">
                      {offer.code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="px-2.5 py-1 rounded-md bg-white dark:bg-stone-900 text-[11px] font-semibold text-stone-800 dark:text-stone-200 hover:text-[#E0A96D] flex items-center gap-1 shadow-sm transition-colors"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => onClaimOffer(offer)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Claim Package & Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
