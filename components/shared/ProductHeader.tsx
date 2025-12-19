"use client";

import { ChevronLeft, ShoppingBag, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

interface ProductHeaderProps {
  storeSlug: string;
  storeLogo?: string; // 
}

export default function ProductHeader({ storeSlug, storeLogo }: ProductHeaderProps) {
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 h-16 flex items-center justify-between">
      
      <button 
        onClick={() => router.back()} 
        className="p-2 text-gray-900 active:scale-75 transition-all duration-200"
        aria-label="Go back"
      >
        <ChevronLeft size={28} strokeWidth={2.5} />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        
        <Link 
          href="/" 
          className="active:scale-90 transition-transform flex items-center justify-center hover:opacity-80"
          title="Go to Home"
        >
          <LayoutDashboard size={26} className="text-emerald-600" />
        </Link>

        <span className="text-gray-200 font-light text-xl select-none">|</span>

        <Link 
          href={`/${storeSlug}`}
          className="active:scale-90 transition-transform group"
        >
          <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm group-hover:border-emerald-200 transition-all">
            {storeLogo ? (
              <Image 
                src={storeLogo} 
                alt="Store Logo" 
                fill 
                className="object-cover" 
                sizes="36px"
              />
            ) : (
              /* Fallback if no image exists: a sleek dark square with initials */
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                 <span className="text-[10px] text-white font-black">{storeSlug.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* 3. CART ICON */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-gray-900 active:scale-75 transition-all duration-200"
      >
        <ShoppingBag size={24} strokeWidth={2.5} />
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 bg-emerald-500 text-white text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}