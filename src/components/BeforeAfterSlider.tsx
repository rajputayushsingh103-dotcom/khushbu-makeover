import React, { useState, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  tag?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After Makeover',
  title,
  tag
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E0A96D]/30 bg-stone-950 select-none group">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden cursor-ew-resize"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER IMAGE (Background) */}
        <img
          src={afterImage}
          alt="After Makeover"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* BEFORE IMAGE (Clipped Layer) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img
            src={beforeImage}
            alt="Before Makeover"
            className="absolute inset-0 w-full h-full object-cover object-center filter grayscale-[20%]"
          />
        </div>

        {/* Vertical Divider Line & Dragger Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FAF7F5] via-[#E0A96D] to-[#FAF7F5] shadow-[0_0_12px_rgba(224,169,109,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#1C1819] border-2 border-[#E0A96D] shadow-xl flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
            <div className="flex items-center gap-0.5 text-[#E0A96D] text-[10px] font-bold">
              <span>‹</span>
              <span>›</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-stone-200 border border-white/10 pointer-events-none">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 bg-[#E0A96D]/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-stone-950 border border-[#E0A96D] flex items-center gap-1 shadow-lg pointer-events-none">
          <Sparkles className="w-3 h-3" />
          {afterLabel}
        </div>

        {/* Hint helper */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-medium text-stone-300 pointer-events-none transition-opacity duration-300 opacity-90 group-hover:opacity-100 flex items-center gap-1.5">
          <span>Drag left or right to compare</span>
        </div>
      </div>

      {title && (
        <div className="p-4 bg-[#1A1818] border-t border-[#E0A96D]/20 flex items-center justify-between">
          <div>
            <h4 className="font-serif text-sm sm:text-base font-semibold text-white">{title}</h4>
            {tag && <p className="text-[11px] text-[#E0A96D] font-medium">{tag}</p>}
          </div>
          <span className="text-[11px] text-stone-400">Master Artist: Khushboo</span>
        </div>
      )}
    </div>
  );
};
