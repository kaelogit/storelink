"use client";

import { useState } from "react";
import { ShoppingBag, CheckCircle } from "lucide-react";
import { Product, Store } from "@/types";
import { useCart } from "@/context/CartContext"; // <--- Using Global Context

import Navbar from "./Navbar";
import Hero from "./Hero";
import ValueProp from "./ValueProp";
import HowItWorks from "./HowItWorks";
import TrustCenter from "./TrustCenter";
import Marketplace from "./Marketplace";
import Footer from "./Footer";

interface LandingPageWrapperProps {
  products: Product[];
  stores: Store[];
}

export default function LandingPageWrapper({ products, stores }: LandingPageWrapperProps) {
  const { cart, cartCount, addToCart, setIsCartOpen, isCartOpen } = useCart();
  
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });

  const handleAddToCart = (product: Product) => {
    const productStore = stores.find(s => s.id === product.store_id);
    if (!productStore) return;
    
    addToCart(product, productStore);

    setToast({ show: true, msg: `Added ${product.name} to bag` });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100">
      
      <Navbar />
      
      <Hero />
      <ValueProp />
      <HowItWorks />
      
      <Marketplace products={products} stores={stores} onAddToCart={handleAddToCart} />
      
      <TrustCenter />
      <Footer />

      {toast.show && (
        <div className="fixed top-24 right-4 z-[60] bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in">
           <CheckCircle size={20} className="text-green-400" />
           <span className="font-bold text-sm">{toast.msg}</span>
        </div>
      )}

      {cartCount > 0 && !isCartOpen && (
        <button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 bg-gray-900 text-white p-4 rounded-full shadow-2xl z-40 hover:scale-105 transition animate-in zoom-in">
          <ShoppingBag size={24} />
          <span className="absolute -top-1 -right-1 bg-red-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
              {cartCount} 
          </span>
        </button>
      )}

    </div>
  );
}