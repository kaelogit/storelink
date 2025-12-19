"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ShoppingBag, Store, ChevronRight, Zap, ShieldCheck, Package } from "lucide-react";
import { Product } from "@/types";
import FlashTimer from "@/components/shared/FlashTimer"; // Imported

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveImageIndex(index);
  };

  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  
  const p = product as any;
  const isFlashActive = p.flash_drop_expiry && new Date(p.flash_drop_expiry) > new Date();
  
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white w-full h-[92vh] md:h-[85vh] md:max-w-5xl md:rounded-[3rem] rounded-t-[3rem] shadow-2xl flex flex-col md:flex-row relative overflow-hidden animate-in slide-in-from-bottom-20 duration-500">
         
         <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-xl border border-white/20 active:scale-90 transition-all">
           <X size={24} />
         </button>

         <div className="w-full md:w-[50%] h-[40vh] md:h-full bg-gray-50 relative shrink-0">
           <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar" onScroll={handleScroll}>
             {product.image_urls && product.image_urls.length > 0 ? (
               product.image_urls.map((url, idx) => (
                 <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                   <Image src={url} alt="" fill className="object-cover" />
                 </div>
               ))
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-200"><Package size={80}/></div>
             )}
           </div>

           {product.image_urls && product.image_urls.length > 1 && (
             <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20">
               {product.image_urls.map((_, i) => (
                 <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'bg-white w-8 shadow-lg' : 'bg-white/40 w-1.5'}`} />
               ))}
             </div>
           )}

           {isFlashActive ? (
              <div className="absolute top-6 left-6 bg-amber-500 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl animate-bounce flex items-center gap-2 border-2 border-white/20">
                 <Zap size={14} fill="currentColor" /> LIVE DROP
              </div>
           ) : isLowStock && (
              <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl animate-pulse flex items-center gap-2">
                 <Zap size={12} fill="currentColor" /> {product.stock_quantity} LEFT
              </div>
           )}
         </div>

         <div className="flex-1 flex flex-col h-full bg-white relative">
            <div className="flex-1 overflow-y-auto p-8 pb-32">
                
                {isFlashActive && (
                  <div className="mb-6">
                    <FlashTimer expiry={product.flash_drop_expiry!} />
                  </div>
                )}

                {product.stores && (
                  <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Store size={12} />
                    <span>{product.stores.name}</span>
                    <ChevronRight size={10} />
                  </div>
                )}

                <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.1] tracking-tighter mb-4 uppercase">{product.name}</h2>
                
                <div className="flex items-center gap-4 mb-8">
                  {isFlashActive ? (
                    <div className="flex items-center gap-4">
                      <p className="text-3xl font-black text-emerald-600 tracking-tighter">₦{product.flash_drop_price?.toLocaleString()}</p>
                      <p className="text-lg font-bold text-gray-300 line-through tracking-tighter">₦{product.price.toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-3xl font-black text-emerald-600 tracking-tighter">₦{product.price.toLocaleString()}</p>
                  )}
                  
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${product.stock_quantity > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} IN STOCK` : 'SOLD OUT'}
                  </span>
                </div>

                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 relative mb-8">
                   <div className="absolute -top-3 left-6 bg-white px-3 text-[9px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 rounded-lg">Description</div>
                   <p className="text-gray-600 text-sm leading-relaxed font-medium">{product.description || "No description provided."}</p>
                </div>

                <div className="flex items-center gap-6 opacity-40">
                   <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-widest"><ShieldCheck size={16}/> Secure</div>
                   <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-widest"><Package size={16}/> Verified</div>
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 backdrop-blur-md z-20">
                <button 
                  onClick={() => { onAddToCart(product); onClose(); }} 
                  disabled={product.stock_quantity < 1}
                  className={`w-full h-16 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400 ${
                    isFlashActive ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-gray-900 text-white hover:bg-emerald-600'
                  }`}
                >
                  {product.stock_quantity > 0 ? (
                    <>
                      <ShoppingBag size={20} />
                      <span>{isFlashActive ? 'Secure This Drop' : 'Add to My Cart'}</span>
                    </>
                  ) : "Currently Sold Out"}
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}