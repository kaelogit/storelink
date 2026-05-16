"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw, Search } from "lucide-react";

type OrderRow = {
  id: string;
  seller_id?: string;
  user_id?: string;
  status?: string | null;
  payout_status?: string | null;
  total_amount?: number;
  currency_code?: string | null;
  origin_channel?: string | null;
  checkout_mode?: string | null;
  payment_reference?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  store?: { name: string | null; slug: string | null } | null;
  buyer?: {
    id: string;
    email: string | null;
    full_name: string | null;
    display_name: string;
    phone_number?: string | null;
  } | null;
  seller?: {
    id: string;
    email: string | null;
    full_name: string | null;
    display_name: string;
    slug?: string | null;
  } | null;
};

export default function AdminOrdersExplorerPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [qSubmit, setQSubmit] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("offset", String(offset));
      if (qSubmit.trim()) params.set("q", qSubmit.trim());
      const res = await fetch(`/api/admin/orders?${params}`, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || res.statusText);
      setOrders(Array.isArray(json.orders) ? json.orders : []);
      setTotal(Number(json.total) || 0);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Load failed");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [offset, qSubmit]);

  useEffect(() => {
    void load();
  }, [load]);

  function buyerLabel(o: OrderRow) {
    const b = o.buyer;
    return b?.full_name?.trim() || b?.display_name || b?.email || "—";
  }

  function buyerDetail(o: OrderRow) {
    const b = o.buyer;
    return [b?.email, b?.phone_number].filter(Boolean).join(" · ") || "—";
  }

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
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Storefront orders</h1>
          <p className="text-gray-400 mt-2 text-sm font-medium max-w-2xl">
            Only <span className="font-mono text-gray-500">origin_channel = storefront</span>. Search by buyer email or name,
            Paystack reference, shipping text, or order UUID.
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
          className="flex flex-col sm:flex-row flex-1 gap-2 max-w-xl"
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
              placeholder="Search buyer, email, reference, order id…"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest"
          >
            Search
          </button>
        </form>

      {msg && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{msg}</div>
      )}

      <p className="text-[11px] text-gray-500 font-medium">
        Showing {orders.length} of {total.toLocaleString()} matching rows
        {offset > 0 ? ` (offset ${offset})` : ""}
      </p>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-emerald-500" size={36} />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-gray-800 bg-gray-900/40 p-16 text-center text-gray-500 text-sm font-medium">
          No orders for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-gray-800 bg-gray-900/40 shadow-xl">
          <table className="w-full text-left min-w-[1100px]">
            <thead className="border-b border-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-4 py-3 font-black">Order</th>
                <th className="px-4 py-3 font-black">Buyer</th>
                <th className="px-4 py-3 font-black">Seller</th>
                <th className="px-4 py-3 font-black">Storefront</th>
                <th className="px-4 py-3 font-black">Checkout</th>
                <th className="px-4 py-3 font-black">Status</th>
                <th className="px-4 py-3 font-black text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-sm">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-800/25">
                  <td className="px-4 py-3 align-top">
                    <span className="font-mono text-[10px] text-gray-400">{String(o.id).slice(0, 8)}…</span>
                    <span className="block text-[10px] text-gray-600 mt-1">
                      {o.created_at ? new Date(o.created_at).toLocaleString() : ""}
                    </span>
                    {o.payment_reference ? (
                      <span className="block text-[9px] text-gray-500 font-mono mt-0.5 truncate max-w-[140px]">
                        {o.payment_reference}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top text-gray-200">
                    <span className="font-semibold">{buyerLabel(o)}</span>
                    <span className="block text-[10px] text-gray-500 mt-0.5">{buyerDetail(o)}</span>
                  </td>
                  <td className="px-4 py-3 align-top text-gray-300">
                    {o.seller?.full_name?.trim() || o.seller?.display_name || "—"}
                    <span className="block text-[10px] text-gray-500">{o.seller?.email || ""}</span>
                  </td>
                  <td className="px-4 py-3 align-top text-gray-300">
                    {o.store?.name || "—"}
                    {o.store?.slug ? (
                      <span className="block text-[10px] text-gray-500 font-mono">/{o.store.slug}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="text-[10px] font-black uppercase text-gray-400">{o.checkout_mode || "—"}</span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="text-[10px] font-black uppercase text-gray-200">{o.status || "—"}</span>
                    {o.payout_status ? (
                      <span className="block text-[9px] text-amber-400/80 uppercase font-bold mt-0.5">
                        payout {o.payout_status}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top text-right font-black text-emerald-400">
                    {String(o.currency_code || "NGN")} {Number(o.total_amount ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > limit && (
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
