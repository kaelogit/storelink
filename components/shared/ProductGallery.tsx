"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Package, Zap, X, Maximize2, ZoomIn } from "lucide-react";

export default function ProductGallery({ images, stockCount }: { images: string[], stockCount?: number }) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const safeImages = images && images.length > 0 ? images : [];
  const isLowStock = stockCount !== undefined && stockCount > 0 && stockCount <= 5;

  // Sync scroll position when thumbnails are clicked
  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * index;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Update index based on scroll position (for mobile swiping)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = e.currentTarget.scrollLeft;
    const itemWidth = e.currentTarget.offsetWidth;
    const newIndex = Math.round(scrollPosition / itemWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  if (safeImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 border border-gray-100">
        <Package size={64} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* --- MAIN DISPLAY (Mobile Swipeable) --- */}
      <div className="relative group">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-x-auto flex snap-x snap-mandatory no-scrollbar border border-gray-100 shadow-xl cursor-zoom-in"
        >
          {safeImages.map((img, i) => (
            <div 
              key={i} 
              className="min-w-full h-full relative snap-center"
              onClick={() => setIsZoomOpen(true)}
            >
              <Image 
                src={img} 
                alt={`Product View ${i}`} 
                fill 
                className="object-cover" 
                priority={i === 0}
              />
            </div>
          ))}

          {/* Zoom Indicator (Desktop Only) */}
          <div className="absolute bottom-6 right-6 bg-black/20 backdrop-blur-md p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:block border border-white/20">
            <Maximize2 size={24} className="text-white" />
          </div>

          {/* Low Stock Badge */}
          {isLowStock && (
            <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl animate-pulse z-10 flex items-center gap-2">
              <Zap size={12} fill="currentColor" /> Only {stockCount} Left
            </div>
          )}
        </div>

        {/* Mobile Swipe Pagination Dots */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
            {safeImages.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i ? "bg-emerald-500 w-4" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- THUMBNAILS (Desktop Focus) --- */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
          {safeImages.map((img, i) => (
            <button 
              key={i} 
              onClick={() => handleThumbnailClick(i)}
              className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all active:scale-90 ${
                activeIndex === i 
                ? 'border-emerald-500 shadow-lg shadow-emerald-100' 
                : 'border-transparent grayscale opacity-60'
              }`}
            >
              <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* --- ZOOM MODAL --- */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center animate-in fade-in duration-300">
          <button 
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-4 text-white hover:bg-white/10 rounded-full transition-colors z-[110]"
          >
            <X size={32} />
          </button>
          
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] p-4 flex items-center justify-center">
            <Image 
              src={safeImages[activeIndex]} 
              alt="Zoomed Product" 
              width={1200}
              height={1500}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-500"
            />
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
            <p className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <ZoomIn size={14} /> Tap anywhere to close
            </p>
          </div>
          
          <div className="absolute inset-0 -z-10" onClick={() => setIsZoomOpen(false)} />
        </div>
      )}
    </div>
  );
}