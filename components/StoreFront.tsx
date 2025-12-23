"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Info, ShoppingBag, 
  X, Instagram, Search, Package, Phone, LayoutDashboard, ChevronRight,
  BadgeCheck, Gem, Plus, Zap, Loader2
} from "lucide-react";
import { Store } from "@/types";
import { useCart } from "@/context/CartContext";

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

export default function StoreFront({ store, products: initialProducts, categories }: StoreFrontProps) {
  const { addToCart, cartCount, setIsCartOpen, isCartOpen } = useCart();
  
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [copied, setCopied] = useState(false); 
  const [visibleCount, setVisibleCount] = useState(20);
  const [isJumping, setIsJumping] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  
  const handleCopyLink = () => {
    if (!store?.slug) return;
    navigator.clipboard.writeText(`${window.location.origin}/${store.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchStoreProducts = async () => {
      if (activeCategory === "All" && !debouncedSearch) {
        setProducts(initialProducts);
        return;
      }

      setLoading(true);

      let query = supabase
        .from("storefront_products")
        .select(`
          *,
          categories!inner (
            name
          )
        `)
        .eq("store_id", store.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (activeCategory !== "All") {
        query = query.eq("categories.name", activeCategory);
      }

      if (debouncedSearch) {
        query = query.ilike("name", `%${debouncedSearch}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Filter Error:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      
      setLoading(false);
    };

    fetchStoreProducts();
  }, [activeCategory, debouncedSearch, store.id, initialProducts]);

  const handleAddToCart = (product: any) => {
    const isFlashActive = product.flash_drop_expiry && new Date(product.flash_drop_expiry) > new Date();
    if (isFlashActive) {
      const audio = new Audio('/sounds/empire-drop.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 600);
    addToCart(product, store);
  };

  const displayedProducts = products.slice(0, visibleCount);

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
          </div>
      </div>

      <div className={`sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0 pointer-events-none md:translate-y-0 md:opacity-100"
      }`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
             <div className="flex flex-col md:flex-row gap-3">
                <div className="relative w-full md:max-w-xs">
                   <Search className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
                   <input className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm outline-none focus:bg-white transition font-medium" placeholder="Search store..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar items-center pb-1">
                   <button onClick={() => setActiveCategory("All")} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${activeCategory === "All" ? "bg-black text-white" : "bg-white text-gray-500 border border-gray-200"}`}>All</button>
                   {categories.map(cat => (
                     <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${activeCategory === cat.name ? "bg-black text-white" : "bg-white text-gray-500 border border-gray-200"}`}>{cat.name}</button>
                   ))}
                </div>
             </div>
          </div>
      </div>

      <div className="flex-1 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
             {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>
             ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {displayedProducts.map(product => {
                  const isFlash = product.flash_drop_expiry && new Date(product.flash_drop_expiry) > new Date();
                  const isDiamond = store.subscription_plan === 'diamond';
                  const activePrice = isFlash ? (product.flash_drop_price || product.price) : product.price;
                  
                  const rewardCoins = store.loyalty_enabled 
                    ? Math.floor(activePrice * ((store.loyalty_percentage || 0) / 100)) 
                    : 0;

                  return (
                    <div 
                      key={product.id} 
                      className={`group bg-white p-2.5 rounded-2xl border transition-all duration-500 flex flex-col relative h-full active:scale-[0.98] ${
                        isDiamond 
                        ? 'border-purple-200 shadow-[0_10px_30px_rgba(147,51,234,0.08)] ring-1 ring-purple-50' 
                        : 'border-gray-100 shadow-sm'
                      } md:hover:shadow-2xl md:hover:-translate-y-1`}
                    >
                       <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                          {product.image_urls?.[0] ? (
                            <Image src={product.image_urls[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-200"><Package size={32}/></div>
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
                            <div className="absolute top-2 right-2 bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] px-2 py-1 rounded-lg font-black shadow-lg flex items-center gap-1 z-20">
                              <Zap size={10} fill="white" /> +₦{rewardCoins.toLocaleString()}
                            </div>
                          )}
                          
                          {product.stock_quantity === 0 && (
                             <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-30">
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Sold Out</span>
                             </div>
                          )}

                          <button 
                            disabled={product.stock_quantity === 0}
                            onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                            className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all z-40 active:scale-75 ${
                              isFlash ? 'bg-amber-500 text-white' : 'bg-white hover:bg-gray-900 hover:text-white'
                            } disabled:bg-gray-100 disabled:text-gray-300`}
                          >
                             <Plus size={16} strokeWidth={3} />
                          </button>
                       </Link>

                       <div className="px-1 flex flex-col flex-1">
                          <h3 className="font-black text-gray-900 text-xs md:text-sm truncate uppercase tracking-tight mb-0.5">{product.name}</h3>
                          
                          <div className="mt-auto flex items-center justify-between pt-2">
                             {isFlash ? (
                              <div className="flex flex-col">
                                 <p className="text-[9px] font-bold text-gray-300 line-through">₦{product.price.toLocaleString()}</p>
                                 <p className="text-emerald-700 font-black text-sm md:text-base tracking-tighter">₦{product.flash_drop_price.toLocaleString()}</p>
                              </div>
                              ) : (
                                <p className="text-emerald-700 font-black text-sm md:text-base tracking-tighter">₦{product.price.toLocaleString()}</p>
                              )}
                             
                             {rewardCoins > 0 && (
                                <span className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest italic animate-pulse">Earn Gold</span>
                             )}
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
             )}

             {visibleCount < products.length && (
               <div className="mt-12 text-center pb-10">
                 <button onClick={() => setVisibleCount(prev => prev + 20)} className="px-10 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all active:scale-95 shadow-lg">Load More Products</button>
               </div>
             )}

             {!loading && products.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center">
                   <Package size={40} className="text-gray-100 mb-2"/><p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No products found</p>
                </div>
             )}
          </div>
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-10 text-center mt-auto">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">StoreLink social engine • 2025</p>
      </footer>

      {cartCount > 0 && !isCartOpen && (
        <button onClick={() => setIsCartOpen(true)} className={`fixed bottom-6 right-6 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl z-50 transition-all active:scale-90 ${isJumping ? 'animate-bounce' : 'hover:scale-110 animate-in zoom-in'}`}>
           <ShoppingBag size={24} />
           <span className="absolute -top-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">{cartCount}</span>
        </button>
      )}

      {isInfoOpen && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
             <div className="absolute inset-0" onClick={() => setIsInfoOpen(false)}></div>
             <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col rounded-l-[2rem]">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="font-black text-gray-900 uppercase tracking-tighter text-sm">About Business</h2>
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