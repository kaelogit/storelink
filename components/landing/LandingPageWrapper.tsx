"use client";

import { useState } from "react";
import { ShoppingBag, CheckCircle, Coins, Zap, ArrowRight } from "lucide-react"; 
import { Product, Store } from "@/types";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

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

      <section className="py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto bg-gray-900 overflow-hidden relative rounded-[2.5rem] md:rounded-[4rem] border border-white/5 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-12 p-8 md:p-20 relative z-10">
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-2 rounded-full mb-8">
                <Coins size={16} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">The StoreLink Economy</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-[0.95] mb-8">
                Shop. Earn. <br /><span className="text-amber-500">Empire.</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg mb-10 max-w-md font-medium leading-relaxed mx-auto md:mx-0">
                Stop just spending money. Start building your Empire. Earn digital gold on every purchase and redeem it as cash discounts across our entire network.
              </p>
              <Link href="/empire-coins" className="inline-flex items-center gap-4 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-500 transition-all active:scale-95 group shadow-2xl">
                How it works <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            <div className="flex-1 relative w-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-80 h-64 md:h-80 bg-amber-500/20 blur-[100px] rounded-full" />
              
              <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl relative z-10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Coins size={120} className="text-white" />
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/20">
                    <Zap size={28} fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-black uppercase text-sm tracking-tight leading-none mb-1">Universal Cashback</p>
                    <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest leading-none">Earn at Store A • Spend at Store B</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/5 rounded-full" />
                  <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                  <div className="mt-8 h-16 w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center px-6 justify-between border-dashed animate-pulse">
                     <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Empire Balance</span>
                     <span className="text-white font-black text-xl tracking-tighter">₦18,500</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

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
          <span className="absolute -top-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
              {cartCount} 
          </span>
        </button>
      )}

    </div>
  );
}