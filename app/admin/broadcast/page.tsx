"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Megaphone, Bell, CheckCircle, AlertTriangle, Info, Loader2, User, Users, Search, ShoppingBag, Store } from "lucide-react";

type Audience = "all" | "sellers" | "buyers" | "store_owner";

export default function BroadcastPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [audience, setAudience] = useState<Audience>("sellers");
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    async function fetchStores() {
      const { data } = await supabase.from("stores").select("id, name").order("name");
      if (data) setStores(data);
    }
    fetchStores();
  }, []);

  const filteredStores = stores.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();

    if (audience === "store_owner" && !selectedStoreId) {
      alert("Please select a store.");
      return;
    }

    const labels: Record<Audience, string> = {
      all: "every profile on StoreLink (sellers and buyers)",
      sellers: "every seller profile (is_seller = true)",
      buyers: "every non-seller profile",
      store_owner: `the owner of ${stores.find((s) => s.id === selectedStoreId)?.name || "this store"}`,
    };

    if (!confirm(`Send this announcement to ${labels[audience]}? Messages appear only in the Storefront web dashboard inbox — not in the mobile app notification feed.`)) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/storefront-broadcast", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          title: formData.title,
          body: formData.message,
          msg_type: formData.type,
          ...(audience === "store_owner" ? { storeId: selectedStoreId } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || res.statusText);

      setSuccess(true);
      setFormData({ title: "", message: "", type: "info" });
      setSelectedStoreId("");
      setSearchQuery("");
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: unknown) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4 sm:px-0">
      <div className="mt-6 sm:mt-0">
        <h2 className="text-3xl font-black text-white flex items-center gap-3 italic tracking-tighter uppercase leading-none">
          <Megaphone className="text-emerald-500" size={32} />
          Storefront announcements
        </h2>
        <p className="text-gray-400 mt-2 font-medium text-sm max-w-2xl leading-relaxed">
          These messages go to the <span className="text-gray-200 font-bold">Storefront dashboard → Announcements</span> inbox only. They do not use the
          same <span className="font-mono text-gray-500">notifications</span> table as the mobile app.
        </p>
        <p className="text-gray-600 mt-2 text-[11px] font-medium">
          Apply migration <span className="font-mono text-gray-400">20260910170000_storefront_site_notifications.sql</span> so inserts succeed.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 bg-gray-900 p-1 rounded-2xl border border-gray-800">
        {(
          [
            { id: "sellers" as const, label: "All sellers", icon: Store },
            { id: "buyers" as const, label: "All buyers", icon: ShoppingBag },
            { id: "all" as const, label: "Everyone", icon: Users },
            { id: "store_owner" as const, label: "One store", icon: User },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setAudience(id)}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              audience === id ? "bg-emerald-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          {success && (
            <div className="absolute inset-0 bg-emerald-900/95 flex flex-col items-center justify-center text-center z-20 animate-in fade-in zoom-in-95">
              <CheckCircle size={64} className="text-white mb-4 animate-bounce" />
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Sent</h3>
              <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest">Storefront inboxes updated</p>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-6">
            {audience === "store_owner" && (
              <div className="animate-in slide-in-from-top-2">
                <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 ml-1 tracking-widest">Select store (legacy stores row)</label>
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
                    {filteredStores.map((store) => (
                      <button
                        key={store.id}
                        type="button"
                        onClick={() => setSelectedStoreId(store.id)}
                        className={`w-full text-left p-4 text-[10px] font-black uppercase border-b border-gray-900 last:border-0 transition-colors tracking-widest ${
                          selectedStoreId === store.id ? "bg-emerald-900/30 text-emerald-400" : "text-gray-500 hover:bg-gray-800"
                        }`}
                      >
                        {store.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {(["info", "warning", "success"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    formData.type === t
                      ? t === "warning"
                        ? "bg-amber-500/20 border-amber-500 text-amber-500"
                        : t === "success"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                          : "bg-blue-500/20 border-blue-500 text-blue-500"
                      : "bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-750"
                  }`}
                >
                  {t === "warning" && <AlertTriangle size={14} />}
                  {t === "success" && <CheckCircle size={14} />}
                  {t === "info" && <Info size={14} />}
                  {t}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 ml-1 tracking-widest">Subject</label>
              <input
                required
                maxLength={80}
                className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-white font-bold focus:border-emerald-500 outline-none transition"
                placeholder="e.g. Holiday shipping windows"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 ml-1 tracking-widest">Message</label>
              <textarea
                required
                rows={5}
                className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-white font-bold focus:border-emerald-500 outline-none transition resize-none"
                placeholder="Clear instructions or updates for sellers and buyers…"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="pt-4">
              <button
                disabled={loading}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Megaphone size={18} />}
                Send to storefront inboxes
              </button>
            </div>
          </form>
        </div>

        <div className="hidden md:block">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 ml-1">Preview</h3>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-200">
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 p-3 rounded-2xl ${
                  formData.type === "warning"
                    ? "bg-amber-100 text-amber-600"
                    : formData.type === "success"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-900 text-white"
                }`}
              >
                <Bell size={24} />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-gray-900 text-sm leading-tight uppercase italic tracking-tighter">
                  {formData.title || "Subject line"}
                </h4>
                <p className="text-gray-500 text-[11px] mt-3 leading-relaxed font-bold whitespace-pre-line break-words">
                  {formData.message || "Message preview…"}
                </p>
                <p className="text-gray-400 text-[9px] mt-4 font-black uppercase tracking-widest">Storefront inbox · Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
