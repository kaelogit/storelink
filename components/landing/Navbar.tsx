"use client";

import Link from "next/link";
import { LayoutDashboard, Menu, X, ShoppingBag, Sparkles, Tag, User, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SignOutButton from "@/components/auth/SignOutButton";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const announcement = "Own your storefront, scale beyond contacts, and reach new buyers in the StoreLink marketplace";

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      setIsAuthenticated(Boolean(data?.user?.id));
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50">
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

      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 group">
             <LayoutDashboard className="text-emerald-600 group-hover:scale-110 transition duration-300" size={24}/>
             <span className="font-extrabold text-xl tracking-tight text-gray-900">StoreLink</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
              <Link href="/marketplace" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-2">
                <ShoppingBag size={16} /> Marketplace
              </Link>

              <Link href="/pricing" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-2">
                <Tag size={16} /> Pricing
              </Link>
              <Link href="/signup?next=%2Fpost-login&seller_intent=1" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition flex items-center gap-2">
                <Store size={16} /> Sell on StoreLink
              </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/post-login" className="px-4 py-2 rounded-xl text-sm font-black bg-gray-900 text-white hover:bg-emerald-600 transition">
                  Dashboard
                </Link>
                <SignOutButton className="px-4 py-2 rounded-xl text-sm font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                  Log out
                </SignOutButton>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 rounded-xl text-sm font-black bg-gray-900 text-white hover:bg-emerald-600 transition">
                  Get started
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-gray-900 focus:outline-none bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
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

               <Link 
                  href="/pricing" 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
               >
                  <Tag size={18} /> Plan Pricing
               </Link>
               <Link 
                  href="/signup?next=%2Fpost-login&seller_intent=1" 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
               >
                  <Store size={18} /> Sell on StoreLink
               </Link>
               {isAuthenticated ? (
                <>
                  <Link
                    href="/post-login"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-900 text-sm font-black text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <SignOutButton
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 text-sm font-black text-gray-700 w-full text-left"
                  >
                    <User size={18} /> Log out
                  </SignOutButton>
                </>
               ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 text-sm font-black text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} /> Login
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-900 text-sm font-black text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} /> Get started
                  </Link>
                </>
               )}
             </div>
          </div>
        )}
      </nav>
    </header>
  );
}