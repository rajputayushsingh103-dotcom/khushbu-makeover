import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';

export const FloatingSocialWidget: React.FC = () => {
  // 🔗 Aapka naya Instagram Link:
  const instagramUrl = 'https://www.instagram.com/khusbhumakeover_pbh?utm_source=qr&igsh=eXNnazl5aXhheG80';
  
  // 🔗 WhatsApp Link:
  const whatsappGroupUrl = 'https://whatsapp.com/channel/0029VbDQmS84Y9lsvBOz0f47';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* 1. INSTAGRAM FLOATING BUTTON */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram Page"
        className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-xl shadow-rose-500/30 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/40"
      >
        <Instagram className="w-6 h-6 text-white" />

        {/* Tooltip on hover */}
        <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-stone-900/95 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl border border-white/10 hidden sm:inline-block">
          Follow on Instagram 📸
        </span>
      </a>

      {/* 2. WHATSAPP FLOATING BUTTON */}
      <a
        href={whatsappGroupUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join WhatsApp Group"
        className="group relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/40"
      >
        {/* Pulse Animation Ring */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30"></span>

        <MessageCircle className="w-6 h-6 fill-white text-[#25D366] relative z-10" />

        {/* Tooltip on hover */}
        <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-stone-900/95 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl border border-white/10 hidden sm:inline-block">
          Join VIP WhatsApp Group 💬
        </span>
      </a>
    </div>
  );
};