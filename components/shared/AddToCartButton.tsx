"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag, Plus } from "lucide-react";
import { Product, Store } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  store: any; 
}

export default function AddToCartButton({ product, store }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    const storeObj: Store = {
       id: store.id,
       name: store.name,
       slug: store.slug,
       whatsapp_number: store.whatsapp_number,
       location: store.location,
       logo_url: store.logo_url,
       owner_id: store.id, 
       description: "",
       cover_image_url: "",
       subscription_plan: store.subscription_plan,
       view_count: 0,
       created_at: ""
    };

    addToCart(product, storeObj);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-8 md:pb-4 z-40">
      <div className="max-w-5xl mx-auto flex gap-4">
        <div className="hidden md:block">
           <p className="text-xs text-gray-500">Total Price</p>
           <p className="text-xl font-bold text-gray-900">₦{product.price.toLocaleString()}</p>
        </div>

        <button 
          onClick={handleAdd}
          disabled={product.stock_quantity < 1}
          className="flex-1 bg-gray-900 text-white h-14 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 active:scale-95 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
           {product.stock_quantity > 0 ? (
             <>
               <ShoppingBag size={20} /> Add to Bag
             </>
           ) : (
             "Sold Out"
           )}
        </button>
      </div>
    </div>
  );
}