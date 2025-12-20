"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag, Check } from "lucide-react";
import { Product, Store } from "@/types";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  store: any; 
}

export default function AddToCartButton({ product, store }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    const storeObj: Store = {
      id: store.id,
      name: store.name,
      slug: store.slug,
      whatsapp_number: store.whatsapp_number,
      location: store.location,
      logo_url: store.logo_url,
      owner_id: store.owner_id,
      description: store.description || "",
      cover_image_url: store.cover_image_url || "",
      subscription_plan: store.subscription_plan,
      loyalty_enabled: store.loyalty_enabled || false,
      loyalty_percentage: store.loyalty_percentage || 1,
    };

    addToCart(product, storeObj);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isOutOfStock = product.stock_quantity < 1;

  return (
    <div className="w-full mt-10">
      <div className="flex flex-col gap-4">
        
        <button 
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`
            w-full h-16 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] 
            transition-all duration-300 shadow-xl
            flex items-center justify-center gap-3 active:scale-95
            ${isOutOfStock 
               ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
               : isAdded 
                 ? 'bg-emerald-600 text-white shadow-emerald-100' 
                 : 'bg-gray-900 text-white hover:bg-black'
            }
          `}
        >
           {isOutOfStock ? (
             "Sold Out"
           ) : isAdded ? (
             <>
               <Check size={20} strokeWidth={3} className="animate-in zoom-in" />
               <span>Added to Bag</span>
             </>
           ) : (
             <>
               <ShoppingBag size={20} strokeWidth={2.5} />
               <span>Add to My Bag</span>
             </>
           )}
        </button>

        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center">
          Secure WhatsApp Checkout via StoreLink
        </p>
      </div>
    </div>
  );
}