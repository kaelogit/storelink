"use client";
import Image from "next/image";
import { ShoppingBag, Plus } from "lucide-react";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, e: any) => void;
}

export default function ProductGrid({ products, onProductClick, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
         <p>No items found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {products.map((product) => (
        <div 
          key={product.id} 
          onClick={() => onProductClick(product)}
          className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition cursor-pointer hover:shadow-md relative group"
        >
          <div className="aspect-square bg-gray-100 rounded-xl mb-3 relative overflow-hidden">
             {product.image_urls && product.image_urls.length > 0 ? (
               <Image src={product.image_urls[0]} alt={product.name} fill className="object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ShoppingBag className="opacity-20" />
               </div>
             )}
             
             <button 
               onClick={(e) => onAddToCart(product, e)}
               className="absolute bottom-2 right-2 bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-emerald-50 active:scale-90 transition z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
             >
               <Plus size={16} strokeWidth={3} />
             </button>
          </div>
          <div className="px-1 mb-2">
             <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
             <div className="flex justify-between items-center mt-1">
                <p className="text-emerald-700 font-bold text-sm">₦{product.price.toLocaleString()}</p>
                {product.stock_quantity < 1 && <span className="text-[10px] text-red-500 font-bold">Sold Out</span>}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}