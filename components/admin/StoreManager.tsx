"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Shield, Mail, Phone, AlertTriangle, CheckCircle, Ban } from "lucide-react";

export default function StoreManager({ store, onClose, onUpdate }: { store: any, onClose: () => void, onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  const [confirmBan, setConfirmBan] = useState(false);

  async function updatePlan(newPlan: string) {
    if (!confirm(`Are you sure you want to move this store to ${newPlan}?`)) return;
    setLoading(true);
    await supabase.from('stores').update({ subscription_plan: newPlan }).eq('id', store.id);
    onUpdate(); 
    setLoading(false);
  }

  async function toggleBan() {
    setLoading(true);
    const newStatus = store.status === 'banned' ? 'active' : 'banned';
    await supabase.from('stores').update({ status: newStatus }).eq('id', store.id);
    onUpdate();
    setLoading(false);
    onClose();
  }

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
        
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
               <h2 className="text-2xl font-black text-white">{store.name}</h2>
               {store.is_verified && <CheckCircle size={20} className="text-blue-500 fill-blue-500/20" />}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
               <span className="font-mono">{store.id.slice(0, 8)}...</span>
               <span>•</span>
               <a href={`/${store.slug}`} target="_blank" className="text-emerald-500 hover:underline">
                 storelink.ng/{store.slug}
               </a>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
           <div className="grid grid-cols-2 gap-6">
             <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Owner Details</h3>
                
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800">
                  <Mail className="text-blue-500" size={18} />
                  <span className="text-gray-300 select-all text-sm">{store.owner_email || "No Email"}</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800">
                  <Phone className="text-emerald-500" size={18} />
                  <span className="text-gray-300 select-all text-sm">{store.owner_phone || "No Phone"}</span>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Performance</h3>
                
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800">
                   <span className="text-gray-400 text-sm">Lifetime Revenue</span>
                   <span className="font-bold text-white text-lg">
                     ₦{store.total_revenue?.toLocaleString() || '0'}
                   </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800">
                   <span className="text-gray-400 text-sm">Currency</span>
                   <span className="font-bold text-white">NGN</span>
                </div>
             </div>
           </div>

           <div className="h-px bg-gray-800" />

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Subscription Plan</h3>
                <div className="flex gap-2">
                   {['free', 'premium', 'diamond'].map(plan => (
                     <button
                       key={plan}
                       onClick={() => updatePlan(plan)}
                       disabled={store.subscription_plan === plan || loading}
                       className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                         store.subscription_plan === plan 
                           ? 'bg-emerald-600 text-white cursor-default ring-2 ring-emerald-500 ring-offset-2 ring-offset-black' 
                           : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                       }`}
                     >
                       {plan}
                     </button>
                   ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Store Actions</h3>
                
                <div className="space-y-3">
                   <button 
                     onClick={toggleVerification}
                     disabled={loading}
                     className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                        store.is_verified 
                        ? 'bg-blue-900/20 text-blue-400 border-blue-900 hover:bg-blue-900/40' 
                        : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                     }`}
                   >
                      <Shield size={18} className={store.is_verified ? "fill-blue-400" : ""} />
                      {store.is_verified ? "Revoke Verification" : "Mark as Verified"}
                   </button>

                   {!confirmBan ? (
                      <button 
                        onClick={() => setConfirmBan(true)}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                           store.status === 'banned' 
                           ? 'bg-emerald-900/20 text-emerald-500 border-emerald-900'
                           : 'bg-red-900/20 text-red-500 border-red-900 hover:bg-red-900/30'
                        }`}
                      >
                         {store.status === 'banned' ? <CheckCircle size={18}/> : <Ban size={18}/>}
                         {store.status === 'banned' ? "Unban Store" : "Ban Store"}
                      </button>
                   ) : (
                     <div className="bg-red-900/20 border border-red-900 p-3 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-red-400 text-xs mb-3 font-bold text-center">
                          {store.status === 'banned' ? "Re-activate this vendor?" : "Are you sure? This will kill their store."}
                        </p>
                        <div className="flex gap-2">
                           <button onClick={() => setConfirmBan(false)} className="flex-1 py-2 bg-gray-800 rounded-lg text-xs font-bold text-gray-300">Cancel</button>
                           <button onClick={toggleBan} disabled={loading} className="flex-1 py-2 bg-red-600 rounded-lg text-xs font-bold text-white">Confirm</button>
                        </div>
                     </div>
                   )}
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}