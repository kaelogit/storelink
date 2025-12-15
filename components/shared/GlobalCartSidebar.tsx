"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, MessageCircle, MapPin, Phone, User, Trash2 } from "lucide-react";
import Image from "next/image";

export default function GlobalCartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("storelink_billing");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem("storelink_billing", JSON.stringify(newData));
  };

  const cartByVendor = cart.reduce((acc, item) => {
    const storeId = item.store.id;
    if (!acc[storeId]) acc[storeId] = { store: item.store, items: [] };
    acc[storeId].items.push(item);
    return acc;
  }, {} as Record<string, { store: any, items: any[] }>);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">
           <h2 className="font-bold text-xl flex items-center gap-2">
             <ShoppingBag className="text-emerald-600" /> Your Bag ({cart.length})
           </h2>
           <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition">
             <X size={20} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
          
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
               <ShoppingBag size={64} className="mb-4" />
               <p>Your bag is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
               
               <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                    <User size={16}/> Billing Details (Enter Once)
                  </h3>
                  <div className="space-y-3">
                    <input 
                      placeholder="Your Name" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.name}
                      onChange={e => handleChange("name", e.target.value)}
                    />
                    <input 
                      placeholder="Phone Number" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.phone}
                      onChange={e => handleChange("phone", e.target.value)}
                    />
                    <textarea 
                      placeholder="Delivery Address" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-20"
                      value={formData.address}
                      onChange={e => handleChange("address", e.target.value)}
                    />
                  </div>
               </div>

               {Object.values(cartByVendor).map(({ store, items }) => {
                 const storeTotal = items.reduce((sum, i) => sum + (i.product.price * i.qty), 0);
                 
                 const isFormValid = formData.name && formData.phone && formData.address;
                 
                 let cleanNumber = store.whatsapp_number?.replace(/\D/g, '') || "";
                 if (cleanNumber.startsWith('0')) cleanNumber = '234' + cleanNumber.substring(1);

                 const itemLines = items.map(i => `- ${i.qty}x ${i.product.name} (₦${(i.product.price * i.qty).toLocaleString()})`).join('\n');
                 
                 const msg = `*New Order via StoreLink* 🛍️\n\nHello ${store.name}, I want to place an order:\n\n${itemLines}\n\n*Total: ₦${storeTotal.toLocaleString()}*\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}\n\nKindly provide me with your Account Details to complete payment and let me know the expected delivery day.`;
                 
                 const whatsappLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;

                 return (
                   <div key={store.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                         <h3 className="font-bold text-gray-900">{store.name}</h3>
                         <span className="text-emerald-600 font-bold">₦{storeTotal.toLocaleString()}</span>
                      </div>

                      <div className="space-y-4 mb-4">
                        {items.map(item => (
                          <div key={item.product.id} className="flex gap-3">
                             <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                {item.product.image_urls?.[0] && (
                                  <Image src={item.product.image_urls[0]} alt="" fill className="object-cover" />
                                )}
                             </div>
                             <div className="flex-1">
                                <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.product.name}</p>
                                <p className="text-xs text-gray-500">{item.qty} x ₦{item.product.price.toLocaleString()}</p>
                             </div>
                             <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-500 transition">
                                <Trash2 size={16} />
                             </button>
                          </div>
                        ))}
                      </div>

                      {isFormValid ? (
                        <a 
                          href={whatsappLink} 
                          target="_blank" 
                          className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition active:scale-95"
                        >
                          <MessageCircle size={18} /> Send Order to {store.name}
                        </a>
                      ) : (
                        <button disabled className="w-full bg-gray-200 text-gray-400 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed">
                          Fill Billing Details to Checkout
                        </button>
                      )}
                   </div>
                 );
               })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}