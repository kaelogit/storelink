"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { Search, Package, ChevronRight, Plus, ArrowRight, BadgeCheck, Gem, Zap } from "lucide-react";
import { Product, Store } from "@/types";
import { effectiveSellerTier } from "@/utils/marketplaceDiscovery";
import { compactSellerRegion } from "@/lib/displayRegion";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";

interface MarketplaceProps {
  products: Product[];
  stores: Store[];
  onAddToCart: (product: Product) => void;
}

export default function Marketplace({ products, stores, onAddToCart }: MarketplaceProps) {
  const [view, setView] = useState<'products' | 'vendors'>('products');
  const [search, setSearch] = useState("");

  const getProductStoreBySeller = (sellerId: string) => {
    return stores.find((s) => s.owner_id === sellerId);
  };

  
  const searchMatchedProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const searchMatchedStores = stores.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const tierOfStore = (s?: Store | null) =>
    effectiveSellerTier(s?.subscription_plan, s?.subscription_expiry, s?.subscription_status);

  const diamondPoolP = searchMatchedProducts.filter((p) => tierOfStore(getProductStoreBySeller(p.seller_id)) === "diamond");

  const standardPoolP = searchMatchedProducts.filter((p) => tierOfStore(getProductStoreBySeller(p.seller_id)) === "standard");

  const finalDiamondsP = diamondPoolP.slice(0, 15);
  const standardSlots = Math.max(0, 20 - finalDiamondsP.length);
  const finalStandardsP = standardPoolP.slice(0, standardSlots);
  const filteredProducts = [...finalDiamondsP, ...finalStandardsP];

  const diamondPoolS = searchMatchedStores.filter((s) => tierOfStore(s) === "diamond");
  const standardPoolS = searchMatchedStores.filter((s) => tierOfStore(s) === "standard");

  const finalDiamondsS = diamondPoolS.slice(0, 15);
  const standardSlotsStores = Math.max(0, 20 - finalDiamondsS.length);
  const finalStandardsS = standardPoolS.slice(0, standardSlotsStores);
  const filteredStores = [...finalDiamondsS, ...finalStandardsS];

  return (
    <section id="marketplace" className={`min-h-dvh border-t border-gray-100 bg-gray-50 py-16 ${STOREFRONT_GUTTER_X}`}>
      <div className="mx-auto mb-4 max-w-6xl">
        
        <div className="text-center mb-10" id="trending">
           <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tighter italic">Trending Now</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <button onClick={() => setView('products')} className={`min-h-[44px] rounded-lg px-6 py-2 text-sm font-black uppercase tracking-widest transition ${view === 'products' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900'}`}>Items</button>
            <button onClick={() => setView('vendors')} className={`min-h-[44px] rounded-lg px-6 py-2 text-sm font-black uppercase tracking-widest transition ${view === 'vendors' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-900'}`}>Stores</button>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />
            <input 
              placeholder={`Search ${view}...`} 
              className="min-h-[48px] w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-base font-bold shadow-sm outline-none focus:ring-2 focus:ring-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {view === 'products' ? (
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[50%] gap-3 overflow-x-auto snap-x snap-mandatory pb-4 md:grid-cols-4 lg:grid-cols-5 md:grid-rows-none md:grid-flow-row md:auto-cols-auto md:overflow-visible md:pb-0 md:gap-4">
            {filteredProducts.map(product => {
              const isFlash = product.flash_drop_expiry && new Date(product.flash_drop_expiry) > new Date();
              const store = getProductStoreBySeller(product.seller_id);
              const regionLabel = store ? compactSellerRegion(store) : "";
              const isDiamond = tierOfStore(store) === "diamond";
              
              const activePrice = isFlash ? (product.flash_drop_price || product.price) : product.price;

              const rewardCoins = store?.loyalty_enabled 
                ? Math.floor(activePrice * ((store?.loyalty_percentage || 0) / 100)) 
                : 0;

              return (
                <Link 
                  href={`/product/${product.id}`}
                  key={product.id} 
                  className={`snap-start bg-white p-2.5 rounded-2xl border transition-all duration-500 flex flex-col relative h-full group ${
                    isDiamond 
                    ? 'border-purple-200 shadow-[0_10px_30px_rgba(147,51,234,0.08)] ring-1 ring-purple-50' 
                    : 'border-gray-100 shadow-sm'
                  } hover:shadow-2xl hover:-translate-y-2`}
                >
                  <div className="aspect-square bg-gray-50 rounded-xl mb-3 relative overflow-hidden">
                    {product.image_urls?.[0] ? (
                      <Image src={product.image_urls[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <Package size={26} />
                      </div>
                    )}
                    
                    {isFlash ? (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] px-2 py-1 rounded-lg font-black shadow-lg flex items-center gap-1 z-20 animate-pulse">
                         <Zap size={10} fill="currentColor" /> LIVE DROP
                      </div>
                    ) : isDiamond && (
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-md flex items-center gap-1 z-20 uppercase">
                         <Gem size={10} className="fill-white"/> TOP
                      </span>
                    )}

                    {rewardCoins > 0 && (
                      <div className="absolute top-2 right-2 bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] px-2 py-1 rounded-lg font-black shadow-lg flex items-center gap-1 z-20 animate-in zoom-in">
                        <Zap size={10} fill="white" /> +₦{rewardCoins.toLocaleString()}
                      </div>
                    )}

                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }} 
                      className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all z-10 active:scale-75 ${isFlash ? 'bg-amber-500 text-white' : 'bg-white hover:bg-gray-900 hover:text-white'}`}
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>

                  <div className="px-1 flex flex-col flex-1">
                    <h3 className="font-black text-gray-900 text-xs md:text-sm truncate uppercase tracking-tight mb-0.5">{product.name}</h3>
                    
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1 truncate font-bold">
                        <span className="truncate">{store?.name}</span>
                        {store?.verification_status === 'verified' && <BadgeCheck size={12} className="text-blue-500 fill-blue-50" />}
                    </div>
                    {regionLabel ? (
                      <p className="text-[9px] font-bold text-gray-400 mb-2 truncate uppercase tracking-wider">{regionLabel}</p>
                    ) : null}

                    <div className="mt-auto flex items-center justify-between">
                      {isFlash ? (
                        <div>
                           <p className="text-[9px] font-bold text-gray-300 line-through">₦{product.price.toLocaleString()}</p>
                           <p className="text-emerald-700 font-black text-sm md:text-base tracking-tighter">
                             ₦{(product.flash_drop_price || 0).toLocaleString()}
                           </p>                        </div>
                      ) : (
                        <p className="text-emerald-700 font-black text-sm md:text-base">₦{product.price.toLocaleString()}</p>
                      )}
                      
                      {rewardCoins > 0 && (
                        <span className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest italic animate-pulse">Earn Coin</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[75%] gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:grid-cols-3 md:grid-rows-none md:grid-flow-row md:auto-cols-auto md:overflow-visible md:pb-0">
            {filteredStores.map(store => (
              <Link 
                href={`/${store.slug}`} 
                key={store.id} 
                className="snap-start bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4 h-full group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full overflow-hidden relative border border-gray-100 shrink-0 shadow-inner">
                  {store.logo_url ? (
                    <Image src={store.logo_url} alt={store.name} fill className="object-cover group-hover:scale-110 transition duration-500" unoptimized />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300 font-black">
                      {store.name?.charAt(0) || "S"}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                   <h3 className="font-black text-gray-900 flex items-center gap-1 text-sm truncate uppercase tracking-tighter">
                     <span className="truncate">{store.name}</span>
                     {store.verification_status === 'verified' && (
                       <BadgeCheck size={14} className="text-blue-500 fill-blue-50 shrink-0" />
                     )}
                     {tierOfStore(store) === "diamond" && (
                       <Gem size={14} className="text-purple-600 fill-purple-50 shrink-0" />
                     )}
                   </h3>
                   <p className="text-[9px] font-black text-gray-400 mt-1 truncate uppercase tracking-[0.1em]">
                     {compactSellerRegion(store) || "Online Exclusive"}
                   </p>
                   <div className="text-[9px] text-emerald-600 font-black mt-2 flex items-center gap-1 uppercase tracking-widest">
                     Enter Shop <ChevronRight size={12} />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
           <Link href="/marketplace" className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-2xl active:scale-95">
             Explore Marketplace <ArrowRight size={18} />
           </Link>
        </div>

      </div>
    </section>
  );
}