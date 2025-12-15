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

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 8); 

  const filteredStores = stores
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6);

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <Link 
                href={`/product/${product.id}`}
                key={product.id} 
                className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group cursor-pointer block"
              >
                <div className="aspect-square bg-gray-100 rounded-xl mb-3 relative overflow-hidden">
                  {product.image_urls?.[0] ? (
                    <Image src={product.image_urls[0]} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Package /></div>
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
                     {product.stores?.subscription_plan === 'diamond' && <Gem size={10} className="text-purple-600" />}
                     {product.stores?.subscription_plan === 'premium' && <BadgeCheck size={10} className="text-blue-600" />}
                  </div>

                  <p className="text-emerald-600 font-bold text-sm">₦{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredStores.map(store => (
              <a href={`/${store.slug}`} key={store.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden relative border border-gray-100">
                  {store.logo_url ? <Image src={store.logo_url} alt="" fill className="object-cover" /> : null}
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 flex items-center gap-1">
                     {store.name} 
                     {/* --- NEW: Vendor Badges --- */}
                     {store.subscription_plan === 'diamond' && <Gem size={14} className="text-purple-600 fill-purple-50" />}
                     {store.subscription_plan === 'premium' && <BadgeCheck size={14} className="text-blue-600 fill-blue-50" />}
                   </h3>
                   <p className="text-xs text-gray-500 mt-1">{store.location}</p>
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