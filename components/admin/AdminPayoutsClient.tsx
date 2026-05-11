"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, RefreshCw, AlertTriangle, Banknote, ArrowLeft } from "lucide-react";

type AdminOrderRow = {
  id: string;
  seller_id?: string | null;
  status?: string | null;
  payout_status?: string | null;
  payout_eligible_at?: string | null;
  payout_error_log?: string | null;
  payout_retry_count?: number | null;
  payment_reference?: string | null;
  total_amount?: number | null;
  currency_code?: string | null;
  origin_channel?: string | null;
  guest_name?: string | null;
  guest_email?: string | null;
  is_guest_checkout?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  store?: { name: string | null; slug: string | null } | null;
};

const filters = [
  { id: "pipeline", label: "Needs attention" },
  { id: "failed", label: "Failed payouts" },
  { id: "queued", label: "Queued transfers" },
  { id: "settlement", label: "Storefront · PAID (settlement)" },
] as const;

function isFilterId(v: string | null): v is (typeof filters)[number]["id"] {
  return v != null && filters.some((f) => f.id === v);
}

export default function AdminPayoutsClient() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("pipeline");
  const syncedFilterFromUrl = useRef(false);

  useEffect(() => {
    if (syncedFilterFromUrl.current) return;
    syncedFilterFromUrl.current = true;
    const q = searchParams.get("filter");
    if (isFilterId(q)) setFilter(q);
  }, [searchParams]);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/order-payouts?filter=${encodeURIComponent(filter)}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || res.statusText);
      setOrders(Array.isArray(json.orders) ? json.orders : []);
    } catch (e: unknown) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Load failed" });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const retry = async (orderId: string) => {
    if (!confirm("Re-queue this order for Paystack payout? Top up Paystack balance first if it failed for insufficient funds.")) return;
    setRetryingId(orderId);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/order-payouts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || res.statusText);
      setMsg({ type: "ok", text: json.message || "Re-queued." });
      await load();
    } catch (e: unknown) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Retry failed" });
    } finally {
      setRetryingId(null);
    }
  };

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
          <div className="flex items-center gap-3 text-emerald-500 mb-1">
            <Banknote size={22} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Settlement · Paystack</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Storefront payouts</h1>
          <p className="text-gray-400 mt-2 text-sm font-medium max-w-xl">
            <span className="font-mono text-gray-500">origin_channel = storefront</span> only. Rows here failed Paystack transfer, are queued after completion, or are PAID and still settling.
            Re-queue sets <span className="text-gray-200 font-bold">payout_status</span> to <span className="text-gray-200 font-bold">pending</span> with a fresh{" "}
            <span className="text-gray-200 font-bold">payout_eligible_at</span> for the payout worker.
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

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
        <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
        <p className="text-xs text-amber-100/90 font-medium leading-relaxed">
          This panel uses the service role server-side only after admin login. Retries do not deduct buyer balances again — they only re-attempt the seller transfer.
          Ensure Paystack ledger balance and recipient codes are valid before retrying.
        </p>
      </div>

      {msg && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            msg.type === "ok"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition border ${
              filter === f.id
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                : "bg-gray-900/50 border-gray-800 text-gray-500 hover:text-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-emerald-500" size={36} />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-gray-800 bg-gray-900/40 p-16 text-center text-gray-500 font-medium text-sm">
          No rows for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-gray-800 bg-gray-900/40 shadow-xl">
          <table className="w-full text-left min-w-[960px]">
            <thead className="border-b border-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-5 py-4 font-black">Order</th>
                <th className="px-5 py-4 font-black">Store</th>
                <th className="px-5 py-4 font-black">Status</th>
                <th className="px-5 py-4 font-black">Payout</th>
                <th className="px-5 py-4 font-black">Amount</th>
                <th className="px-5 py-4 font-black">Channel</th>
                <th className="px-5 py-4 font-black">Error / notes</th>
                <th className="px-5 py-4 font-black text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80">
              {orders.map((o) => {
                const canRetry = ["failed", "retry_queued"].includes(String(o.payout_status || "").toLowerCase());
                return (
                  <tr key={o.id} className="text-sm hover:bg-gray-800/30">
                    <td className="px-5 py-4 font-mono text-[10px] text-gray-400">
                      #{String(o.id).slice(0, 8)}
                      <span className="block text-gray-600 mt-1 normal-case">
                        {o.guest_name || o.guest_email || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-300 font-medium">
                      {o.store?.name || "—"}
                      {o.store?.slug ? (
                        <span className="block text-[10px] text-gray-500 font-mono mt-0.5">/{o.store.slug}</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-black uppercase text-gray-300">{o.status || "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-black uppercase text-amber-400/90">{o.payout_status || "—"}</span>
                      {o.payout_eligible_at ? (
                        <span className="block text-[10px] text-gray-500 mt-1">
                          Eligible: {new Date(o.payout_eligible_at).toLocaleString()}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 font-black text-emerald-400">
                      {String(o.currency_code || "NGN")}{" "}
                      {Number(o.total_amount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-[10px] text-gray-500 uppercase font-bold">{o.origin_channel || "—"}</td>
                    <td className="px-5 py-4 text-[11px] text-gray-400 max-w-[280px]">
                      <span className="line-clamp-4 whitespace-pre-wrap">{o.payout_error_log || "—"}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {canRetry ? (
                        <button
                          type="button"
                          disabled={retryingId === o.id}
                          onClick={() => retry(o.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                        >
                          {retryingId === o.id ? "…" : "Retry payout"}
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-600 font-bold uppercase">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
