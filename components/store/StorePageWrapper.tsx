"use client";

import { useState } from "react";
import { ShoppingBag, X, MessageCircle, CheckCircle, Search, ImageIcon } from "lucide-react";
import { Product, Store } from "@/types";
import Image from "next/image";
import Link from "next/link";
import StoreHeader from "./StoreHeader";

interface StorePageWrapperProps {
  store: Store;
  products: any[]; 
}

type CartItem = { product: any; qty: number }; 

export default function StorePageWrapper({ store, products }: StorePageWrapperProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const showNotification = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
    showNotification(`Added ${product.name} to bag`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.categories?.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  let cleanNumber = store.whatsapp_number.replace(/\D/g, '');
  if (cleanNumber.startsWith('0')) cleanNumber = '234' + cleanNumber.substring(1);
  
  const itemLines = cart.map(i => `- ${i.qty}x ${i.product.name} (₦${(i.product.price * i.qty).toLocaleString()})`).join('\n');
  const msg = `Hello ${store.name}, I want to place an order via your StoreLink:\n\n${itemLines}\n\n*Total: ₦${cartTotal.toLocaleString()}*\n\nKindly provide me with your Account Details to complete payment and let me know the expected delivery day.`;
  const whatsappLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      <StoreHeader store={store} onOpenInfo={() => {}} />

      <div className="max-w-6xl mx-auto p-4 md:p-8">
         
         <div className="mb-8 relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              placeholder={`Search products or categories in ${store.name}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
         </div>

         {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
               <p>No products found matching your search term.</p>
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
               {filteredProducts.map(product => (
                 <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition group">
                    <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-100">
                       {product.image_urls?.[0] ? (
                         <Image src={product.image_urls[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition duration-500" />
                       ) : (
                         <div className="flex items-center justify-center h-full text-gray-300"><ShoppingBag /></div>
                       )}
                    </Link>
                    <div className="p-4">
                       <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                       <p className="text-emerald-600 font-bold text-sm mt-1">₦{product.price.toLocaleString()}</p>
                       <button 
                         onClick={() => addToCart(product)}
                         className="w-full mt-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition"
                       >
                         Add to Bag
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         )}
      </div>

      {toast.show && (
        <div className="fixed top-24 right-4 z-[60] bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in">
           <CheckCircle size={20} className="text-green-400" />
           <span className="font-bold text-sm">{toast.msg}</span>
        </div>
      )}

      {cart.length > 0 && !isCartOpen && (
        <button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 bg-gray-900 text-white p-4 rounded-full shadow-2xl z-40 hover:scale-105 transition animate-in zoom-in">
           <ShoppingBag size={24} />
           <span className="absolute -top-1 -right-1 bg-red-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">{cart.length}</span>
        </button>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-[85vw] md:w-full md:max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag /> Your Bag</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
            </div>

            {cart.length === 0 ? (
               <p className="text-gray-500 text-center py-10">Bag is empty.</p>
            ) : (
               <>
                 <div className="space-y-4 mb-6">
                   {cart.map(item => (
                     <div key={item.product.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                       <div>
                          <p className="font-bold text-gray-900">{item.product.name}</p>
                          <p className="text-gray-500">{item.qty} x ₦{item.product.price.toLocaleString()}</p>
                       </div>
                       <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600"><X size={18}/></button>
                     </div>
                   ))}
                 </div>
                 
                 <div className="flex justify-between items-center text-lg font-bold border-t border-gray-100 pt-4 mb-6">
                    <span>Total</span>
                    <span className="text-emerald-600">₦{cartTotal.toLocaleString()}</span>
                 </div>

                 <a href={whatsappLink} target="_blank" className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg">
                    <MessageCircle size={20} /> Checkout on WhatsApp
                 </a>
               </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}