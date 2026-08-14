import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { SalonInfo } from '../types';
import { SALON_INFO } from '../data/initialData';

interface WhatsAppFloatingButtonProps {
  salonInfo?: SalonInfo;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ salonInfo }) => {
  const info = salonInfo || SALON_INFO;
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    'Bridal Makeup Availability for Wedding Date',
    'Pre-Bridal 7-Day Package Details & Pricing',
    'HydraFacial & Hair Smoothening Appointment'
  ];

  const handleSend = (text: string) => {
    const message = encodeURIComponent(text || `Hello ${info.name}, I would like to book a VIP appointment.`);
    const waNumber = (info.whatsapp || '919876543210').replace(/\D/g, '');
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Quick Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white dark:bg-[#1C1A1B] rounded-3xl shadow-2xl border border-[#E0A96D]/40 overflow-hidden text-stone-900 dark:text-stone-100 animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white text-[#128C7E] font-serif font-bold flex items-center justify-center text-sm shadow-md">
                  KM
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-300 border-2 border-white" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm leading-tight">{info.name} Concierge</h4>
                <p className="text-[11px] text-white/90">Typically replies in under 5 minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#F0F2F5] dark:bg-[#141213]">
            <div className="bg-white dark:bg-[#1F1C1D] p-3 rounded-2xl rounded-tl-sm shadow-sm border border-stone-200/60 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200">
              <p>🌸 Namaste! Welcome to {info.name} Luxury Bridal Studio.</p>
              <p className="mt-1 text-stone-500 dark:text-stone-400">How may our senior concierge assist your beauty experience today?</p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Quick Inquiries:</span>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left text-xs p-2.5 rounded-xl bg-white dark:bg-[#252223] hover:bg-[#E0A96D]/20 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 transition-colors block"
                >
                  💬 {prompt}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-1.5 pt-2">
              <input
                type="text"
                placeholder="Type your question..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(customMsg)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#252223] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSend(customMsg)}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/40"
        aria-label="Chat on WhatsApp with Khushboo Makeover"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold flex items-center justify-center animate-pulse">
          1
        </span>
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />

        {/* Floating Tooltip */}
        <span className="hidden sm:inline-block absolute right-16 bg-stone-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Chat with Khushboo Makeover
        </span>
      </button>
    </div>
  );
};
