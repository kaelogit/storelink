"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { 
  X, ShoppingBag, MessageCircle, User, Trash2, Loader2, 
  Coins, Zap, CheckCircle2, RefreshCw, Send, Check
} from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { sendGAEvent } from '@next/third-parties/google';

export default function GlobalCartSidebar() {
  const context = useCart();
  if (!context) return null;

  const { 
    cart, isCartOpen, setIsCartOpen, removeFromCart, 
    useCoins, setUseCoins, actualBalance, setActualBalance 
  } = context;

  const pathname = usePathname();
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [loadingStoreId, setLoadingStoreId] = useState<string | null>(null);
  const [isSyncingWallet, setIsSyncingWallet] = useState(false);
  const [liveStoreSettings, setLiveStoreSettings] = useState<Record<string, any>>({});
  
  // --- NEW BRIDGE STATES ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingWaUrl, setPendingWaUrl] = useState("");
  const [pendingStoreName, setPendingStoreName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("storelink_billing");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        if (parsed.phone && parsed.phone.replace(/\D/g, '').length >= 10) {
          syncEmpireWallet(parsed.phone);
        }
      } catch (e) { console.error("Billing parse error", e); }
    }
  }, []);

  useEffect(() => {
    const fetchEverything = async () => {
      const savedBilling = localStorage.getItem("storelink_billing");
      let cleanPhone = "";

      if (savedBilling) {
        try {
          const parsed = JSON.parse(savedBilling);
          cleanPhone = parsed.phone?.replace(/\D/g, '').slice(-10);
        } catch (e) { console.error(e); }
      }

      if (cleanPhone && cleanPhone.length >= 10) {
        const { data: wallet } = await supabase
          .from('user_wallets')
          .select('coin_balance')
          .eq('phone_number', cleanPhone)
          .single();
        
        if (wallet) {
          setActualBalance(wallet.coin_balance);
        } else {
          setActualBalance(0); 
        }
      }

      const storeIds = Array.from(new Set(cart.map(item => item.store.id)));
      if (storeIds.length > 0) {
        const { data: stores } = await supabase
          .from('stores')
          .select('id, name, self_earning, loyalty_enabled, loyalty_percentage, whatsapp_number')
          .in('id', storeIds);
        
        if (stores) {
          const settingsMap = stores.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
          setLiveStoreSettings(settingsMap);
        }
      }
    };

    if (isCartOpen) {
      fetchEverything();
    }
  }, [isCartOpen, cart.length, setActualBalance]);

  const syncEmpireWallet = async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10); 
    if (cleanPhone.length < 10) return;

    setIsSyncingWallet(true);
    try {
      const { data, error } = await supabase.rpc('sync_or_create_wallet', { 
        phone: cleanPhone 
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setActualBalance(data[0].coin_balance); 
        if (data[0].customer_name && !formData.name) {
          setFormData(prev => ({ ...prev, name: data[0].customer_name }));
        }
      }
    } catch (err: any) {
      console.error("Wallet Sync Error:", err.message);
    } finally {
      setIsSyncingWallet(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem("storelink_billing", JSON.stringify(newData));
    
    if (field === "phone" && value.replace(/\D/g, '').length >= 10) {
      syncEmpireWallet(value);
    }
  };

  const handleCheckout = async (storeId: string, storeData: any, items: any[]) => {
    setLoadingStoreId(storeId); 
    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);

    try {
        const storeTotal = items.reduce((sum: number, i: any) => sum + (i.product.price * i.qty), 0);
        const coinsToApply = useCoins ? Math.min(actualBalance, Math.floor(storeTotal * 0.05)) : 0;
        const finalPayable = storeTotal - coinsToApply;
        
        const { data: newOrderId, error: orderError } = await supabase.rpc('create_new_order', {
            store_uuid: storeId,
            customer_name: formData.name,
            customer_phone: cleanPhone,
            customer_address: formData.address,
            total_amount_paid: finalPayable,
            coins_used: coinsToApply,
            order_items_array: items.map((item: any) => ({
                product_id: item.product.id,
                product_name: item.product.name,
                quantity: item.qty,
                price: item.product.price
            })),
        });

        if (orderError) throw orderError;

        if (coinsToApply > 0) {
          await supabase.rpc('decrement_wallet', { 
            arg_phone: cleanPhone, 
            arg_amount: Number(coinsToApply), 
            arg_store: String(storeData.name)
          });
          setUseCoins(false); 
        }

        let wa = storeData.whatsapp_number?.replace(/\D/g, '') || "";
        if (wa.startsWith('0')) wa = '234' + wa.substring(1);
        
        const itemLines = items.map((i: any) => {
          const lineTotal = i.qty * i.product.price;
          return `• *${i.qty}x ${i.product.name}* (₦${i.product.price.toLocaleString()} each) → ₦${lineTotal.toLocaleString()}`;
        }).join('\n');

        const msg = `*ORDER INVOICE #${newOrderId.slice(0, 8).toUpperCase()}* 📦\n\n` +
                    `Hello *${storeData.name}*,\n` +
                    `I would like to place an order for the following items:\n\n` +
                    `${itemLines}\n\n` +
                    `--- *BILLING DETAILS* ---\n` +
                    `👤 *Name:* ${formData.name}\n` +
                    `📞 *Phone:* ${formData.phone}\n` +
                    `📍 *Address:* ${formData.address}\n\n` +
                    `--- *ORDER SUMMARY* ---\n` +
                    `*Subtotal:* ₦${storeTotal.toLocaleString()}\n` +
                    (coinsToApply > 0 ? `*Empire Coins Discount:* -₦${coinsToApply.toLocaleString()}\n` : "") +
                    `*TOTAL PAYABLE:* ₦${finalPayable.toLocaleString()}\n\n` +
                    `--- *NEXT STEPS* ---\n` +
                    `✅ Please confirm item availability.\n` +
                    `💳 Provide your *account details* for payment.\n` +
                    `🚚 Please let me know the *estimated delivery time*.\n\n` +
                    `🚀 _Order generated via StoreLink Ecosystem._`;

        // Instead of window.open, prepare the success bridge
        setPendingWaUrl(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`);
        setPendingStoreName(storeData.name);
        setShowSuccessModal(true);

        sendGAEvent('event', 'purchase', { store: storeData.name, value: finalPayable });

        // Clean up cart
        items.forEach((item: any) => removeFromCart(item.product.id));

    } catch (err: any) {
        alert(`Order Failed: ${err.message}`);
    } finally {
        setLoadingStoreId(null); 
    }
  };

  const isInternalPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
  if (isInternalPage || !isCartOpen) return null;

  const cartByVendor = cart.reduce((acc, item) => {
    const storeId = item.store.id;
    if (!acc[storeId]) acc[storeId] = { store: item.store, items: [] };
    acc[storeId].items.push(item);
    return acc;
  }, {} as Record<string, { store: any, items: any[] }>);

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* --- SUCCESS BRIDGE MODAL --- */}
        {showSuccessModal && (
          <div className="absolute inset-0 z-[110] bg-white flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Check size={40} strokeWidth={3} />
             </div>
             <h2 className="font-black text-2xl uppercase tracking-tighter mb-2 text-gray-900">Order Generated!</h2>
             <p className="text-gray-500 text-sm font-medium mb-8">Your order for <span className="text-gray-900 font-bold">{pendingStoreName}</span> is ready. Click below to send it on WhatsApp.</p>
             
             <a 
              href={pendingWaUrl}
              onClick={() => {
                setShowSuccessModal(false);
                if (cart.length === 0) setIsCartOpen(false);
              }}
              className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-[13px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-200"
             >
               <MessageCircle size={20} fill="currentColor" /> Open WhatsApp to Send
             </a>

             <button 
              onClick={() => {
                setShowSuccessModal(false);
                if (cart.length === 0) setIsCartOpen(false);
              }}
              className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
             >
               Return to Cart
             </button>
          </div>
        )}

        {/* HEADER */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm">
           <h2 className="font-black text-xl flex items-center gap-2 uppercase tracking-tighter"><ShoppingBag className="text-emerald-600" /> My Bag ({cart.length})</h2>
           <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition"><X size={20} /></button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 no-scrollbar pb-24">
          <div className="space-y-6">
            
            {/* BILLING */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2"><User size={14} className="text-emerald-500" /> Delivery Details</h3>
              <div className="space-y-3">
                <input placeholder="Full Name" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.name} onChange={e => handleChange("name", e.target.value)} />
                <input placeholder="WhatsApp Number" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
                <textarea placeholder="Full Delivery Address" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none h-20 resize-none" value={formData.address} onChange={e => handleChange("address", e.target.value)} />
              </div>
            </div>

            {/* COINS */}
            {actualBalance > 0 && (
              <div className="space-y-3 animate-in zoom-in duration-300">
                <div className={`p-5 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between ${useCoins ? 'bg-amber-500 border-amber-400 shadow-xl' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`${useCoins ? 'bg-white text-amber-500' : 'bg-amber-500 text-white'} p-2.5 rounded-2xl shadow-sm`}><Coins size={20} fill="currentColor"/></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-[9px] font-black uppercase tracking-widest ${useCoins ? 'text-white' : 'text-amber-600'}`}>Global Balance</p>
                          <button onClick={() => syncEmpireWallet(formData.phone)} disabled={isSyncingWallet} className={`transition-all hover:scale-110 ${useCoins ? 'text-white/60' : 'text-amber-400'}`}><RefreshCw size={10} className={isSyncingWallet ? "animate-spin" : ""} /></button>
                        </div>
                        <p className={`text-lg font-black ${useCoins ? 'text-white' : 'text-gray-900'}`}>₦{actualBalance.toLocaleString()}</p>
                      </div>
                    </div>
                    <button onClick={() => setUseCoins(!useCoins)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${useCoins ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'}`}>
                      {useCoins ? "Applied" : "Apply Coins"}
                    </button>
                </div>
              </div>
            )}

            {/* VENDOR CARDS */}
            {Object.values(cartByVendor).map(({ store, items }) => {
              const settings = liveStoreSettings[store.id] || store;
              const storeTotal = items.reduce((sum, i) => sum + (i.product.price * i.qty), 0);
              const discount = useCoins ? Math.min(actualBalance, Math.floor(storeTotal * 0.05)) : 0;
              const finalTotal = storeTotal - discount;
              const earned = settings.loyalty_enabled ? Math.floor(finalTotal * (settings.loyalty_percentage / 100)) : 0;

              return (
                <div key={store.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative mb-4">
                   <div className="flex justify-between items-start border-b border-gray-50 pb-4 mb-4">
                      <h3 className="font-black text-[11px] uppercase tracking-tighter text-gray-400">{store.name}</h3>
                      <div className="text-right">
                        {discount > 0 && <p className="text-[10px] text-gray-300 line-through font-bold">₦{storeTotal.toLocaleString()}</p>}
                        <span className="text-emerald-600 font-black text-xl tracking-tighter">₦{finalTotal.toLocaleString()}</span>
                      </div>
                   </div>

                   {/* ITEM LIST */}
                   <div className="space-y-4 mb-6">
                      {items.map(item => (
                        <div key={item.product.id} className="flex gap-4 items-center group text-left min-w-0">
                          <div className="relative w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border shrink-0">
                            {item.product.image_urls?.[0] && (
                              <Image src={item.product.image_urls[0]} alt="" fill className="object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[13px] text-gray-900 uppercase truncate">{item.product.name}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.qty} x ₦{item.product.price.toLocaleString()}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors shrink-0">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                   {/* LOYALTY INFO */}
                   {settings.loyalty_enabled && (
                     <div className={`text-[9px] font-black p-4 rounded-2xl mb-6 flex flex-col gap-1 border bg-emerald-50 text-emerald-700 border-emerald-100`}>
                        <div className="flex items-center justify-between uppercase">
                            <span className="flex items-center gap-2"><Zap size={14} fill="currentColor" /> You are earning</span>
                            <span className="text-xs">+₦{earned.toLocaleString()}</span>
                        </div>
                        <p className="text-[7px] opacity-60 uppercase tracking-widest text-left">Calculated as {settings.loyalty_percentage}% of your ₦{finalTotal.toLocaleString()} total</p>
                     </div>
                   )}

                   {/* DYNAMIC CHECKOUT BUTTON */}
                   <button 
                     onClick={() => handleCheckout(store.id, store, items)} 
                     disabled={!formData.name || !formData.phone || !formData.address || loadingStoreId === store.id} 
                     className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:bg-gray-100 disabled:text-gray-300 flex items-center justify-center gap-2"
                   >
                     {loadingStoreId === store.id ? (
                       <Loader2 className="animate-spin" size={18} />
                     ) : (
                       <><Send size={16} /> Send order to {store.name}</>
                     )}
                   </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}