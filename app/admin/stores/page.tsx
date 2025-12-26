"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Settings, Filter, CheckCircle, ShieldAlert, Clock, AlertCircle } from "lucide-react"; 
import StoreManager from "@/components/admin/StoreManager";

export default function ManageStoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState<any>(null);

  useEffect(() => {
    fetchStores();
  }, []);

  async function fetchStores() {
    const { data, error } = await supabase.rpc('get_admin_stores');
    
    if (error) {
      console.error("SQL Error:", error.message);
    }
    
    if (data) setStores(data);
  }

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Founder Godmode</h2>
          <p className="text-gray-400 text-sm">Deep control over all platform entities.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search by name or slug..."
              className="w-full md:w-64 bg-gray-800 border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-white outline-none focus:border-emerald-500 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-3xl overflow-hidden min-h-[500px] shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-400 text-[10px] uppercase font-black tracking-widest sticky top-0 backdrop-blur-md border-b border-gray-700">
            <tr>
              <th className="px-6 py-4">Store Identity</th>
              <th className="px-6 py-4">Subscription</th>
              <th className="px-6 py-4">System Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {filteredStores.map((store) => (
              <tr 
                key={store.id} 
                className={`hover:bg-white/5 transition group ${
                  store.status === 'banned' ? 'bg-red-500/5' : ''
                }`}
              >
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-inner ${
                            store.status === 'banned' 
                            ? 'bg-red-900/40 text-red-500 border border-red-500/20' 
                            : 'bg-emerald-900/40 text-emerald-500 border border-emerald-500/20'
                        }`}>
                            {store.name.charAt(0)}
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-1">
                              <p className={`font-bold transition ${store.status === 'banned' ? 'text-red-400' : 'text-white group-hover:text-emerald-400'}`}>
                                {store.name}
                              </p>
                              
                              {store.is_verified && (
                                <CheckCircle size={14} className="text-blue-400 fill-blue-400/20" />
                              )}

                              {!store.is_verified && store.verification_status === 'pending' && (
                                <span title="Verification Pending">
                                  <Clock size={14} className="text-amber-500 animate-pulse" />
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono">/{store.slug}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col gap-1">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border w-fit ${
                        store.subscription_plan === 'diamond' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        store.subscription_plan === 'premium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-gray-700/30 text-gray-400 border-gray-600/30'
                      }`}>
                        {store.subscription_plan}
                        {store.is_trial && store.subscription_plan !== 'free' && " (Trial)"}
                      </span>
                      {store.is_trial && store.subscription_plan !== 'free' && (
                        <span className="text-[8px] font-bold text-amber-500/60 uppercase tracking-widest ml-1">Gifted Access</span>
                      )}
                   </div>
                </td>
                <td className="px-6 py-4">
                  {store.status === 'banned' ? (
                    <span className="text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert size={14} /> Banned
                    </span>
                  ) : store.verification_status === 'pending' ? (
                    <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={14} /> Review Needed
                    </span>
                  ) : (
                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedStore(store)}
                    className="px-4 py-2 bg-gray-900 hover:bg-emerald-600 hover:text-white text-gray-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-gray-700 hover:border-emerald-500 flex items-center gap-2 ml-auto active:scale-90"
                  >
                     <Settings size={14} /> Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStore && (
        <StoreManager 
            store={selectedStore} 
            onClose={() => setSelectedStore(null)} 
            onUpdate={fetchStores} 
        />
      )}
    </div>
  );
}