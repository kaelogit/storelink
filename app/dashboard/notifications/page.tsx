"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, CheckCircle, AlertTriangle, Info, Clock, Check, ChevronRight, ArrowLeft, MessageSquare } from "lucide-react";

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

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

  async function openNotification(note: any) {
    setSelectedNote(note);
    if (!note.is_read) {
      // Update UI locally immediately
      setNotifications(prev => prev.map(n => n.id === note.id ? {...n, is_read: true} : n));
      // Update Database
      await supabase.from('notifications').update({ is_read: true }).eq('id', note.id);
    }
  }

  // 💬 DIRECT SUPPORT LINK
  const handleSupport = () => {
      const adminNumber = "234XXXXXXXXXX"; // REPLACEME: Your actual WhatsApp number
      const text = encodeURIComponent(`Hi StoreLink Admin, I'm reaching out regarding the notification: "${selectedNote.title}"`);
      window.open(`https://wa.me/${adminNumber}?text=${text}`, "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 overflow-hidden">
      
      {/* HEADER SECTION (HIDDEN WHEN READING) */}
      {!selectedNote && (
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Inbox</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Official Updates</p>
          </div>
          
          <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full bg-emerald-500 ${notifications.some(n => !n.is_read) ? 'animate-pulse' : ''}`} />
             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
               {notifications.filter(n => !n.is_read).length} Unread
             </span>
          </div>
        </div>
      )}

      {/* LIST VIEW (INBOX) */}
      {!selectedNote ? (
        <div className="space-y-3">
          {notifications.length === 0 && !loading && (
              <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                  <Bell size={40} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Your warehouse is quiet</p>
              </div>
          )}

          {notifications.map((note) => (
            <div 
              key={note.id} 
              onClick={() => openNotification(note)}
              className={`relative p-4 rounded-3xl border transition-all active:scale-[0.97] flex items-center gap-4 overflow-hidden ${
                note.is_read 
                  ? "bg-white border-gray-100 opacity-60 shadow-sm" 
                  : "bg-white border-gray-900 shadow-xl shadow-gray-200"
              }`}
            >
              {/* CATEGORY ICON */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                note.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                note.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                'bg-gray-100 text-gray-900'
              }`}>
                {note.type === 'warning' ? <AlertTriangle size={18}/> :
                 note.type === 'success' ? <CheckCircle size={18}/> :
                 <Info size={18}/>}
              </div>

              {/* TEXT CONTENT - TRUNCATED FOR MOBILE SAFETY */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex justify-between items-start mb-0.5 gap-2">
                   <h3 className={`font-black text-xs uppercase tracking-tight truncate ${note.is_read ? 'text-gray-500' : 'text-gray-900'}`}>
                      {note.title}
                   </h3>
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter whitespace-nowrap pt-0.5">
                      {new Date(note.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                   </span>
                </div>
                
                <p className="text-[11px] text-gray-400 font-bold truncate">
                  {note.message}
                </p>
              </div>

              <ChevronRight size={14} className="text-gray-300 shrink-0" />

              {!note.is_read && (
                 <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-2 right-2 border-2 border-white shadow-sm" />
              )}
            </div>
          ))}
        </div>
      ) : (
        /* FULL MESSAGE VIEW (THE DETAIL VIEW) */
        <div className="animate-in slide-in-from-bottom-10 duration-500 max-w-full">
            <button 
              onClick={() => setSelectedNote(null)}
              className="mb-6 flex items-center gap-2 text-gray-900 font-black text-[10px] uppercase tracking-widest bg-white border border-gray-200 py-3 px-6 rounded-full shadow-sm active:scale-95 transition"
            >
                <ArrowLeft size={14} /> Back to Inbox
            </button>

            <div className="bg-white rounded-[2.5rem] border border-gray-900 shadow-2xl shadow-gray-300 overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`p-4 rounded-[1.2rem] shrink-0 ${
                            selectedNote.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                            selectedNote.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                            'bg-gray-900 text-white'
                        }`}>
                            {selectedNote.type === 'warning' ? <AlertTriangle size={24}/> :
                             selectedNote.type === 'success' ? <CheckCircle size={24}/> :
                             <Info size={24}/>}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-none uppercase tracking-tighter italic break-words">
                                {selectedNote.title}
                            </h2>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <Clock size={10} /> {new Date(selectedNote.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>

                    {/* CONTENT BODY - PRESERVES WHITESPACE AND TABS */}
                    <div className="bg-gray-50 p-5 sm:p-6 rounded-[2rem] border border-gray-100 min-h-[150px]">
                        <p className="text-gray-800 text-xs sm:text-sm leading-relaxed font-bold whitespace-pre-line break-words">
                            {selectedNote.message}
                        </p>
                    </div>

                    {/* INTERACTIVE ACTIONS */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        
                        <button 
                          onClick={() => setSelectedNote(null)}
                          className="w-full sm:w-auto px-8 py-4 bg-emerald-400 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition"
                        >
                            Mark as Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}