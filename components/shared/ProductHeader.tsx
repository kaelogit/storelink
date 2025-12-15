"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface ProductHeaderProps {
  storeSlug: string;
}

export default function ProductHeader({ storeSlug }: ProductHeaderProps) {
  const router = useRouter();
  const { cartCount, openCart } = useCart();

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 h-16 flex items-center justify-between">
      
      <button 
        onClick={() => router.back()} 
        className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-700 transition"
      >
        <ArrowLeft size={22} />
      </button>

      <button 
        onClick={openCart}
        className="relative p-2 hover:bg-gray-100 rounded-full transition text-gray-700"
      >
        <ShoppingBag size={22} />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}