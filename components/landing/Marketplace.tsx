"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { Search, Package, ChevronRight, Plus, ArrowRight, BadgeCheck, Gem } from "lucide-react";
import { Product, Store } from "@/types";

interface MarketplaceProps {
  products: Product[];
  stores: Store[];
  onAddToCart: (product: Product) => void;
}

export default function Marketplace({ products, stores, onAddToCart }: MarketplaceProps) {
  const [view, setView] = useState<'products' | 'vendors'>('products');
  const [search, setSearch] = useState("");

  const isPaidPlan = (plan?: string) => plan === 'premium' || plan === 'diamond';

  const getRank = (plan?: string) => {
     if (plan === 'diamond') return 3;
     if (plan === 'premium') return 2;
     return 1;
  };

  const filteredProducts = products
    .filter(p => {
       const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
       const isPremiumStore = isPaidPlan(p.stores?.subscription_plan);
       return matchesSearch && isPremiumStore;
    })
    .sort((a, b) => getRank(b.stores?.subscription_plan) - getRank(a.stores?.subscription_plan))
    .slice(0, 12); 

  const filteredStores = stores
    .filter(s => {
       const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
       const isPremiumStore = isPaidPlan(s.subscription_plan);
       return matchesSearch && isPremiumStore;
    })
    .sort((a, b) => getRank(b.subscription_plan) - getRank(a.subscription_plan))
    .slice(0, 12); 

  return (
    <section id="marketplace" className="py-16 px-4 bg-gray-50 min-h-screen border-t border-gray-100">
      <div className="max-w-6xl mx-auto mb-4">
        
        <div className="text-center mb-10">
           <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
           <p className="text-gray-500 mt-2">Fresh drops from verified Naija vendors.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <button onClick={() => setView('products')} className={`px-6 py-2 rounded-lg text-sm font-bold transition ${view === 'products' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>Items</button>
            <button onClick={() => setView('vendors')} className={`px-6 py-2 rounded-lg text-sm font-bold transition ${view === 'vendors' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>Stores</button>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input 
              placeholder={`Search ${view}...`} 
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {view === 'products' ? (
          
          <div className="
            grid grid-rows-2 grid-flow-col auto-cols-[45%] gap-4 overflow-x-auto snap-x snap-mandatory pb-4 
            md:grid-cols-4 md:grid-rows-none md:grid-flow-row md:auto-cols-auto md:overflow-visible md:pb-0
          ">
            {filteredProducts.map(product => (
              <Link 
                href={`/product/${product.id}`}
                key={product.id} 
                className="snap-start bg-white p-2 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group cursor-pointer block h-full"
              >
                <div className="aspect-square bg-gray-100 rounded-xl mb-3 relative overflow-hidden">
                  {product.image_urls?.[0] ? (
                    <Image src={product.image_urls[0]} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Package /></div>
                  )}
                  
                  {/* 👇 RESTORED: The TOP Badge for Diamond Users */}
                  {product.stores?.subscription_plan === 'diamond' && (
                    <span className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1 z-20">
                       <Gem size={10} className="fill-white"/> TOP
                    </span>
                  )}

                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }} 
                    className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-900 hover:text-white transition z-10"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      <span className="truncate max-w-[100px]">{product.stores?.name}</span>
                      
                      {/* 1. Verified Identity (Blue Tick) */}
                      {product.stores?.verification_status === 'verified' && (
                        <BadgeCheck size={12} className="text-blue-500 fill-blue-50" />
                      )}

                      {/* 2. Diamond Status (Purple Gem Icon) */}
                      {product.stores?.subscription_plan === 'diamond' && (
                        <Gem size={12} className="text-purple-600" />
                      )}
                  </div>

                  <p className="text-emerald-600 font-bold text-sm">₦{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>

        ) : (
          
          <div className="
            grid grid-rows-2 grid-flow-col auto-cols-[75%] gap-4 overflow-x-auto snap-x snap-mandatory pb-4
            md:grid-cols-3 md:grid-rows-none md:grid-flow-row md:auto-cols-auto md:overflow-visible md:pb-0
          ">
            {filteredStores.map(store => (
              <a 
                href={`/${store.slug}`} 
                key={store.id} 
                className="snap-start bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4 h-full"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden relative border border-gray-100 shrink-0">
                  {store.logo_url ? <Image src={store.logo_url} alt="" fill className="object-cover" /> : null}
                </div>
                <div className="min-w-0">
                   <h3 className="font-bold text-gray-900 flex items-center gap-1 text-sm truncate">
                     <span className="truncate">{store.name}</span>
                     
                     {/* 1. Verified Identity (Blue Tick) */}
                     {store.verification_status === 'verified' && (
                       <BadgeCheck size={14} className="text-blue-500 fill-blue-50 shrink-0" />
                     )}

                     {/* 2. Diamond Status (Purple Gem) */}
                     {store.subscription_plan === 'diamond' && (
                       <Gem size={14} className="text-purple-600 fill-purple-50 shrink-0" />
                     )}
                   </h3>
                   <p className="text-xs text-gray-500 mt-1 truncate">{store.location}</p>
                   <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                     Visit Store <ChevronRight size={12} />
                   </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
           <Link href="/marketplace" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">
             View Full Marketplace <ArrowRight size={18} />
           </Link>
        </div>

      </div>
    </section>
  );
}