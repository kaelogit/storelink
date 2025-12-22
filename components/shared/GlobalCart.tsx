"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, MessageCircle, Trash2, User, MapPin, Phone, ArrowRight, Loader2, CheckCircle, Sparkles, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function GlobalCart() {
  const { cart, isCartOpen, closeCart, removeFromCart, clearCart } = useCart();
  
  const [step, setStep] = useState<'review' | 'details'>('review');
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", email: "" });
  const [processing, setProcessing] = useState<string | null>(null); 
  const [completedOrders, setCompletedOrders] = useState<string[]>([]); 
  const [checkoutError, setCheckoutError] = useState("");

  // --- EMPIRE COIN LOGIC ADDED HERE ---
  const [useCoins, setUseCoins] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  // Auto-fetch wallet balance when phone number is typed
  useEffect(() => {
    const fetchWallet = async () => {
      const cleanPhone = customer.phone.replace(/\s+/g, '').trim();
      if (cleanPhone.length >= 10) {
        const { data } = await supabase
          .from('profiles')
          .select('empire_coin_balance')
          .eq('phone', cleanPhone)
          .single();
        if (data) setWalletBalance(data.empire_coin_balance || 0);
      }
    };
    fetchWallet();
  }, [customer.phone]);

  if (!isCartOpen) return null;

  const cartByVendor = cart.reduce((acc, item) => {
    const storeId = item.store.id;
    if (!acc[storeId]) acc[storeId] = { store: item.store, items: [] };
    acc[storeId].items.push(item);
    return acc;
  }, {} as Record<string, { store: any; items: any[] }>);

  const handleCheckoutVendor = async (storeId: string, storeData: any, items: any[]) => {
    setProcessing(storeId);
    setCheckoutError("");
    const cleanPhone = customer.phone.replace(/\s+/g, '').trim();

    try {
      // 1. FINANCIAL CALCULATIONS (With 15% Rule)
      const storeTotal = items.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
      const MAX_DISCOUNT_PERCENT = 0.05;
      const maxAllowedDiscount = Math.floor(storeTotal * MAX_DISCOUNT_PERCENT);
      
      const coinsToApply = useCoins ? Math.min(walletBalance, maxAllowedDiscount) : 0;
      const finalPayable = storeTotal - coinsToApply;

      // 2. CREATE ORDER IN DB
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          store_id: storeId,
          customer_name: customer.name,
          customer_phone: cleanPhone,
          customer_email: customer.email,
          customer_address: customer.address,
          total_amount: finalPayable, // Store the amount the customer actually owes
          coins_used: coinsToApply,
          status: 'pending' 
        })
        .select()
        .single();

      // Guard Clause: If order fails, stop everything
      if (orderError) throw orderError;

      // 🔥 PERSISTENCE: Save phone so Wallet Page auto-syncs
      localStorage.setItem('storelink_user_phone', cleanPhone);

      // 3. BURN THE COINS (Cybersecurity Atomic Deduction + Audit Log)
      if (coinsToApply > 0) {
        const { error: walletError } = await supabase.rpc('decrement_wallet', { 
          phone: cleanPhone, 
          amount: Math.floor(coinsToApply),
          store_name: storeData.name // Sends to the coin_transactions ledger
        });
        
        if (!walletError) {
          // Update UI immediately so the next vendor check doesn't "double dip"
          setWalletBalance(prev => Math.max(0, prev - coinsToApply));
          setUseCoins(false); 
        } else {
          console.error("Critical: Wallet deduction failed after order created", walletError);
          // We don't throw here to avoid stopping the WhatsApp flow, but we log it.
        }
      }

      // 4. INSERT ORDER ITEMS (Linked to the order above)
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.qty,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // 5. WHATSAPP MESSAGE PREPARATION
      const itemListString = items.map(i => `- ${i.qty}x ${i.product.name}`).join('\n');
      
      // Formatting the vendor number for WhatsApp
      let vendorNumber = storeData.whatsapp_number.replace(/\D/g, '');
      if (vendorNumber.startsWith('0')) vendorNumber = '234' + vendorNumber.substring(1);
      
      const message = `*New Order #${orderData.id.slice(0,8)}* 📦\n\n` +
        `Hello *${storeData.name}*, I've just placed an order via StoreLink:\n\n` +
        `${itemListString}\n\n` +
        `--------------------------\n` +
        `*Subtotal:* ₦${storeTotal.toLocaleString()}\n` +
        (coinsToApply > 0 ? `*Empire Coins Applied:* -₦${coinsToApply.toLocaleString()} ✨\n` : "") +
        `*TOTAL PAYABLE:* ₦${finalPayable.toLocaleString()}\n` +
        `--------------------------\n\n` +
        `📍 *Deliver to:* ${customer.address}\n` +
        `👤 *Customer Name:* ${customer.name}\n` +
        `📞 *Customer Phone:* ${cleanPhone}\n\n` +
        `🚀 _Order verified via StoreLink. Please confirm item availability and share account details for payment!_`;

      // 6. WHATSAPP REDIRECTION
      window.open(`https://wa.me/${vendorNumber}?text=${encodeURIComponent(message)}`, "_blank");

      // 7. TRACK COMPLETION
      setCompletedOrders(prev => [...prev, storeId]);

    } catch (error: any) {
      console.error("Checkout Logic Error:", error);
      setCheckoutError(error.message || "Failed to process order. Please check your connection.");
    } finally {
      setProcessing(null);
    }
  };
  const hasMultipleVendors = Object.keys(cartByVendor).length > 1;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeCart} />
      
      <div className="relative w-[90vw] md:w-full md:max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} /> Your Bag
          </h2>
          <button onClick={closeCart} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* STEP 1: REVIEW */}
          {cart.length > 0 && step === 'review' && (
            <div className="space-y-6">
              {Object.values(cartByVendor).map(({ store, items }) => {
                const storeTotal = items.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
                return (
                  <div key={store.id} className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-3">
                      <h3 className="font-bold text-gray-900 text-sm">{store.name}</h3>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">₦{storeTotal.toLocaleString()}</span>
                    </div>
                    {/* ... (Items map remains exactly same) */}
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
                          <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {cart.length > 0 && step === 'details' && (
            <div className="space-y-6">
              {/* BILLING FORM */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                 <h3 className="font-bold text-sm text-gray-900 mb-2">Delivery Details</h3>
                 <div className="relative"><User size={16} className="absolute left-3 top-3 text-gray-400"/><input required placeholder="Your Name" className="w-full pl-9 p-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}/></div>
                 <div className="relative"><Phone size={16} className="absolute left-3 top-3 text-gray-400"/><input required placeholder="Phone Number" type="tel" className="w-full pl-9 p-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}/></div>
                 <div className="relative"><MapPin size={16} className="absolute left-3 top-3 text-gray-400"/><input required placeholder="Delivery Address" className="w-full pl-9 p-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})}/></div>
              </div>

              {/* EMPIRE COIN UI SECTION */}
              {walletBalance > 0 && (
                <div className={`p-4 rounded-2xl border-2 transition-all ${useCoins ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'}`}>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-emerald-500 rounded-lg text-white"><Sparkles size={18} /></div>
                         <div>
                            <p className="text-sm font-black text-gray-900">Apply Empire Coins</p>
                            <p className="text-xs text-emerald-600 font-bold">Balance: ₦{walletBalance.toLocaleString()}</p>
                         </div>
                      </div>
                      <input type="checkbox" checked={useCoins} onChange={() => setUseCoins(!useCoins)} className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                   </div>
                </div>
              )}

              {/* VENDOR BUTTONS */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-gray-900">Send Orders</h3>
                {Object.values(cartByVendor).map(({ store, items }) => {
                  const isSent = completedOrders.includes(store.id);
                  const storeTotal = items.reduce((sum, i) => sum + (i.product.price * i.qty), 0);
                  const discount = useCoins ? Math.min(walletBalance, Math.floor(storeTotal * 0.05)) : 0;
                  const finalAmount = storeTotal - discount;

                  return (
                    <button
                      key={store.id}
                      onClick={() => handleCheckoutVendor(store.id, store, items)}
                      disabled={!customer.name || !customer.phone || !customer.address || processing === store.id || isSent}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${isSent ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 hover:border-gray-900'}`}
                    >
                      <div className="flex items-center gap-3">
                        {isSent ? <CheckCircle size={20} className="text-green-600"/> : <MessageCircle size={20} />}
                        <div className="text-left">
                          <p className="font-bold text-sm">Send to {store.name}</p>
                          <p className="text-xs opacity-70">Pay ₦{finalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      {isSent && <span className="text-xs font-bold bg-green-200 px-2 py-1 rounded">SENT</span>}
                      {processing === store.id && <Loader2 className="animate-spin text-gray-400" size={18} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM FIXED ACTIONS */}
        <div className="p-5 border-t border-gray-100 bg-white">
            {/* Total Estimate Summary remains same */}
            <div className="flex justify-between items-center mb-4">
               <span className="text-gray-500 text-sm">Total Estimate</span>
               <span className="text-xl font-extrabold text-gray-900">
                 ₦{cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0).toLocaleString()}
               </span>
            </div>
            {step === 'review' && cart.length > 0 && (
              <button onClick={() => setStep('details')} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                Checkout Now <ArrowRight size={18} />
              </button>
            )}
            {step === 'details' && !completedOrders.length && (
              <button onClick={() => setStep('review')} className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">Back to Cart</button>
            )}
        </div>
      </div>
    </div>
  );
}