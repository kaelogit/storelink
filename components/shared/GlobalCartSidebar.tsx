"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { 
  X, ShoppingBag, MessageCircle, User, Trash2, Loader2, 
  Coins, Zap, CheckCircle2, Info, HelpCircle, History,
  ArrowUpRight, ArrowDownLeft, ChevronRight
} from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function GlobalCartSidebar() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    useCoins,
    setUseCoins,
    actualBalance,
    setActualBalance
  } = useCart();

  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const [loadingStoreId, setLoadingStoreId] = useState<string | null>(null);
  const [isSyncingWallet, setIsSyncingWallet] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // 1. ✨ INITIALIZE BILLING & AUTO-SYNC
  useEffect(() => {
    const saved = localStorage.getItem("storelink_billing");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        if (parsed.phone && parsed.phone.length >= 10) {
          syncEmpireWallet(parsed.phone);
        }
      } catch (e) {
        console.error("Billing parse error", e);
      }
    }
  }, []);

  // 2. ✨ LEDGER FETCHING (Transparency for the user)
  const fetchHistory = async (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '');
    const { data } = await supabase
      .from('coin_transactions')
      .select('*, stores(name)')
      .eq('phone_number', cleanPhone)
      .order('created_at', { ascending: false })
      .limit(5);
    setHistory(data || []);
  };

  const syncEmpireWallet = async (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '').trim(); 
    if (cleanPhone.length < 10) return;

    setIsSyncingWallet(true);
    try {
      const { data, error } = await supabase.rpc('sync_or_create_wallet', { 
        phone: cleanPhone 
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setActualBalance(data[0].balance);
        fetchHistory(cleanPhone); // Sync the ledger history
        if (data[0].c_name && !formData.name) {
          setFormData(prev => ({ ...prev, name: data[0].c_name }));
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
    
    if (field === "phone" && value.length >= 10) {
      syncEmpireWallet(value);
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

  // 3. ✨ CHECKOUT LOGIC (With Real-time Multi-Vendor Sync)
  const handleCheckout = async (storeId: string, storeData: any, items: any[]) => {
    setLoadingStoreId(storeId); 
    const cleanPhone = formData.phone.replace(/\s+/g, '').trim();

    try {
        const storeTotal = items.reduce((sum: number, i: any) => sum + (i.product.price * i.qty), 0);
        const MAX_DISCOUNT_PERCENT = 0.15;
        const maxAllowedDiscount = Math.floor(storeTotal * MAX_DISCOUNT_PERCENT);
        
        // Dynamic re-calculation against current local balance
        const coinsToApply = useCoins ? Math.min(actualBalance, maxAllowedDiscount) : 0;
        const finalPayable = storeTotal - coinsToApply;
        
        const orderItemsForRPC = items.map((item: any) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.qty,
            price: item.product.price
        }));

        // A. Database Order Creation
        const { data: newOrderId, error: orderError } = await supabase.rpc('create_new_order', {
            store_uuid: storeId,
            customer_name: formData.name,
            customer_phone: cleanPhone,
            customer_email: null, 
            customer_address: formData.address,
            total_amount_paid: finalPayable,
            coins_used: coinsToApply,
            order_items_array: orderItemsForRPC,
        });

        if (orderError) throw orderError;

        // B. Ledger Deduction & Local State Sync (Fixes Store B discount bug)
        if (coinsToApply > 0) {
          const { error: walletError } = await supabase.rpc('decrement_wallet', { 
            phone: cleanPhone, 
            amount: Math.floor(coinsToApply) 
          });
          
          if (!walletError) {
            const newBalance = actualBalance - coinsToApply;
            setActualBalance(newBalance);
            if (newBalance <= 0) setUseCoins(false);
            fetchHistory(cleanPhone); // Refresh history trail
          }
        }

        // C. WhatsApp Prep
        let cleanWhatsApp = storeData.whatsapp_number?.replace(/\D/g, '') || "";
        if (cleanWhatsApp.startsWith('0')) cleanWhatsApp = '234' + cleanWhatsApp.substring(1);
        const itemLines = items.map((i: any) => `- ${i.qty}x ${i.product.name}`).join('\n');
        
        const msg = `*New Order #${newOrderId.slice(0,8)}* 📦\n\n` +
                    `Hello ${storeData.name}, I want to order:\n\n${itemLines}\n\n` +
                    `*Subtotal: ₦${storeTotal.toLocaleString()}*\n` +
                    (coinsToApply > 0 ? `*Empire Coins: -₦${coinsToApply.toLocaleString()}*\n` : "") +
                    `*Total Payable: ₦${finalPayable.toLocaleString()}*\n\n` +
                    `Deliver to: ${formData.address}\n\n` +
                    `Order sent via StoreLink. Please confirm availability!`;
        
        window.open(`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(msg)}`, "_blank");
        
        // D. Clear local items for this vendor
        items.forEach((item: any) => removeFromCart(item.product.id));
        if (cart.length === items.length) setIsCartOpen(false);

    } catch (err: any) {
        console.error("Checkout Failed:", err);
        alert(`Order Failed: ${err.message}`);
    } finally {
        setLoadingStoreId(null); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm">
           <h2 className="font-black text-xl flex items-center gap-2 uppercase tracking-tighter">
             <ShoppingBag className="text-emerald-600" /> My Bag ({cart.length})
           </h2>
           <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 no-scrollbar pb-20">
          <div className="space-y-6">
               
               {/* 1. DELIVERY SECTION */}
               <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="font-black text-gray-900 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-emerald-500" /> Delivery Details
                  </h3>
                  <div className="space-y-3">
                    <input placeholder="Full Name" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.name} onChange={e => handleChange("name", e.target.value)} />
                    <div className="relative">
                      <input placeholder="WhatsApp Number" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
                      {isSyncingWallet && <Loader2 size={16} className="absolute right-4 top-4 animate-spin text-amber-500" />}
                    </div>
                    <textarea placeholder="Full Delivery Address" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none h-20 resize-none" value={formData.address} onChange={e => handleChange("address", e.target.value)} />
                  </div>
               </div>

               {/* 2. ✨ EMPIRE BALANCE, EDUCATION & LEDGER */}
               {actualBalance > 0 && (
                 <div className="space-y-3 animate-in zoom-in duration-300">
                    {/* BALANCE CARD */}
                    <div className={`p-5 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between ${useCoins ? 'bg-amber-500 border-amber-400 shadow-xl shadow-amber-200' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`${useCoins ? 'bg-white text-amber-500' : 'bg-amber-500 text-white'} p-2.5 rounded-2xl shadow-sm`}>
                            <Coins size={20} fill="currentColor"/>
                          </div>
                          <div>
                            <p className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${useCoins ? 'text-white' : 'text-amber-600'}`}>Global Balance</p>
                            <p className={`text-lg font-black ${useCoins ? 'text-white' : 'text-gray-900'}`}>₦{actualBalance.toLocaleString()}</p>
                          </div>
                        </div>
                        <button onClick={() => setUseCoins(!useCoins)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${useCoins ? 'bg-white text-amber-600 shadow-lg' : 'bg-amber-500 text-white'}`}>
                          {useCoins ? "Applied" : "Apply Coins"}
                        </button>
                    </div>

                    {/* ✨ WHAT ARE EMPIRE COINS? (Educational Block) */}
                    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-[2rem] flex gap-4">
                        <div className="bg-blue-500/10 p-2 h-fit rounded-xl">
                          <HelpCircle size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-900 uppercase tracking-tight mb-1">
                            What are Empire Coins?
                          </p>
                          <p className="text-[9px] font-bold text-blue-700/70 leading-relaxed uppercase tracking-tight">
                            You earn these coins automatically whenever you complete an order at any StoreLink shop. 
                            Use them for <span className="text-blue-900 underline decoration-blue-900/30">instant discounts</span> anywhere!
                          </p>
                        </div>
                    </div>

                    {/* ✨ EMPIRE LEDGER (Transaction History) */}
                    {history.length > 0 && (
                      <div className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="font-black text-[9px] text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                          <History size={14} /> Your Ledger
                        </h3>
                        <div className="space-y-4">
                          {history.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                  {tx.amount > 0 ? <ArrowUpRight size={12}/> : <ArrowDownLeft size={12}/>}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-black text-[10px] uppercase tracking-tighter text-gray-800 truncate max-w-[120px]">
                                    {tx.transaction_type === 'earn' ? `Earn: ${tx.stores?.name}` : 
                                     tx.transaction_type === 'refund' ? `Refund: ${tx.stores?.name}` : tx.description}
                                  </p>
                                  <p className="text-[8px] font-bold text-gray-400 uppercase">{new Date(tx.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <span className={`font-black text-xs ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Link href="/empire-coins" className="mt-4 flex items-center justify-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-widest hover:underline transition-all">
                          Manage Digital Gold <ChevronRight size={12} />
                        </Link>
                      </div>
                    )}
                 </div>
               )}

               {/* 3. VENDOR BASKETS */}
               {Object.values(cartByVendor).map(({ store, items }) => {
                 const storeTotal = items.reduce((sum, i) => sum + (i.product.price * i.qty), 0);
                 const maxDiscount = Math.floor(storeTotal * 0.15); 
                 
                 // ✨ Dynamic re-calculation ensures Store B updates when Store A checks out
                 const discount = useCoins ? Math.min(actualBalance, maxDiscount) : 0;
                 const finalTotal = storeTotal - discount;
                 const earnedFromThis = store.loyalty_enabled 
                    ? Math.floor(finalTotal * (store.loyalty_percentage / 100)) 
                    : 0;

                 // ✨ FRAUD PREVENTION UI: Alert vendor if they try to earn from themselves
                 const isSelfBuying = formData.phone.replace(/\s+/g, '') === store.whatsapp_number?.replace(/\D/g, '');

                 return (
                   <div key={store.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
                      {/* Self-Buying Warning */}
                      {isSelfBuying && (
                        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[8px] font-black text-center py-1 uppercase tracking-widest">
                           Self-Earning Disabled for this shop
                        </div>
                      )}

                      <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
                         <h3 className="font-black text-[11px] uppercase tracking-tighter text-gray-400">{store.name}</h3>
                         <div className="text-right">
                           {discount > 0 && <p className="text-[10px] text-gray-300 line-through font-bold">₦{storeTotal.toLocaleString()}</p>}
                           <span className="text-emerald-600 font-black text-xl tracking-tighter">₦{finalTotal.toLocaleString()}</span>
                         </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        {items.map(item => (
                          <div key={item.product.id} className="flex gap-4 items-center group">
                             <div className="relative w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                {item.product.image_urls?.[0] && <Image src={item.product.image_urls[0]} alt="" fill className="object-cover" />}
                             </div>
                             <div className="flex-1">
                                <p className="font-bold text-[13px] text-gray-900 line-clamp-1 uppercase">{item.product.name}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.qty} x ₦{item.product.price.toLocaleString()}</p>
                             </div>
                             <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>

                      {discount > 0 && (
                        <div className="mb-4 bg-amber-50 border border-amber-100 p-3 rounded-2xl flex justify-between items-center text-[9px] font-black uppercase text-amber-700 animate-in zoom-in">
                           <span className="flex items-center gap-1.5"><CheckCircle2 size={12}/> Empire Discount Applied</span>
                           <span>-₦{discount.toLocaleString()}</span>
                        </div>
                      )}

                      {earnedFromThis > 0 && !isSelfBuying && (
                        <div className="bg-emerald-50 text-emerald-700 text-[9px] font-black p-3 rounded-2xl mb-6 flex items-center gap-2 border border-emerald-100 animate-in slide-in-from-bottom-2">
                           <Zap size={14} fill="currentColor" className="animate-pulse" /> Earn +₦{earnedFromThis.toLocaleString()} Coins
                        </div>
                      )}

                      <button 
                        onClick={() => handleCheckout(store.id, store, items)}
                        disabled={!formData.name || !formData.phone || !formData.address || loadingStoreId === store.id}
                        className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all disabled:bg-gray-100 disabled:text-gray-300 flex items-center justify-center gap-2 shadow-xl shadow-gray-100 active:scale-95"
                      >
                        {loadingStoreId === store.id ? (
                           <Loader2 className="animate-spin" size={18} />
                        ) : (
                           <><MessageCircle size={18} /> Complete Checkout</>
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