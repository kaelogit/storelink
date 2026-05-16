"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { Search, Package, ChevronRight, Plus, ArrowRight, BadgeCheck, Gem, Zap, TrendingUp, Store } from "lucide-react";
import { Product, Store as StoreType } from "@/types";
import { effectiveSellerTier } from "@/utils/marketplaceDiscovery";
import { compactSellerRegion } from "@/lib/displayRegion";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import { isProductFlashDropActive, productDisplayPrice, productFlashPriceNumber } from "@/lib/productFlashDrop";
import SectionHeader from "./SectionHeader";

interface MarketplaceProps {
  products: Product[];
  stores: StoreType[];
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

  const tierOfStore = (s?: StoreType | null) =>
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
    <section id="marketplace" className={`relative overflow-hidden bg-gray-50 py-24 md:py-32 ${STOREFRONT_GUTTER_X}`}>
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-100/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        
        <SectionHeader
          eyebrow="Marketplace"
          headline={
            <>
              Trending{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                now
              </span>
            </>
          }
          description="Discover top sellers and products from across the network."
          align="center"
          
        />

        {/* Controls bar */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          {/* Segmented tabs */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
            <button 
              onClick={() => setView('products')} 
              className={`relative min-h-[48px] rounded-xl px-7 py-2.5 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${view === 'products' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <Package className="w-4 h-4" />
              Items
            </button>
            <button 
              onClick={() => setView('vendors')} 
              className={`relative min-h-[48px] rounded-xl px-7 py-2.5 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${view === 'vendors' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <Store className="w-4 h-4" />
              Stores
            </button>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              placeholder={`Search ${view}...`} 
              className="min-h-[48px] w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {view === 'products' ? (
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[50%] gap-3 overflow-x-auto snap-x snap-mandatory pb-4 md:grid-cols-4 lg:grid-cols-5 md:grid-rows-none md:grid-flow-row md:auto-cols-auto md:overflow-visible md:pb-0 md:gap-4">
            {filteredProducts.map(product => {
              const isFlash = isProductFlashDropActive(product);
              const store = getProductStoreBySeller(product.seller_id);
              const regionLabel = store ? compactSellerRegion(store) : "";
              const isDiamond = tierOfStore(store) === "diamond";
              
              const activePrice = productDisplayPrice({ ...product, price: Number(product.price) });

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
                  {/* PRODUCT CARD — UNCHANGED */}
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
                         <Zap size={10} fill="currentColor" /> FLASH SALES
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
                             ₦{(productFlashPriceNumber(product) ?? product.price).toLocaleString()}
                           </p>
                        </div>
                      ) : (
                        <p className="text-emerald-700 font-black text-sm md:text-base">₦{product.price.toLocaleString()}</p>
                      )}
                      
                      {rewardCoins > 0 && (
                        <span className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest italic animate-pulse">Earn Coin</span>
                      )}
                    </div>
                  </div>
                  {/* END PRODUCT CARD */}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map(store => (
              <Link 
                href={`https://${store.slug}.storelink.ng`} 
                key={store.id} 
                className="group relative rounded-3xl border border-gray-200 bg-white p-6 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-gray-100 shrink-0 bg-gray-50">
                    {store.logo_url ? (
                      <Image src={store.logo_url} alt={store.name} fill className="object-cover group-hover:scale-110 transition duration-500" unoptimized />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-black text-xl">
                        {store.name?.charAt(0) || "S"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-base truncate flex items-center gap-1.5">
                      <span className="truncate">{store.name}</span>
                      {store.verification_status === 'verified' && (
                        <BadgeCheck size={16} className="text-blue-500 fill-blue-50 shrink-0" />
                      )}
                      {tierOfStore(store) === "diamond" && (
                        <Gem size={16} className="text-purple-600 fill-purple-100 shrink-0" />
                      )}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                      {compactSellerRegion(store) || "Online Exclusive"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between group-hover:border-emerald-100 transition-colors">
                  <span className="text-xs font-semibold text-gray-400 group-hover:text-emerald-600 transition-colors">
                    {tierOfStore(store) === "diamond" ? "Diamond Seller" : "Standard Seller"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Visit <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link 
            href="/marketplace" 
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-gray-900/10 hover:shadow-emerald-500/20"
          >
            Explore Marketplace 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}