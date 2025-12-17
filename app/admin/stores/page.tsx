"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Settings, Filter, CheckCircle } from "lucide-react"; // Added CheckCircle
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
      console.error("Details:", error.details);
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
          <h2 className="text-3xl font-black text-white">Manage Vendors</h2>
          <p className="text-gray-400">Deep control over all platform entities.</p>
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

      <div className="bg-gray-800/50 border border-gray-700 rounded-3xl overflow-hidden min-h-[500px]">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase font-bold sticky top-0 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4">Store Name</th>
              <th className="px-6 py-4">Current Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {filteredStores.map((store) => (
              <tr key={store.id} className={`hover:bg-white/5 transition group ${store.status === 'banned' ? 'opacity-50 grayscale' : ''}`}>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        {/* Store Avatar Initial */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                            store.status === 'banned' ? 'bg-red-900 text-red-500' : 'bg-emerald-900 text-emerald-500'
                        }`}>
                            {store.name.charAt(0)}
                        </div>
                        
                        {/* Store Name & Slug */}
                        <div>
                            <div className="flex items-center gap-1">
                               <p className="font-bold text-white group-hover:text-emerald-400 transition">{store.name}</p>
                               {/* 🔵 Verified Badge Logic */}
                               {store.is_verified && (
                                  <CheckCircle size={14} className="text-blue-400 fill-blue-400/20" />
                               )}
                            </div>
                            <p className="text-xs text-gray-500">/{store.slug}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                     store.subscription_plan === 'diamond' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                     store.subscription_plan === 'premium' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                     'bg-gray-700 text-gray-400 border border-gray-600'
                   }`}>
                     {store.subscription_plan}
                   </span>
                </td>
                <td className="px-6 py-4">
                  {store.status === 'banned' ? (
                    <span className="text-red-500 font-bold text-xs uppercase flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" /> Banned
                    </span>
                  ) : (
                    <span className="text-emerald-500 font-bold text-xs uppercase flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedStore(store)}
                    className="px-4 py-2 bg-gray-900 hover:bg-emerald-600 hover:text-white text-gray-300 rounded-lg text-sm font-bold transition-all border border-gray-700 hover:border-emerald-500 flex items-center gap-2 ml-auto"
                  >
                     <Settings size={16} /> Manage
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