"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, CheckCircle, AlertTriangle, Info, Clock, Check } from "lucide-react";

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (data) setNotifications(data);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, is_read: true} : n));
    
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Notifications</h1>
          <p className="text-gray-500">Updates from the StoreLink team.</p>
        </div>
        
        <div className="bg-gray-100 px-4 py-2 rounded-full text-xs font-bold text-gray-600 flex items-center gap-2">
           <Bell size={14} className="fill-gray-400"/>
           {notifications.filter(n => !n.is_read).length} Unread
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Bell size={32} />
                </div>
                <p className="text-gray-400 font-bold">No notifications yet.</p>
            </div>
        )}

        {notifications.map((note) => (
          <div 
            key={note.id} 
            onClick={() => markAsRead(note.id)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer group ${
              note.is_read 
                ? "bg-white border-gray-100 opacity-70 hover:opacity-100" // Read
                : "bg-white border-emerald-100 shadow-xl shadow-emerald-500/5" // Unread
            }`}
          >
            <div className="flex gap-4 items-start">
               <div className={`p-3 rounded-full shrink-0 ${
                  note.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                  note.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-blue-100 text-blue-600'
               }`}>
                  {note.type === 'warning' ? <AlertTriangle size={20}/> :
                   note.type === 'success' ? <CheckCircle size={20}/> :
                   <Info size={20}/>}
               </div>

               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h3 className={`font-bold text-lg mb-1 ${note.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                        {note.title}
                     </h3>
                     {!note.is_read && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                  </div>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">
                    {note.message}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                     <span className="flex items-center gap-1">
                        <Clock size={12}/> {new Date(note.created_at).toLocaleDateString()}
                     </span>
                     {note.is_read && (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                           <Check size={12}/> Read
                        </span>
                     )}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}