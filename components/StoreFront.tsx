"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Info, Copy, Check, ShoppingBag, 
  X, Instagram, Search, Package, Phone, LayoutDashboard, ChevronRight,
  BadgeCheck, Gem, Share2, Plus
} from "lucide-react";
import { Store } from "@/types";
import { useCart } from "@/context/CartContext";

const TiktokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
);

const VerificationBadge = ({ store }: { store: any }) => {
  return (
    <div className="inline-flex items-center gap-1 ml-1 align-middle">
      {store.verification_status === 'verified' && <BadgeCheck size={16} className="text-blue-500 fill-blue-50" />}
      {store.subscription_plan === 'diamond' && <Gem size={16} className="text-purple-600 fill-purple-50" />}
    </div>
  );
};

interface StoreFrontProps {
  store: Store;
  products: any[];
  categories: { id: string; name: string }[];
}

export default function StoreFront({ store, products, categories }: StoreFrontProps) {
  const { addToCart, cartCount, setIsCartOpen, isCartOpen } = useCart();
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [visibleCount, setVisibleCount] = useState(20);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${store.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, store);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.categories?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col selection:bg-emerald-100">
      
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center justify-between px-4 md:px-8 shadow-sm">
         <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1">
               <LayoutDashboard size={18} className="text-emerald-600"/> 
               <span className="font-black text-gray-900 tracking-tighter hidden md:block uppercase text-[10px]">StoreLink</span>
            </Link>
            <span className="text-gray-200 font-thin text-xl">/</span>
            <div className="flex items-center gap-2">
               <h1 className="font-bold text-gray-900 truncate max-w-[160px] md:max-w-none flex items-center text-sm md:text-base tracking-tight">
                 {store.name} <VerificationBadge store={store} />
               </h1>
            </div>
         </div>
         <button onClick={() => setIsInfoOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600 active:scale-90">
            <Info size={20} />
         </button>
      </nav>

      <div className="relative w-full bg-gray-50 border-b border-gray-100">
         <div className="w-full h-40 md:h-64 relative overflow-hidden bg-gray-200">
            {store.cover_image_url ? (
               <Image src={store.cover_image_url} alt="" fill className="object-cover" priority />
            ) : (
               <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100"><Package size={48} className="opacity-20" /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
         </div>

         <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 md:-mt-14 relative z-10 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
               <div className="flex items-end gap-3 md:gap-5">
                  <div className="w-24 h-24 md:w-36 md:h-36 rounded-3xl border-[4px] border-white shadow-xl bg-white relative overflow-hidden shrink-0">
                     {store.logo_url ? (
                        <Image src={store.logo_url} alt="Logo" fill className="object-cover" />
                     ) : (
                        <div className="flex items-center justify-center h-full text-2xl font-bold bg-gray-900 text-white">{store.name.charAt(0)}</div>
                     )}
                  </div>
                  
                  <div className="hidden md:block mb-4">
                     <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                       {store.name} <VerificationBadge store={store} />
                     </h2>
                     <p className="text-gray-500 text-xs font-bold flex items-center gap-1"><MapPin size={14} className="text-emerald-500"/> {store.location}</p>
                  </div>
               </div>

               <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <button onClick={handleCopyLink} className="flex-1 md:flex-none py-2.5 px-5 bg-white border border-gray-200 shadow-sm rounded-xl text-xs font-black text-gray-700 active:scale-95 transition">
                     {copied ? "COPIED" : "SHARE STORE"}
                  </button>
                  <button onClick={() => setIsInfoOpen(true)} className="flex-1 md:flex-none py-2.5 px-5 bg-gray-900 shadow-lg rounded-xl text-xs font-black text-white active:scale-95 transition uppercase tracking-wider">
                     More Info
                  </button>
               </div>
            </div>

            <div className="mt-3 md:hidden">
               <h2 className="text-xl font-black text-gray-900 flex items-center gap-1 uppercase tracking-tight">
                 {store.name} <VerificationBadge store={store} />
               </h2>
               <p className="text-gray-500 text-xs font-bold mt-0.5">{store.location}</p>
            </div>
         </div>
      </div>

      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
         <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
            <div className="flex flex-col md:flex-row gap-3">
               <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
                  <input 
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm outline-none focus:bg-white transition font-medium"
                    placeholder="Search store..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
               </div>
               
               <div className="flex gap-2 overflow-x-auto no-scrollbar items-center pb-1">
                  <button 
                    onClick={() => setActiveCategory("All")}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition ${activeCategory === "All" ? "bg-black text-white" : "bg-white text-gray-500 border border-gray-200"}`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition ${activeCategory === cat.name ? "bg-black text-white" : "bg-white text-gray-500 border border-gray-200"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="flex-1 bg-white">
         <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
               {displayedProducts.map(product => (
                 <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col relative transition-all duration-300 active:scale-[0.98] md:hover:shadow-xl md:hover:-translate-y-1">
                    <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
                       {product.image_urls?.[0] ? (
                         <Image 
                           src={product.image_urls[0]} 
                           alt={product.name} 
                           fill 
                           className="object-cover" 
                         />
                       ) : (
                         <div className="flex items-center justify-center h-full text-gray-200"><Package size={32}/></div>
                       )}
                       
                       {product.stock_quantity === 0 && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                             <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Sold Out</span>
                          </div>
                       )}
                    </Link>

                    <div className="p-3 md:p-4 flex flex-col flex-1">
                       <h3 className="font-bold text-gray-900 leading-tight line-clamp-1 text-xs md:text-sm mb-1">{product.name}</h3>
                       
                       <div className="flex items-center justify-between mt-auto">
                          <p className="text-sm md:text-base font-black text-emerald-600 tracking-tighter">₦{product.price.toLocaleString()}</p>
                          <button 
                            disabled={product.stock_quantity === 0}
                            onClick={() => handleAddToCart(product)}
                            className="p-2 bg-gray-900 text-white rounded-lg shadow-md active:bg-emerald-600 transition-colors disabled:bg-gray-100 disabled:text-gray-300"
                          >
                             <Plus size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className="mt-12 text-center pb-10">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 20)}
                  className="px-10 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all active:scale-95 shadow-lg"
                >
                  Load More Products
                </button>
              </div>
            )}

            {filteredProducts.length === 0 && (
               <div className="text-center py-20 flex flex-col items-center">
                  <Package size={40} className="text-gray-100 mb-2"/>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No products found</p>
               </div>
            )}
         </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-10 text-center mt-auto">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">StoreLink social engine • 2025</p>
      </footer>

      {cartCount > 0 && !isCartOpen && (
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="fixed bottom-6 right-6 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl z-50 hover:scale-110 active:scale-90 transition-all animate-in zoom-in"
        >
           <ShoppingBag size={24} />
           <span className="absolute -top-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
             {cartCount}
           </span>
        </button>
      )}

      {isInfoOpen && (
         <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
            <div className="absolute inset-0" onClick={() => setIsInfoOpen(false)}></div>
            
            <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col rounded-l-[2rem]">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="font-black text-xl text-gray-900 uppercase tracking-tighter text-sm">About Business</h2>
                  <button onClick={() => setIsInfoOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
               </div>

               <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl mx-auto mb-4 overflow-hidden border-2 border-gray-100 relative">
                      {store.logo_url ? <Image src={store.logo_url} alt="" fill className="object-cover" /> : null}
                  </div>
                  <h3 className="font-black text-2xl text-gray-900 tracking-tighter uppercase flex items-center justify-center gap-1">
                    {store.name} <VerificationBadge store={store} />
                  </h3>
                  <p className="text-gray-400 text-[10px] font-black uppercase mt-1 tracking-widest">{store.location}</p>
               </div>

               <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                  <p className="text-gray-600 text-sm italic text-center font-medium">
                     "{store.description || 'Welcome to our store! We sell amazing products.'}"
                  </p>
               </div>

               <div className="space-y-3 mt-auto">
                   <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-2">Connect</h4>
                   {store.whatsapp_number && (
                       <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                           <div className="bg-emerald-500 p-2 rounded-lg text-white"><Phone size={18}/></div>
                           <div>
                               <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">WhatsApp</p>
                               <p className="text-sm font-bold text-gray-900">{store.whatsapp_number}</p>
                           </div>
                       </div>
                   )}
                   {store.instagram_handle && (
                       <a href={`https://instagram.com/${store.instagram_handle}`} target="_blank" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl font-bold">
                           <span className="flex items-center gap-3 text-xs uppercase tracking-widest"><Instagram size={18} /> Instagram</span>
                           <ChevronRight size={14}/>
                       </a>
                   )}
               </div>
               <p className="text-center text-[9px] font-black text-gray-300 mt-8">Store ID: {store.slug}</p>
            </div>
         </div>
      )}
    </div>
  );
}