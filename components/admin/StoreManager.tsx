"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Shield, Mail, Phone, AlertTriangle, CheckCircle, Ban, Zap } from "lucide-react";

export default function StoreManager({ store, onClose, onUpdate }: { store: any, onClose: () => void, onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  const [confirmBan, setConfirmBan] = useState(false);
  
  // --- NEW: LOYALTY STATE ---
  const [loyaltyPercent, setLoyaltyPercent] = useState(store.loyalty_percentage || 1);

  // --- PLAN UPDATE LOGIC ---
  async function updatePlan(newPlan: string) {
    if (!confirm(`Are you sure you want to move this store to ${newPlan}?`)) return;
    setLoading(true);

    let expiryDate = null;
    if (newPlan === 'premium' || newPlan === 'diamond') {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      expiryDate = date.toISOString();
    }

    await supabase
      .from('stores')
      .update({ 
        subscription_plan: newPlan,
        subscription_expiry: expiryDate 
      })
      .eq('id', store.id);

    onUpdate(); 
    setLoading(false);
  }

  // --- ✨ GODMODE BAN LOGIC (SERVER-SIDE SYNC) ---
  async function toggleBan() {
    setLoading(true);
    // The view 'storefront_products' will automatically hide products for 'banned' stores
    const newStatus = store.status === 'banned' ? 'active' : 'banned';
    
    const { error } = await supabase
      .from('stores')
      .update({ status: newStatus })
      .eq('id', store.id);

    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      onUpdate();
      onClose(); // Close to refresh the main table state
    }
    setLoading(false);
  }

  // --- ✨ EMPIRE LOYALTY ENGINE UPDATE ---
  async function updateLoyaltySettings() {
    setLoading(true);
    const { error } = await supabase
      .from('stores')
      .update({ 
        loyalty_enabled: !store.loyalty_enabled,
        loyalty_percentage: loyaltyPercent 
      })
      .eq('id', store.id);

    if (error) {
      alert("Error updating loyalty: " + error.message);
    } else {
      onUpdate();
      alert("Empire Loyalty Engine Updated.");
    }
    setLoading(false);
  }

  // --- VERIFICATION LOGIC ---
  async function toggleVerification() {
    setLoading(true);
    
    const isNowVerified = !store.is_verified;
    
    const updateData = isNowVerified 
      ? { 
          is_verified: true, 
          verification_status: 'verified',
          verification_note: 'Your account has been officially verified by StoreLink.' 
        }
      : { 
          is_verified: false, 
          verification_status: 'none', 
          verification_note: 'Verification was revoked by an administrator.' 
        };

    const { error } = await supabase
      .from('stores')
      .update(updateData)
      .eq('id', store.id);
      
    if (error) {
      alert("Error updating verification: " + error.message);
    } else {
      onUpdate(); 
      onClose(); 
    }
    
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-gray-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* HEADER SECTION */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{store.name}</h2>
               {store.is_verified && <CheckCircle size={20} className="text-blue-500 fill-blue-500/20" />}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
               <span className="font-mono text-xs bg-gray-900 px-2 py-0.5 rounded text-gray-500">{store.id.slice(0, 8)}...</span>
               <span>•</span>
               <a href={`/${store.slug}`} target="_blank" className="text-emerald-500 hover:underline font-bold">
                 storelink.ng/{store.slug}
               </a>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
            {/* OWNER & PERFORMANCE GRID */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Owner Details</h3>
                 
                 <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800">
                   <Mail className="text-blue-500" size={18} />
                   <span className="text-gray-300 select-all text-sm truncate font-medium">{store.owner_email || "No Email"}</span>
                 </div>
                 
                 <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800">
                   <Phone className="text-emerald-500" size={18} />
                   <span className="text-gray-300 select-all text-sm font-medium">{store.owner_phone || "No Phone"}</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Performance</h3>
                 
                 <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Revenue</span>
                    <span className="font-black text-white text-lg tracking-tighter">
                      ₦{store.total_revenue?.toLocaleString() || '0'}
                    </span>
                 </div>
                 
                 <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Region</span>
                    <span className="font-black text-white uppercase text-xs">Nigeria (NGN)</span>
                 </div>
              </div>
            </div>

            <div className="h-px bg-gray-800" />

            {/* SUBSCRIPTION & ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Subscription Tier</h3>
                 <div className="flex gap-2">
                    {['free', 'premium', 'diamond'].map(plan => (
                      <button
                        key={plan}
                        onClick={() => updatePlan(plan)}
                        disabled={store.subscription_plan === plan || loading}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          store.subscription_plan === plan 
                            ? 'bg-emerald-600 text-white cursor-default shadow-lg shadow-emerald-900/20' 
                            : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300'
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                 </div>
               </div>

               <div>
                 <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Godmode Control</h3>
                 
                 <div className="space-y-3">
                    {/* Verification Toggle */}
                    <button 
                      onClick={toggleVerification}
                      disabled={loading}
                      className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
                         store.is_verified 
                         ? 'bg-blue-900/20 text-blue-400 border-blue-900 hover:bg-blue-900/40' 
                         : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-white hover:border-gray-600'
                      }`}
                    >
                       <Shield size={16} className={store.is_verified ? "fill-blue-400" : ""} />
                       {store.is_verified ? "Revoke Verification" : "Verify Vendor"}
                    </button>

                    {/* Ban Logic Toggle */}
                    {!confirmBan ? (
                       <button 
                         onClick={() => setConfirmBan(true)}
                         disabled={loading}
                         className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
                            store.status === 'banned' 
                            ? 'bg-emerald-900/20 text-emerald-500 border-emerald-900'
                            : 'bg-red-900/20 text-red-500 border-red-900 hover:bg-red-900/30'
                         }`}
                       >
                          {store.status === 'banned' ? <CheckCircle size={16}/> : <Ban size={16}/>}
                          {store.status === 'banned' ? "Lift Store Ban" : "Ban Merchant"}
                       </button>
                    ) : (
                      <div className="bg-red-900/10 border border-red-900/50 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                         <p className="text-red-400 text-[10px] mb-4 font-black uppercase tracking-widest text-center">
                           {store.status === 'banned' ? "Restore this vendor?" : "Danger: This will hide all products."}
                         </p>
                         <div className="flex gap-2">
                            <button onClick={() => setConfirmBan(false)} className="flex-1 py-2 bg-gray-800 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-white">Cancel</button>
                            <button onClick={toggleBan} disabled={loading} className="flex-1 py-2 bg-red-600 rounded-xl text-[10px] font-black uppercase text-white shadow-lg shadow-red-900/20">Confirm</button>
                         </div>
                      </div>
                    )}
                 </div>
               </div>
            </div>

            <div className="h-px bg-gray-800" />

            {/* ✨ EMPIRE LOYALTY ENGINE SECTION --- */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap size={14} fill="currentColor" /> Empire Loyalty Engine
              </h3>
              <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800 space-y-5">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-300">Reward Percentage</p>
                      <p className="text-[10px] text-gray-500 uppercase">Current Cashback: <span className="text-amber-500 font-black">{loyaltyPercent}%</span></p>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="15" 
                      value={loyaltyPercent}
                      onChange={(e) => setLoyaltyPercent(parseInt(e.target.value))}
                      className="w-32 accent-amber-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
                 <button 
                  onClick={updateLoyaltySettings}
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${
                    store.loyalty_enabled 
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' 
                    : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-white'
                  }`}
                 >
                   <Zap size={14} fill={store.loyalty_enabled ? "currentColor" : "none"} />
                   {store.loyalty_enabled ? "Engine: Running (Update Settings)" : "Engine: Offline (Activate Engine)"}
                 </button>
              </div>
            </div>
        </div>

        <div className="px-8 py-4 bg-gray-900/50 border-t border-gray-800 flex justify-between items-center">
           <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Administrator Session Active</p>
           {store.subscription_expiry && (
             <p className="text-[9px] font-black text-amber-500/50 uppercase tracking-widest">
               Expires: {new Date(store.subscription_expiry).toLocaleDateString()}
             </p>
           )}
        </div>

      </div>
    </div>
  );
}