"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ShoppingBag, Store, ChevronRight, Minus, Plus } from "lucide-react";
import { Product } from "@/types";

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

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 z-50 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition backdrop-blur-md"
      >
        <X size={24} />
      </button>

      <div className="bg-white w-full h-[90vh] md:h-[85vh] md:max-w-5xl md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col md:flex-row relative overflow-hidden animate-in slide-in-from-bottom-10">
         
         <div className="w-full md:w-[55%] h-[45vh] md:h-full bg-gray-100 relative shrink-0">
           
           <div 
             className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
             onScroll={handleScroll}
           >
             {product.image_urls && product.image_urls.length > 0 ? (
               product.image_urls.map((url, idx) => (
                 <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                   <Image src={url} alt="" fill className="object-cover" />
                 </div>
               ))
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={64}/></div>
             )}
           </div>

           {product.image_urls && product.image_urls.length > 1 && (
             <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
               {product.image_urls.map((_, i) => (
                 <div key={i} className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${i === activeImageIndex ? 'bg-white w-6' : 'bg-white/60 w-1.5'}`} />
               ))}
             </div>
           )}

           {product.stores?.subscription_plan === 'premium' && (
             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
               Premium Store
             </div>
           )}
         </div>

         <div className="flex-1 flex flex-col h-full bg-white relative">
            
            <div className="flex-1 overflow-y-auto p-6 pb-24">
               
               {product.stores && (
                 <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2 hover:text-gray-900 transition w-fit cursor-pointer">
                   <Store size={14} />
                   <span>{product.stores.name}</span>
                   <ChevronRight size={14} />
                 </div>
               )}

               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h2>
               
               <div className="flex items-center gap-3 mb-6">
                 <p className="text-3xl font-extrabold text-emerald-600">₦{product.price.toLocaleString()}</p>
                 <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                   {product.stock_quantity > 0 ? 'In Stock' : 'Sold Out'}
                 </div>
               </div>

               <div className="h-px bg-gray-100 w-full mb-6"></div>

               <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-3">Product Description</h3>
               <div className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                 {product.description || "No description provided by the vendor."}
               </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-white border-t border-gray-100 flex items-center gap-4 z-20">
               <button 
                 onClick={() => { onAddToCart(product); onClose(); }} 
                 disabled={product.stock_quantity < 1}
                 className="flex-1 bg-gray-900 text-white h-14 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-800 active:scale-95 transition flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
               >
                 {product.stock_quantity > 0 ? (
                   <>
                     <ShoppingBag size={22} />
                     <span>Add to Cart</span>
                   </>
                 ) : (
                   "Sold Out"
                 )}
               </button>
            </div>

         </div>
      </div>
    </div>
  );
}