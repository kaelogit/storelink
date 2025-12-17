"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StatsGrid from "@/components/admin/StatsGrid";
import SubscriptionBreakdown from "@/components/admin/SubscriptionBreakdown";
import RevenueChart from "@/components/admin/RevenueChart"; 
import RecentStoresTable from "@/components/admin/RecentStoresTable";
import { Loader2, RefreshCcw, Activity, Globe, ShieldCheck, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadStats() {
    setIsRefreshing(true);
    const { data, error } = await supabase.rpc('get_platform_stats');
    if (!error) setStats(data);
    setLoading(false);
    setIsRefreshing(false);
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
        <p className="text-gray-500 font-medium animate-pulse">Synchronizing Global Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Administrative Secure Node</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Platform Intelligence</h2>
          <p className="text-gray-400 mt-1">Real-time performance metrics across the StoreLink ecosystem.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadStats}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-bold transition-all border border-gray-700"
          >
            <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Syncing..." : "Refresh Data"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Systems: Operational</span>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-2xl flex items-center gap-3">
            <Globe className="text-blue-500" size={14} />
            <span className="text-xs font-bold text-blue-500 uppercase tracking-tighter">Region: West Africa (NG)</span>
        </div>
        <div className="bg-purple-500/5 border border-purple-500/20 p-3 rounded-2xl flex items-center gap-3">
            <Activity className="text-purple-500" size={14} />
            <span className="text-xs font-bold text-purple-500 uppercase tracking-tighter">Database: Real-time Sync Active</span>
        </div>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-3xl p-6 backdrop-blur-sm">
           <div className="flex items-center justify-between mb-6">
             <div>
               <h3 className="font-black text-xl text-white italic">StoreLink Revenue Growth</h3>
               <p className="text-xs text-gray-500 uppercase">Monthly Recurring Revenue (MRR)</p>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
               <TrendingUp size={14} className="text-emerald-500"/>
               <span className="text-xs font-bold text-emerald-500">
                 {stats?.estimated_mrr ? `Current MRR: ₦${stats.estimated_mrr.toLocaleString()}` : 'Calculating...'}
               </span>
             </div>
           </div>
           <RevenueChart data={stats?.revenue_history} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xl text-white italic">Plan Earnings</h3>
            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded uppercase">This Month</span>
          </div>
          <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 backdrop-blur-sm h-full">
             <SubscriptionBreakdown stats={stats} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
          <h3 className="font-black text-xl text-white italic">Recent Onboarding</h3>
          <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 backdrop-blur-sm">
             <RecentStoresTable />
          </div>
      </div>
      
      <div className="pt-8 text-center">
        <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">
          StoreLink Proprietary Founder Interface &copy; 2025
        </p>
      </div>
    </div>
  );
}