"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Info, Copy, Check, ShoppingBag, 
  X, Instagram, Search, Package, Phone, LayoutDashboard, ChevronRight,
  BadgeCheck, Gem // <--- Added these two icons
} from "lucide-react";
import { Store } from "@/types";
import { useCart } from "@/context/CartContext";

// --- CUSTOM ICONS ---
const TiktokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
);

// --- HELPER: BADGE COMPONENT (The only new addition) ---
const VerificationBadge = ({ plan }: { plan?: string }) => {
  if (plan === 'diamond') {
    return (
      <span className="inline-flex items-center justify-center ml-1.5 align-middle" title="Diamond Vendor">
        <Gem size={18} className="text-purple-600 fill-purple-50" />
      </span>
    );
  }
  if (plan === 'premium') {
    return (
      <span className="inline-flex items-center justify-center ml-1.5 align-middle" title="Verified Premium">
        <BadgeCheck size={18} className="text-blue-600 fill-blue-50" />
      </span>
    );
  }
  return null;
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

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* --- 1. SOFT STICKY HEADER --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center justify-between px-4 md:px-8 shadow-sm">
         <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1 group">
               <LayoutDashboard size={20} className="text-emerald-600"/> 
               <span className="font-extrabold text-gray-900 tracking-tight hidden md:block">StoreLink</span>
            </Link>
            <span className="text-gray-300 font-light text-xl">/</span>
            <div className="flex items-center gap-2">
               <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                  {store.logo_url ? <Image src={store.logo_url} alt="" fill className="object-cover"/> : <div className="w-full h-full bg-gray-900"/>}
               </div>
               <h1 className="font-bold text-gray-900 truncate max-w-[150px] md:max-w-none flex items-center">
                 {store.name}
                 <VerificationBadge plan={store.subscription_plan} />
               </h1>
            </div>
         </div>

         <div className="flex items-center gap-2">
            <button onClick={() => setIsInfoOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
               <Info size={20} />
            </button>
         </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <div className="relative w-full bg-gray-50 border-b border-gray-100">
         <div className="w-full h-48 md:h-64 relative overflow-hidden bg-gray-200">
            {store.cover_image_url ? (
               <Image src={store.cover_image_url} alt="Cover" fill className="object-cover" priority />
            ) : (
               <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100">
                  <Image size={48} opacity={0.2} />
               </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
         </div>

         <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 md:-mt-12 relative z-10 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
               
               <div className="flex items-end gap-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-lg bg-white relative overflow-hidden shrink-0">
                     {store.logo_url ? (
                        <Image src={store.logo_url} alt="Logo" fill className="object-cover" />
                     ) : (
                        <div className="flex items-center justify-center h-full text-2xl font-bold bg-gray-900 text-white">{store.name.charAt(0)}</div>
                     )}
                  </div>
                  
                  <div className="hidden md:block mb-2">
                     <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                       {store.name}
                       <VerificationBadge plan={store.subscription_plan} />
                     </h2>
                     <p className="text-gray-500 flex items-center gap-1 text-sm mt-1"><MapPin size={14}/> {store.location}</p>
                  </div>
               </div>

               <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <button onClick={handleCopyLink} className="flex-1 md:flex-none py-2.5 px-4 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition">
                     {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16}/>}
                     {copied ? "Copied" : "Share Store"}
                  </button>
                  <button onClick={() => setIsInfoOpen(true)} className="flex-1 md:flex-none py-2.5 px-4 bg-gray-900 shadow-lg rounded-xl text-sm font-bold text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition">
                     More Info <ChevronRight size={16} />
                  </button>
               </div>
            </div>

            {/* Mobile Bio */}
            <div className="mt-4 md:hidden">
               <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                 {store.name}
                 <VerificationBadge plan={store.subscription_plan} />
               </h2>
               <p className="text-gray-500 text-sm mt-1">{store.description || "Welcome to our digital storefront."}</p>
               <div className="flex items-center gap-4 mt-3 text-xs font-medium text-gray-400">
                  <span className="flex items-center gap-1"><MapPin size={12}/> {store.location}</span>
                  <span>•</span>
                  <span>{products.length} Products</span>
               </div>
            </div>
         </div>
      </div>

      {/* --- 3. STICKY CATEGORY BAR --- */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
         <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide items-center">
               <div className="relative min-w-[200px] mr-2">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input 
                    className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
               </div>
               
               <button 
                 onClick={() => setActiveCategory("All")}
                 className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${activeCategory === "All" ? "bg-black text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
               >
                 All
               </button>
               {categories.map(cat => (
                 <button 
                   key={cat.id}
                   onClick={() => setActiveCategory(cat.name)}
                   className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${activeCategory === cat.name ? "bg-black text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                 >
                   {cat.name}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* --- 4. PRODUCT GRID --- */}
      <div className="flex-1 bg-gray-50/50">
         <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {filteredProducts.length === 0 ? (
               <div className="text-center py-20 flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Package size={32} className="text-gray-300"/></div>
                  <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                  <p className="text-gray-500 text-sm">Try searching for something else.</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                       {/* Image Area */}
                       <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-100 overflow-hidden">
                          {product.image_urls?.[0] ? (
                            <Image 
                              src={product.image_urls[0]} 
                              alt={product.name} 
                              fill 
                              className="object-cover group-hover:scale-105 transition duration-500" 
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-300"><Image size={32}/></div>
                          )}
                          {product.stock_quantity === 0 && (
                             <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">SOLD OUT</div>
                          )}
                       </Link>

                       {/* Content Area */}
                       <div className="p-4 flex flex-col flex-1">
                          <div className="mb-2">
                             <p className="text-xs text-gray-400 font-medium mb-1">{product.categories?.name}</p>
                             <h3 className="font-bold text-gray-900 leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                          </div>
                          
                          <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
                             <p className="text-lg font-extrabold text-gray-900">₦{product.price.toLocaleString()}</p>
                             <button 
                               onClick={() => handleAddToCart(product)}
                               className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition shadow-sm"
                             >
                               <ShoppingBag size={18} />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            )}
         </div>
      </div>

      {/* --- 5. SOFT FOOTER --- */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center mt-auto">
         <p className="text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
            Powered by <span className="font-extrabold text-gray-900 flex items-center gap-1"><LayoutDashboard size={14} className="text-emerald-600"/> StoreLink</span>
         </p>
      </footer>

      {/* --- 6. FLOATING CART --- */}
      {cartCount > 0 && !isCartOpen && (
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="fixed bottom-8 right-6 bg-gray-900 text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition animate-in zoom-in"
        >
           <ShoppingBag size={24} />
           <span className="absolute -top-1 -right-1 bg-red-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
             {cartCount}
           </span>
        </button>
      )}

      {/* --- 7. INFO DRAWER --- */}
      {isInfoOpen && (
         <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
            <div className="absolute inset-0" onClick={() => setIsInfoOpen(false)}></div>
            
            <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="font-bold text-xl text-gray-900">About Store</h2>
                  <button onClick={() => setIsInfoOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
               </div>

               {/* Branding in Drawer */}
               <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl mx-auto mb-4 overflow-hidden border-2 border-gray-100 relative">
                      {store.logo_url ? <Image src={store.logo_url} alt="" fill className="object-cover" /> : null}
                  </div>
                  <h3 className="font-extrabold text-2xl text-gray-900 flex items-center justify-center gap-2">
                    {store.name}
                    <VerificationBadge plan={store.subscription_plan} />
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">{store.location}</p>
               </div>

               {/* Bio */}
               <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-100">
                  <p className="text-gray-700 text-sm leading-relaxed italic text-center">
                     "{store.description || 'Welcome to our store! We sell amazing products.'}"
                  </p>
               </div>

               {/* Links */}
               <div className="space-y-3 mt-auto">
                   <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-2">Connect</h4>
                   
                   {store.whatsapp_number && (
                       <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                           <div className="bg-green-100 p-2 rounded-lg text-green-600"><Phone size={18}/></div>
                           <div>
                               <p className="text-xs text-gray-400 font-bold uppercase">WhatsApp</p>
                               <p className="text-sm font-bold text-gray-900">{store.whatsapp_number}</p>
                           </div>
                       </div>
                   )}

                   {store.instagram_handle && (
                       <a href={`https://instagram.com/${store.instagram_handle}`} target="_blank" className="flex items-center justify-between p-4 bg-pink-50 text-pink-700 rounded-xl font-bold hover:bg-pink-100 transition">
                           <span className="flex items-center gap-3"><Instagram size={20} /> Instagram</span>
                           <ChevronRight size={16}/>
                       </a>
                   )}
                   {store.tiktok_url && (
                       <a href={store.tiktok_url} target="_blank" className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">
                           <span className="flex items-center gap-3"><TiktokIcon size={20} /> TikTok</span>
                           <ChevronRight size={16}/>
                       </a>
                   )}
               </div>

               <p className="text-center text-xs text-gray-300 mt-8">Store ID: {store.slug}</p>
            </div>
         </div>
      )}

    </div>
  );
}