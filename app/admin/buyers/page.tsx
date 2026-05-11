"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw, Search } from "lucide-react";

type BuyerRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string;
  phone_number: string | null;
  created_at: string | null;
  acquisition_channel: string | null;
  coin_balance: number | null;
  location_city: string | null;
  location_state: string | null;
};

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<BuyerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [qSubmit, setQSubmit] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 40;

  const load = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("offset", String(offset));
      if (qSubmit.trim()) params.set("q", qSubmit.trim());
      const res = await fetch(`/api/admin/buyers?${params}`, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || res.statusText);
      setBuyers(Array.isArray(json.buyers) ? json.buyers : []);
      setTotal(Number(json.total) || 0);
      setNote(typeof json.note === "string" ? json.note : null);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Load failed");
      setBuyers([]);
    } finally {
      setLoading(false);
    }
  }, [offset, qSubmit]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-8">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 mb-3"
          >
            <ArrowLeft size={14} /> Overview
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Buyers</h1>
          <p className="text-gray-400 mt-2 text-sm font-medium max-w-2xl">
            Profiles that are not sellers (or have seller flag off). Use search to narrow by email, name, or phone. For
            full order history, use{" "}
            <Link href="/admin/orders" className="text-emerald-500 hover:underline font-bold">
              All orders
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 border border-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-gray-800 transition shrink-0"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <form
        className="flex flex-col sm:flex-row gap-3 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          setOffset(0);
          setQSubmit(q);
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Email, name, phone…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest"
        >
          Search
        </button>
      </form>

      {msg && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{msg}</div>
      )}
      {note && (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-xs text-amber-100/90 font-medium">
          {note}
        </div>
      )}

      <p className="text-[11px] text-gray-500 font-medium">
        {buyers.length} row{buyers.length === 1 ? "" : "s"} · {total.toLocaleString()} total matches
      </p>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-emerald-500" size={36} />
        </div>
      ) : buyers.length === 0 ? (
        <div className="rounded-3xl border border-gray-800 bg-gray-900/40 p-16 text-center text-gray-500 text-sm font-medium">
          No buyer profiles match.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-gray-800 bg-gray-900/40 shadow-xl">
          <table className="w-full text-left min-w-[900px]">
            <thead className="border-b border-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-4 py-3 font-black">Buyer</th>
                <th className="px-4 py-3 font-black">Contact</th>
                <th className="px-4 py-3 font-black">Location</th>
                <th className="px-4 py-3 font-black">Acquisition</th>
                <th className="px-4 py-3 font-black text-right">Coins</th>
                <th className="px-4 py-3 font-black">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-sm">
              {buyers.map((b) => (
                <tr key={b.id} className="hover:bg-gray-800/25">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-white">{b.full_name?.trim() || b.display_name}</span>
                    <span className="block text-[10px] text-gray-500 font-mono mt-0.5">{b.id.slice(0, 8)}…</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    <span className="block text-xs">{b.email || "—"}</span>
                    <span className="block text-[10px] text-gray-500">{b.phone_number || ""}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {[b.location_city, b.location_state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-[10px] font-black uppercase text-gray-500">
                    {b.acquisition_channel || "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400/90">
                    {b.coin_balance != null ? Number(b.coin_balance).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-500">
                    {b.created_at ? new Date(b.created_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!qSubmit && total > limit && (
        <div className="flex justify-center gap-3">
          <button
            type="button"
            disabled={offset === 0 || loading}
            onClick={() => setOffset((x) => Math.max(0, x - limit))}
            className="px-5 py-2 rounded-xl border border-gray-700 text-[10px] font-black uppercase tracking-widest text-gray-300 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={offset + limit >= total || loading}
            onClick={() => setOffset((x) => x + limit)}
            className="px-5 py-2 rounded-xl border border-gray-700 text-[10px] font-black uppercase tracking-widest text-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
