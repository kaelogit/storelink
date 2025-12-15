"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

export default function ProductGallery({ images }: { images: string[] }) {
  const safeImages = images && images.length > 0 ? images : [];
  const [activeImage, setActiveImage] = useState(safeImages[0] || "");

  if (safeImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
        <Package size={64} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100 shadow-sm">
        <Image 
          src={activeImage} 
          alt="Product" 
          fill 
          className="object-cover animate-in fade-in duration-300" 
          priority
        />
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {safeImages.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setActiveImage(img)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${activeImage === img ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <Image src={img} alt={`View ${i}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}