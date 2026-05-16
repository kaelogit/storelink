"use client";

import Link from "next/link";
import { 
  TrendingUp, 
  Search, 
  ShoppingBag, 
  CheckCircle, 
  Store, 
  Radar,
  ArrowRight,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white px-4 md:px-8 lg:px-16 pt-2 md:pt-0"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] transition-all duration-1000"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
            left: `${mousePos.x * 100}%`,
            top: `${mousePos.y * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px] transition-all duration-1000"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
            right: `${(1 - mousePos.x) * 30}%`,
            bottom: `${(1 - mousePos.y) * 30}%`,
            transform: "translate(50%, 50%)",
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 py-12 md:py-24">
        <div className="flex flex-col items-center text-center">
          
          {/* Content */}
          <div className="max-w-2xl mb-10 md:mb-16">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Storefront · Checkout · Discovery
            </div>

            {/* Headline — mobile-first sizing */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-5 leading-[1.05]">
              <span className="block">Your brand's</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                official link
              </span>
              <span className="block text-gray-400 font-light text-2xl sm:text-3xl md:text-5xl lg:text-6xl mt-1">
                for more sales.
              </span>
            </h1>

            {/* Body */}
            <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
              A <span className="text-gray-900 font-semibold">dedicated shop link</span> customers trust,{" "}
              <span className="text-gray-900 font-semibold">secure checkout</span>, and a{" "}
              <span className="text-gray-900 font-semibold">marketplace</span> to reach new buyers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link 
                href="/signup?next=%2Fpost-login" 
                className="group w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-gray-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Create storefront
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/#marketplace" 
                className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" /> 
                Browse marketplace
              </Link>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-emerald-600" />
                Professional Link
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                Secure Checkout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Radar className="h-3.5 w-3.5 text-emerald-600" />
                Marketplace
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] lg:absolute lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:max-w-md perspective-1000">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[400px] bg-emerald-200/30 rounded-[3rem] blur-[50px]" />
            
            <div className="relative bg-white rounded-[2.5rem] border-[5px] border-gray-900 shadow-2xl overflow-hidden aspect-[9/18.5] max-h-[460px] sm:max-h-[500px] md:max-h-[550px] mx-auto hover:scale-[1.02] transition-all duration-500 rotate-[-2deg]">
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-2xl z-20" />
              
              <div className="bg-gray-900 text-white/70 p-2.5 pt-6 pb-2 text-center">
                <p className="text-[10px] font-medium tracking-wide">yourbrand.storelink.ng</p>
              </div>

              <div className="p-2.5 space-y-2.5 bg-gray-50 h-full overflow-hidden relative pb-10">
                
                <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 text-gray-400">
                  <Search size={12} /> 
                  <span className="text-[10px]">Search...</span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">L</div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xs">Lemar Essential</h3>
                      <p className="text-[9px] text-gray-500">Lagos • Luxury</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { name: "Nike Air", price: "₦85K", img: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1974&auto=format&fit=crop" },
                    { name: "Gucci", price: "₦120K", img: "https://images.unsplash.com/photo-1682364853446-db043f643207?q=80&w=1170&auto=format&fit=crop" },
                    { name: "Rayban", price: "₦95K", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=880&auto=format&fit=crop" },
                    { name: "Kid wears", price: "₦60K", img: "https://images.unsplash.com/flagged/photo-1555895312-bbc472c964f3?q=80&w=688&auto=format&fit=crop" },
                  ].map((product, i) => (
                    <div key={i} className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm group">
                      <div className="w-full aspect-square bg-gray-100 rounded-lg mb-1 relative overflow-hidden">
                        <img src={product.img} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <p className="font-semibold text-[9px] text-gray-900 truncate">{product.name}</p>
                      <p className="text-[9px] text-emerald-600 font-bold">{product.price}</p>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-16 right-3 bg-gray-900 text-white p-2.5 rounded-full shadow-lg hover:scale-110 hover:bg-emerald-600 transition-all">
                  <ShoppingBag size={16} />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="absolute top-10 -right-2 md:top-16 md:-right-8 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 animate-float z-20">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 p-1.5 rounded-full text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Paid</p>
                  <p className="font-bold text-sm text-gray-900">₦25,000</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 -left-3 md:bottom-28 md:-left-10 bg-white p-2.5 rounded-2xl shadow-xl border border-gray-100 animate-float-delayed z-20">
              <div className="flex items-center gap-2">
                <div className="bg-purple-50 p-1.5 rounded-full text-purple-600">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-semibold">New Order</p>
                  <p className="text-xs font-bold text-gray-900">+3 today</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}