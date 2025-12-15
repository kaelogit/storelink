"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, MessageCircle, Trash2, User, MapPin, Phone, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function GlobalCart() {
  const { cart, isCartOpen, closeCart, removeFromCart, clearCart } = useCart();
  
  const [step, setStep] = useState<'review' | 'details'>('review');
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", email: "" });
  const [processing, setProcessing] = useState<string | null>(null); // Track which vendor is being processed
  const [completedOrders, setCompletedOrders] = useState<string[]>([]); // Track which orders are sent
  const [checkoutError, setCheckoutError] = useState("");

  if (!isCartOpen) return null;

  const cartByVendor = cart.reduce((acc, item) => {
    const storeId = item.store.id;
    if (!acc[storeId]) acc[storeId] = { store: item.store, items: [] };
    acc[storeId].items.push(item);
    return acc;
  }, {} as Record<string, { store: any; items: any[] }>);

  const handleCheckoutVendor = async (storeId: string, storeData: any, items: any[]) => {
    setProcessing(storeId);
    try {
      const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          store_id: storeId,
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_email: customer.email,
          customer_address: customer.address,
          total_amount: totalAmount,
          status: 'pending' 
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.qty,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      const itemListString = items
        .map(i => `- ${i.qty}x ${i.product.name} (₦${(i.product.price * i.qty).toLocaleString()})`)
        .join('\n');

      const vendorNumber = storeData.whatsapp_number.replace(/\D/g, '').replace(/^0/, '234');
      
      const message = `*New Order #${orderData.id.slice(0,8)}* 📦\n(From StoreLink Marketplace)\n\n${itemListString}\n\n*Total: ₦${totalAmount.toLocaleString()}*\n\n*Customer Details:*\nName: ${customer.name}\nPhone: ${customer.phone}\nAddress: ${customer.address}\n\n(I have placed this order via the website)`;

      const whatsappUrl = `https://wa.me/${vendorNumber}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, "_blank");

      setCompletedOrders(prev => [...prev, storeId]);

    } catch (error: any) {
      setCheckoutError("Failed to process order. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  const hasMultipleVendors = Object.keys(cartByVendor).length > 1;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeCart} />
      
      <div className="relative w-[90vw] md:w-full md:max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} /> Your Bag
          </h2>
          <button onClick={closeCart} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Your bag is empty.</p>
              <button onClick={closeCart} className="text-emerald-600 font-bold text-sm hover:underline">Start Shopping</button>
            </div>
          )}

          {cart.length > 0 && step === 'review' && (
            <div className="space-y-6">
              {Object.values(cartByVendor).map(({ store, items }) => {
                const storeTotal = items.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
                return (
                  <div key={store.id} className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-3">
                      <h3 className="font-bold text-gray-900 text-sm">{store.name}</h3>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">
                         ₦{storeTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.product.id} className="flex gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg relative overflow-hidden shrink-0 border border-gray-200">
                            {item.product.image_urls?.[0] && <Image src={item.product.image_urls[0]} alt="" fill className="object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
                            <p className="text-xs text-gray-500">{item.qty} x ₦{item.product.price.toLocaleString()}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-500 transition self-center">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {cart.length > 0 && step === 'details' && (
            <div className="space-y-6">
              
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                 <h3 className="font-bold text-sm text-gray-900 mb-2">Billing Details (Enter Once)</h3>
                 <div className="relative">
                   <User size={16} className="absolute left-3 top-3 text-gray-400"/>
                   <input required placeholder="Your Name" className="w-full pl-9 p-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}/>
                 </div>
                 <div className="relative">
                   <Phone size={16} className="absolute left-3 top-3 text-gray-400"/>
                   <input required placeholder="Phone Number" type="tel" className="w-full pl-9 p-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}/>
                 </div>
                 <div className="relative">
                   <MapPin size={16} className="absolute left-3 top-3 text-gray-400"/>
                   <input required placeholder="Delivery Address" className="w-full pl-9 p-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})}/>
                 </div>
              </div>

              <div>
                 <h3 className="font-bold text-sm text-gray-900 mb-3">Send Orders</h3>
                 {hasMultipleVendors && <p className="text-xs text-gray-500 mb-4 bg-yellow-50 p-2 rounded-lg border border-yellow-100">Note: You have items from multiple vendors. Please send each order individually.</p>}
                 
                 <div className="space-y-3">
                   {Object.values(cartByVendor).map(({ store, items }) => {
                     const isSent = completedOrders.includes(store.id);
                     const isProcessing = processing === store.id;
                     const isDisabled = !customer.name || !customer.phone || !customer.address || isProcessing || isSent;

                     return (
                       <button
                         key={store.id}
                         onClick={() => handleCheckoutVendor(store.id, store, items)}
                         disabled={isDisabled}
                         className={`
                           w-full flex items-center justify-between p-4 rounded-xl border transition
                           ${isSent 
                             ? 'bg-green-50 border-green-200 text-green-700' 
                             : 'bg-white border-gray-200 hover:border-gray-900 text-gray-900'}
                           ${isDisabled && !isSent ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
                         `}
                       >
                         <div className="flex items-center gap-3">
                           {isSent ? <CheckCircle size={20} className="text-green-600"/> : <MessageCircle size={20} />}
                           <div className="text-left">
                             <p className="font-bold text-sm">{isSent ? `Sent to ${store.name}` : `Send to ${store.name}`}</p>
                             <p className="text-xs opacity-70">Pay ₦{items.reduce((sum, i) => sum + (i.product.price * i.qty), 0).toLocaleString()}</p>
                           </div>
                         </div>
                         {isProcessing && <Loader2 className="animate-spin text-gray-400" size={18} />}
                         {isSent && <span className="text-xs font-bold bg-green-200 px-2 py-1 rounded">DONE</span>}
                       </button>
                     );
                   })}
                 </div>

                 {completedOrders.length === Object.keys(cartByVendor).length && completedOrders.length > 0 && (
                   <div className="mt-6 text-center animate-in fade-in">
                     <p className="text-green-600 font-bold mb-2">All orders sent successfully!</p>
                     <button onClick={() => { clearCart(); closeCart(); setStep('review'); setCompletedOrders([]); }} className="text-sm underline text-gray-500">
                       Clear Cart & Close
                     </button>
                   </div>
                 )}
              </div>
            </div>
          )}

        </div>

        {cart.length > 0 && step === 'review' && (
          <div className="p-5 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-4">
               <span className="text-gray-500 text-sm">Total Estimate</span>
               <span className="text-xl font-extrabold text-gray-900">
                 ₦{cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0).toLocaleString()}
               </span>
            </div>
            {checkoutError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {checkoutError}
                </div>
            )}
            <button 
              onClick={() => setStep('details')}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              Checkout Now <ArrowRight size={18} />
            </button>
          </div>
        )}

        {cart.length > 0 && step === 'details' && completedOrders.length !== Object.keys(cartByVendor).length && (
          <div className="p-5 border-t border-gray-100 bg-white">
             <button 
               onClick={() => setStep('review')}
               className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
             >
               Back to Cart
             </button>
          </div>
        )}

      </div>
    </div>
  );
}