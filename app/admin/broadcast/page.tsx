"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Megaphone, Bell, CheckCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

export default function BroadcastPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info"
  });

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm("Are you sure? This will be sent to ALL users immediately.")) return;

    setLoading(true);

    const { error } = await supabase.rpc('send_broadcast', {
      title: formData.title,
      body: formData.message,
      msg_type: formData.type
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to broadcast: " + error.message);
    } else {
      setSuccess(true);
      setFormData({ title: "", message: "", type: "info" });
      
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Megaphone className="text-emerald-500" size={32} />
          Broadcast System
        </h2>
        <p className="text-gray-400 mt-2">
          Send push notifications to all vendors instantly. Use this wisely.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 p-8 rounded-3xl relative overflow-hidden">
           {success && (
             <div className="absolute inset-0 bg-emerald-900/90 flex flex-col items-center justify-center text-center z-10 animate-in fade-in">
               <CheckCircle size={64} className="text-white mb-4" />
               <h3 className="text-2xl font-bold text-white">Broadcast Sent!</h3>
               <p className="text-emerald-200">Everyone has been notified.</p>
             </div>
           )}

           <form onSubmit={handleBroadcast} className="space-y-6">
              
              <div className="grid grid-cols-3 gap-4">
                {['info', 'warning', 'success'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({...formData, type: t})}
                    className={`p-3 rounded-xl border text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                      formData.type === t 
                        ? t === 'warning' ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                        : t === 'success' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                        : 'bg-blue-500/20 border-blue-500 text-blue-500'
                        : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-750'
                    }`}
                  >
                    {t === 'warning' && <AlertTriangle size={16}/>}
                    {t === 'success' && <CheckCircle size={16}/>}
                    {t === 'info' && <Info size={16}/>}
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Notification Title</label>
                <input 
                  required
                  maxLength={50}
                  className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition"
                  placeholder="e.g. Scheduled Maintenance"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Message Body</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition resize-none"
                  placeholder="We will be offline for 30 mins tonight..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <div className="pt-4 border-t border-gray-800">
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Megaphone size={20} />}
                  Send Broadcast
                </button>
                <p className="text-center text-xs text-gray-600 mt-3">
                  This will create a notification for ALL users in the database.
                </p>
              </div>
           </form>
        </div>

        <div>
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Preview</h3>
           
           <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-start gap-3">
                 <div className={`mt-1 p-2 rounded-full ${
                    formData.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    formData.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-blue-100 text-blue-600'
                 }`}>
                    <Bell size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {formData.title || "Notification Title"}
                    </h4>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      {formData.message || "This is how the message will look to your users when they check their dashboard."}
                    </p>
                    <p className="text-gray-400 text-[10px] mt-2 font-mono">Just now</p>
                 </div>
              </div>
           </div>

           <div className="mt-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
              <h4 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
                <Info size={16}/> Pro Tip
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Use "Warning" for maintenance or downtime alerts. Use "Success" for new feature announcements or promo codes.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}