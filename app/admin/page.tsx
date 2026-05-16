"use client";

import { useEffect, useState } from "react";
import StorefrontStatsGrid from "@/components/admin/StorefrontStatsGrid";
import { AdminFullSnapshot, AdminRecentActivity, AdminStorefrontPulseGrid } from "@/components/admin/AdminSnapshotPanels";
import { Loader2, RefreshCcw, ShieldCheck, Banknote, AlertTriangle, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [overview, setOverview] = useState<AdminFullSnapshot | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadStats() {
    setIsRefreshing(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/snapshot", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || res.statusText);
      setOverview(data as AdminFullSnapshot);
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : "Failed to load overview");
      setOverview(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    void loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
        <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Loading storefront snapshot…</p>
      </div>
    );
  }

  if (loadError || !overview) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-10 text-center space-y-4">
        <p className="text-red-200 font-medium">{loadError || "No data"}</p>
        <button
          type="button"
          onClick={() => void loadStats()}
          className="px-6 py-3 bg-gray-900 border border-gray-700 rounded-xl text-xs font-black uppercase tracking-widest text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const payoutSummary = overview.payoutSummary;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Storefront admin</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Storefront operations</h2>
          <p className="text-gray-400 mt-1 text-sm font-medium max-w-2xl">
            Metrics and tools for the public storefront only (<span className="font-mono text-gray-500">origin_channel = storefront</span>).
            Mobile app and other channels use separate admin surfaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void loadStats()}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-gray-800 shadow-xl"
          >
            <RefreshCcw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Syncing…" : "Refresh"}
          </button>
        </div>
      </div>

      {payoutSummary.failed > 0 && (
        <Link href="/admin/payouts?filter=failed" className="block group">
          <div className="bg-gradient-to-r from-amber-600/25 to-red-900/20 border border-amber-500/30 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 hover:border-amber-500/50 transition-all shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <AlertTriangle className="text-white" size={30} />
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Storefront payouts</p>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  {payoutSummary.failed} failed{" "}
                  <span className="text-gray-400 text-sm font-bold normal-case not-italic">
                    — Paystack balance / recipient
                  </span>
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase bg-amber-400 px-4 py-2 rounded-full tracking-widest group-hover:translate-x-2 transition-transform">
              Review <Banknote size={12} />
            </div>
          </div>
        </Link>
      )}

      {payoutSummary.failed === 0 && payoutSummary.payoutQueued > 0 && (
        <Link href="/admin/payouts?filter=queued" className="block group">
          <div className="bg-gray-900/60 border border-gray-700 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3">
              <Banknote className="text-emerald-400 shrink-0" size={20} />
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Payout queue</p>
                <p className="text-sm font-bold text-gray-200 mt-0.5">
                  {payoutSummary.payoutQueued} storefront order{payoutSummary.payoutQueued === 1 ? "" : "s"} awaiting transfer
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest group-hover:underline">View →</span>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Scoped to storefront checkout</span>
        </div>
        <div className="bg-purple-500/5 border border-purple-500/10 p-4 rounded-2xl flex items-center gap-3">
          <Activity className="text-purple-500" size={14} />
          <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">
            Buyer tools use the same profile table; order metrics stay storefront-only
          </span>
        </div>
      </div>

      <AdminStorefrontPulseGrid snap={overview} />
      <StorefrontStatsGrid
        sellers={overview.people.sellers}
        listingsTotal={overview.catalog.listingsTotal}
        listingsActive={overview.catalog.listingsActive}
        listingsActiveQueryFailed={overview.catalog.listingsActiveQueryFailed}
        platformFeesNgn={overview.storefront.platformFeesNgn}
        gmvNgn={overview.storefront.gmvNgn}
        platformFeesNote={overview.storefront.platformFeesNote}
      />

      {overview.storefront.platformFeesNote && (
        <p className="text-[11px] text-amber-200/90 font-medium border border-amber-500/20 bg-amber-500/5 rounded-xl px-3 py-2">
          {overview.storefront.platformFeesNote}
        </p>
      )}


      <div className="pt-12 text-center">
        <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] opacity-50">StoreLink storefront admin · 2026</p>
      </div>
    </div>
  );
}
