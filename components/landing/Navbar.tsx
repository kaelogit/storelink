"use client";

import Link from "next/link";
import { LayoutDashboard, Menu, X, ArrowRight, User, ShoppingBag, Sparkles, Wallet } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const announcement = "STORELINK LAUNCHES IN 7 DAYS";

  return (
    <header className="sticky top-0 z-50">
      {/* 🚀 ANNOUNCEMENT MARQUEE */}
      <div className="bg-black text-white py-2.5 overflow-hidden border-b border-gray-800 flex relative z-[60]">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="mx-10 flex items-center gap-2 text-[10px] md:text-xs font-black tracking-[0.15em] uppercase">
              <Sparkles size={14} className="text-emerald-400" />
              {announcement}
            </span>
          ))}
        </div>
      </div>

      {/* 🛡️ MAIN NAVIGATION */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
             <LayoutDashboard className="text-emerald-600 group-hover:scale-110 transition duration-300" size={24}/>
             <span className="font-extrabold text-xl tracking-tight text-gray-900">StoreLink</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
              <Link href="/marketplace" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-2">
                <ShoppingBag size={16} /> Marketplace
              </Link>

              {/* ✨ EMPIRE WALLET LINK (DESKTOP) */}
              <Link href="/wallet" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <Wallet size={16} /> My Wallet
              </Link>

              <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-2">
                <User size={16} /> Login
              </Link>
              
              <Link href="/signup" className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
                Start Selling <ArrowRight size={14} />
              </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-gray-900 focus:outline-none bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-[calc(100%)] left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-5 z-40">
             <div className="flex flex-col p-4 space-y-2">
               <Link 
                  href="/marketplace" 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
               >
                  <ShoppingBag size={18} /> Shop Marketplace
               </Link>

               {/* ✨ EMPIRE WALLET LINK (MOBILE) */}
               <Link 
                  href="/wallet" 
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100"
                  onClick={() => setIsMenuOpen(false)}
               >
                  <Wallet size={18} /> My Empire Wallet
               </Link>

               <Link 
                  href="/login" 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
               >
                  <User size={18} /> Vendor Login
               </Link>

               <div className="h-px bg-gray-100 my-2"></div>
               
               <Link 
                  href="/signup" 
                  className="block w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold text-center shadow-md"
                  onClick={() => setIsMenuOpen(false)}
               >
                  Create My Store
               </Link>
             </div>
          </div>
        )}
      </nav>
    </header>
  );
}