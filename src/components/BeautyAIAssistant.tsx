import React, { useState } from 'react';
import { Sparkles, X, Wand2, ArrowRight, UserCheck, Heart, RefreshCw, Calendar } from 'lucide-react';
import { Service } from '../types';

interface BeautyAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (service?: Service) => void;
  services: Service[];
}

export const BeautyAIAssistant: React.FC<BeautyAIAssistantProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  services
}) => {
  const [occasion, setOccasion] = useState('Grand Wedding (Bride)');
  const [outfitColor, setOutfitColor] = useState('Deep Crimson Red & Gold');
  const [skinType, setSkinType] = useState('Combination with Warm Undertone');
  const [hairLength, setHairLength] = useState('Long / Medium Curls');
  const [concerns, setConcerns] = useState('Need 24H long stay with zero flashback');

  const [loading, setLoading] = useState(false);
  const [consultationResult, setConsultationResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          outfitColor,
          skinType,
          hairLength,
          concerns
        })
      });

      if (res.ok) {
        const data = await res.json();
        setConsultationResult(data.advice);
      } else {
        throw new Error('Fallback needed');
      }
    } catch (err) {
      // Fallback recommendation
      setConsultationResult(`### ✨ Khushboo Makeover Bespoke Beauty Prescription

**1. Recommended Makeup:**
For your **${occasion}** with **${outfitColor}**, our **Signature Royal HD Airbrush Makeup** is the ideal match.
- **Base:** Lightweight silicone airbrush base with champagne highlight on cheekbones, guaranteeing 24-hour tear and sweat resistance without flash glare.
- **Eyes:** Shimmering gold and rose duochrome cut-crease with dramatic winged liner & 3D silk lashes.
- **Lips:** Velvet matte berry-rose with hydrating center glow.

**2. Hair Styling Prescription:**
- **Look:** Textured royal bridal low-bun embellished with fresh baby's breath flowers or voluminous cascading Hollywood waves.
- **Prep:** Kérastase caviar thermal shield for mirror gloss.

**3. Recommended Salon Rituals:**
- **2 Weeks Prior:** HydraFacial MD® Diamond Glow + 24K Pure Gold Brightening Facial.
- **3 Days Prior:** Brazilian Keratin Gloss & Swarovski Nail Extensions.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F5] dark:bg-[#1A1818] rounded-3xl shadow-2xl border border-[#E0A96D]/30 text-stone-900 dark:text-stone-100 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E1B1C] via-[#2E2223] to-[#1E1B1C] p-6 sm:p-7 border-b border-[#E0A96D]/30 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 text-stone-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0A96D]/15 text-[#E0A96D] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Master Stylist & Bridal Consultant
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Personalized Beauty Architecture
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Get instant couture makeup, hairstyle, and skincare recommendations crafted for your specific outfit and occasion.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {consultationResult ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900/80 border border-[#E0A96D]/30 shadow-inner text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                {consultationResult}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setConsultationResult(null)}
                  className="py-3 px-5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Different Outfit / Event</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Recommended Bridal Experience</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Occasion / Event *
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  >
                    <option value="Grand Wedding (Bride)">Grand Wedding (Bride)</option>
                    <option value="Cocktail & Sangeet Gala">Cocktail & Sangeet Gala</option>
                    <option value="Ring Ceremony & Engagement">Ring Ceremony & Engagement</option>
                    <option value="Reception Night">Reception Night</option>
                    <option value="Bridesmaid Glam">Bridesmaid Glam</option>
                    <option value="Editorial & Photoshoot">Editorial & Photoshoot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Outfit Color & Fabric *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pastel Rose Gold Silk, Emerald Velvet"
                    value={outfitColor}
                    onChange={(e) => setOutfitColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Skin Type & Undertone
                  </label>
                  <select
                    value={skinType}
                    onChange={(e) => setSkinType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  >
                    <option value="Combination with Warm Undertone">Combination (Warm/Golden Undertone)</option>
                    <option value="Oily Skin with Neutral Undertone">Oily / Humidity-prone (Neutral Undertone)</option>
                    <option value="Dry Skin with Cool/Pink Undertone">Dry Skin (Cool / Rosy Undertone)</option>
                    <option value="Sensitive / Acne-prone">Sensitive / Acne-prone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Hair Texture & Length
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Waist-length wavy, Frizzy curls"
                    value={hairLength}
                    onChange={(e) => setHairLength(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  Specific Desires & Concerns
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Natural dewy finish, dramatic glitter eyes, heavy dupatta pinning..."
                  value={concerns}
                  onChange={(e) => setConcerns(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-[#E0A96D]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white text-xs sm:text-sm font-bold shadow-md hover:scale-102 active:scale-98 transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Curating Bespoke Look...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Generate My Look</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
