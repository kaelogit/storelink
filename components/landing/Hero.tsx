"use client";

import Link from "next/link";
import { TrendingUp, Store, Search, ShoppingBag, CheckCircle, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-10 pb-12 md:pt-20 md:pb-20 overflow-hidden bg-white px-4 md:px-16 lg:px-32">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
         <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
         <div className="absolute top-20 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="flex-1 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-full font-bold text-[10px] md:text-xs uppercase tracking-wider mb-6 shadow-xl border border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Nigeria's #1 Social Commerce Engine
            </div>

            <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1]">
               Your business deserves <br className="hidden md:block" />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">a proper website.</span>
            </h1>

            <p className="text-base md:text-xl text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
               Stop sending blurry photos on WhatsApp. Create a stunning store link, look professional, and get paid instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
               <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                  <Store className="w-5 h-5" /> Create Your Store
               </Link>
               <Link href="/marketplace" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Explore Market
               </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-gray-500">
               <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 bg-cover`} style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})` }}></div>
                  ))}
               </div>
               <div className="flex flex-col items-start">
                  <div className="flex text-yellow-400"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                  <span>Trusted by 500+ Vendors</span>
               </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-[300px] md:max-w-md lg:max-w-full mx-auto lg:mx-0 mt-4 lg:mt-0">
             
             <div className="relative z-10 bg-white rounded-[2.5rem] border-[6px] md:border-8 border-gray-900 shadow-2xl overflow-hidden aspect-[9/18] max-h-[500px] md:max-h-[600px] mx-auto rotate-[-2deg] hover:rotate-0 transition duration-500 group">
                
                <div className="bg-gray-900 text-white p-3 pt-6 text-center relative">
                   <p className="text-[10px] md:text-xs font-medium opacity-70">storelink.ng/miras-perfume</p>
                </div>
                
                <div className="p-3 space-y-3 bg-gray-50 h-full overflow-hidden relative pb-10">
                   
                   <div className="bg-white p-2 rounded-lg border border-gray-100 flex items-center gap-2 text-gray-300">
                      <Search size={14} /> 
                      <span className="text-[10px]">Search perfumes...</span>
                   </div>

                   <div className="bg-white p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">M</div>
                        <div>
                           <h3 className="font-bold text-gray-900 text-sm">Mira's Perfume</h3>
                           <p className="text-[10px] text-gray-500">Lagos • Luxury Scents</p>
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                         <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=300&q=80" alt="Perfume 1" className="object-cover w-full h-full" />
                         </div>
                         <p className="font-bold text-[10px] text-gray-900 truncate">Chanel No. 5</p>
                         <p className="text-[10px] text-emerald-600 font-bold">₦85,000</p>
                      </div>

                      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                         <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1700522604220-471669e4364c?q=80&w=300&auto=format&fit=crop" alt="Perfume 2" className="object-cover w-full h-full" />
                         </div>
                         <p className="font-bold text-[10px] text-gray-900 truncate">Dior Sauvage</p>
                         <p className="text-[10px] text-emerald-600 font-bold">₦120,000</p>
                      </div>

                      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                         <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1663525056290-fa420c335b81?q=80&w=300&auto=format&fit=crop" alt="Perfume 3" className="object-cover w-full h-full" />
                         </div>
                         <p className="font-bold text-[10px] text-gray-900 truncate">YSL Libre</p>
                         <p className="text-[10px] text-emerald-600 font-bold">₦95,000</p>
                      </div>

                      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                         <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=300&auto=format&fit=crop" alt="Perfume 4" className="object-cover w-full h-full" />
                         </div>
                         <p className="font-bold text-[10px] text-gray-900 truncate">Versace Eros</p>
                         <p className="text-[10px] text-emerald-600 font-bold">₦60,000</p>
                      </div>
                   </div>

                   <div className="absolute bottom-20 right-4 bg-gray-900 text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition">
                      <ShoppingBag size={18} />
                   </div>
                </div>
             </div>

             <div className="absolute top-16 -right-4 md:top-24 md:-right-12 bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce duration-[3000ms] z-20">
                <div className="flex items-center gap-3">
                   <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <CheckCircle className="w-[18px] h-[18px] md:w-5 md:h-5" />
                   </div>
                   <div>
                      <p className="text-[10px] md:text-xs text-gray-400 font-bold">New Order</p>
                      <p className="font-bold text-sm md:text-base text-gray-900">₦25,000.00</p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}