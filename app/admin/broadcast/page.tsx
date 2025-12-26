"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Megaphone, Bell, CheckCircle, AlertTriangle, Info, Loader2, User, Users, Search } from "lucide-react";

export default function BroadcastPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [targetType, setTargetType] = useState<"all" | "specific">("all");
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info"
  });

  useEffect(() => {
    async function fetchStores() {
      const { data } = await supabase.from("stores").select("id, name").order("name");
      if (data) setStores(data);
    }
    fetchStores();
  }, []);

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    
    if (targetType === "specific" && !selectedStoreId) {
        alert("Please select a store first.");
        return;
    }

    const confirmMsg = targetType === "all" 
        ? "Are you sure? This will be sent to ALL users immediately."
        : `Send this nudge to ${stores.find(s => s.id === selectedStoreId)?.name}?`;

    if (!confirm(confirmMsg)) return;

    setLoading(true);

    try {
      if (targetType === "all") {
        // 📣 GLOBAL BROADCAST VIA RPC
        const { error } = await supabase.rpc('send_broadcast', {
          title: formData.title,
          body: formData.message, 
          msg_type: formData.type
        });
        if (error) throw error;
      } else {
        // 🎯 DIRECT NUDGE VIA RPC (Bypasses RLS)
        const { data: storeData, error: fetchError } = await supabase
          .from("stores")
          .select("owner_id")
          .eq("id", selectedStoreId)
          .single();

        if (fetchError || !storeData?.owner_id) throw new Error("Could not locate vendor owner ID.");

        const { error: rpcError } = await supabase.rpc('send_direct_nudge', {
          target_user_id: storeData.owner_id,
          target_title: formData.title,
          target_message: formData.message,
          target_type: formData.type
        });
        
        if (rpcError) throw rpcError;
      }
      
      setSuccess(true);
      setFormData({ title: "", message: "", type: "info" });
      setSelectedStoreId("");
      setSearchQuery("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Empire Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4 sm:px-0">
      <div className="mt-6 sm:mt-0">
        <h2 className="text-3xl font-black text-white flex items-center gap-3 italic tracking-tighter uppercase leading-none">
          <Megaphone className="text-emerald-500" size={32} />
          Communication Center
        </h2>
        <p className="text-gray-400 mt-2 font-black uppercase text-[10px] tracking-[0.2em]">
          Official StoreLink Admin Command
        </p>
      </div>

      {/* TARGET TOGGLE */}
      <div className="flex bg-gray-900 p-1 rounded-2xl border border-gray-800 w-full md:w-fit">
          <button 
            type="button"
            onClick={() => setTargetType("all")}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${targetType === 'all' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Users size={14} /> Broadcast All
          </button>
          <button 
            type="button"
            onClick={() => setTargetType("specific")}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${targetType === 'specific' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <User size={14} /> Direct Nudge
          </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            {success && (
              <div className="absolute inset-0 bg-emerald-900/95 flex flex-col items-center justify-center text-center z-20 animate-in fade-in zoom-in-95">
                <CheckCircle size={64} className="text-white mb-4 animate-bounce" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Delivered!</h3>
                <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest">Notification is now live.</p>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-6">
              
              {targetType === "specific" && (
                <div className="animate-in slide-in-from-top-2">
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 ml-1 tracking-widest">Select Vendor Store</label>
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-4 text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Type store name..."
                            className="w-full bg-black border border-gray-800 rounded-2xl p-4 pl-12 text-white outline-none focus:border-emerald-500 mb-2 font-bold transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="max-h-44 overflow-y-auto bg-black border border-gray-800 rounded-2xl no-scrollbar shadow-inner">
                            {filteredStores.map(store => (
                                <button
                                    key={store.id}
                                    type="button"
                                    onClick={() => setSelectedStoreId(store.id)}
                                    className={`w-full text-left p-4 text-[10px] font-black uppercase border-b border-gray-900 last:border-0 transition-colors tracking-widest ${selectedStoreId === store.id ? 'bg-emerald-900/30 text-emerald-400' : 'text-gray-500 hover:bg-gray-800'}`}
                                >
                                    {store.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {['info', 'warning', 'success'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({...formData, type: t})}
                    className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      formData.type === t 
                        ? t === 'warning' ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                        : t === 'success' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                        : 'bg-blue-500/20 border-blue-500 text-blue-500'
                        : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-750'
                    }`}
                  >
                    {t === 'warning' && <AlertTriangle size={14}/>}
                    {t === 'success' && <CheckCircle size={14}/>}
                    {t === 'info' && <Info size={14}/>}
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 ml-1 tracking-widest">Subject</label>
                <input required maxLength={50} className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-white font-bold focus:border-emerald-500 outline-none transition" placeholder="e.g. Action Required: Logo Quality" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 ml-1 tracking-widest">Instructional Message</label>
                <textarea required rows={5} className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-white font-bold focus:border-emerald-500 outline-none transition resize-none" placeholder="Provide clear, step-by-step instructions..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>

              <div className="pt-4">
                <button disabled={loading} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" /> : <Megaphone size={18} />}
                  {targetType === 'all' ? 'Execute Broadcast' : 'Execute Nudge'}
                </button>
              </div>
            </form>
        </div>

        <div className="hidden md:block">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 ml-1">Live Preview</h3>
           <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-200">
              <div className="flex items-start gap-4">
                 <div className={`mt-1 p-3 rounded-2xl ${
                    formData.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    formData.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-gray-900 text-white'
                 }`}>
                    <Bell size={24} />
                 </div>
                 <div className="min-w-0">
                    <h4 className="font-black text-gray-900 text-sm leading-tight uppercase italic tracking-tighter">
                      {formData.title || "Subject Line"}
                    </h4>
                    <p className="text-gray-500 text-[11px] mt-3 leading-relaxed font-bold whitespace-pre-line break-words">
                      {formData.message || "Message content preview..."}
                    </p>
                    <p className="text-gray-400 text-[9px] mt-4 font-black uppercase tracking-widest">Just now</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}