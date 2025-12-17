"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Clock, Check } from "lucide-react";

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    setMessages(msgs => msgs.map(m => m.id === id ? {...m, is_read: true} : m));
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-black text-white">Inbox</h2>
            <p className="text-gray-400">Support tickets and inquiries from the main site.</p>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-xl text-sm font-bold text-gray-300">
            {messages.filter(m => !m.is_read).length} Unread
        </div>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 && !loading && (
            <div className="text-center py-20 text-gray-500">No messages yet.</div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            onClick={() => markAsRead(msg.id)}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              msg.is_read 
                ? "bg-gray-900/30 border-gray-800 text-gray-500" 
                : "bg-gray-800 border-emerald-500/30 shadow-lg shadow-emerald-900/10"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    {!msg.is_read && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                    <h3 className={`font-bold text-lg ${msg.is_read ? 'text-gray-400' : 'text-white'}`}>
                        {msg.subject || "No Subject"}
                    </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12}/>
                    {new Date(msg.created_at).toLocaleDateString()}
                </div>
            </div>

            <p className="text-sm mb-4 line-clamp-2">{msg.message}</p>

            <div className="flex items-center gap-4 text-xs font-mono bg-black/20 w-fit px-3 py-2 rounded-lg">
                <span className="text-emerald-500">{msg.name}</span>
                <span className="text-gray-600">|</span>
                <span className="text-blue-400">{msg.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}