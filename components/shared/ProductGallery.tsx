"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Zap, X, Maximize2, ZoomIn } from "lucide-react";

export default function ProductGallery({ images, stockCount }: { images: string[], stockCount?: number }) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const safeImages = images && images.length > 0 ? images : [];
  const [activeImage, setActiveImage] = useState(safeImages[0] || "");
  const isLowStock = stockCount !== undefined && stockCount > 0 && stockCount <= 5;

  if (safeImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 border border-gray-100">
        <Package size={64} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative group">
        <div 
          onClick={() => setIsZoomOpen(true)}
          className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden relative border border-gray-100 shadow-xl cursor-zoom-in transition-transform duration-500 active:scale-95"
        >
          <Image 
            src={activeImage} 
            alt="Product" 
            fill 
            className="object-cover animate-in fade-in zoom-in-95 duration-500" 
            priority
          />
          
          <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:block border border-white/20">
            <Maximize2 size={20} className="text-white" />
          </div>
          
          {isLowStock && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl animate-pulse z-10 flex items-center gap-2">
              <Zap size={12} fill="currentColor" /> Hurry! Only {stockCount} Left
            </div>
          )}
        </div>
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
          {safeImages.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setActiveImage(img)}
              className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all active:scale-90 ${
                activeImage === img 
                ? 'border-emerald-500 shadow-lg shadow-emerald-100' 
                : 'border-transparent grayscale opacity-60'
              }`}
            >
              <Image src={img} alt={`View ${i}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {isZoomOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center animate-in fade-in duration-300">
          <button 
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-4 text-white hover:bg-white/10 rounded-full transition-colors z-50"
          >
            <X size={32} />
          </button>
          
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] p-4 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image 
                src={activeImage} 
                alt="Zoomed Product" 
                width={1200}
                height={1500}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-500"
              />
            </div>
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