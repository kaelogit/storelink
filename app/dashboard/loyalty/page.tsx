"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Coins,
  ShieldCheck,
  Info,
  Loader2,
  ArrowUpRight,
  LineChart,
  Users,
} from "lucide-react";
import { orderCountsTowardSellerRevenue } from "@/lib/sellerOrderPayoutFlow";

type SellerProfile = {
  id: string;
  loyalty_enabled: boolean | null;
  loyalty_percentage: number | null;
};

export default function LoyaltyPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<SellerProfile | null>(null);

  const [stats, setStats] = useState({
    issued: 0,
    redeemed: 0,
    customers: 0,
  });

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  async function fetchProfileAndStats() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profileRow } = await supabase
      .from("profiles")
      .select("id, loyalty_enabled, loyalty_percentage")
      .eq("id", user.id)
      .maybeSingle();

    if (profileRow) {
      setProfile({
        ...profileRow,
        loyalty_enabled: profileRow.loyalty_enabled === true,
        loyalty_percentage: profileRow.loyalty_percentage ?? null,
      });

      const { data: orders, error: ordersErr } = await supabase
        .from("orders")
        .select("id, user_id, guest_phone, total_amount, coin_redeemed, status")
        .eq("seller_id", user.id);

      if (ordersErr) {
        console.warn("Loyalty stats — orders:", ordersErr.message);
      }

      const pct = Number(profileRow.loyalty_percentage) || 0;
      const rewardRows = (orders || []).filter((o) => orderCountsTowardSellerRevenue(o.status));

      const redeemed = rewardRows.reduce((sum, o) => sum + Number(o.coin_redeemed ?? 0), 0);

      /** Same formula as loyalty grant: Σ floor(order total × reward % ÷ 100) on qualifying orders. */
      const issued =
        pct > 0
          ? rewardRows.reduce((sum, o) => {
              const cash = Number(o.total_amount || 0);
              return sum + Math.floor((cash * pct) / 100);
            }, 0)
          : 0;

      const customerKeys = rewardRows
        .map((o) => {
          const row = o as { user_id?: string | null; guest_phone?: string | null };
          if (row.user_id) return `u:${row.user_id}`;
          if (row.guest_phone) return `p:${String(row.guest_phone).trim()}`;
          return "";
        })
        .filter(Boolean);

      setStats({
        redeemed,
        issued,
        customers: new Set(customerKeys).size,
      });
    }
    setLoading(false);
  }

  const toggleLoyalty = async (enabled: boolean) => {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({ loyalty_enabled: enabled }).eq("id", profile.id);
    setProfile({ ...profile, loyalty_enabled: enabled });
    setSaving(false);
  };

  const updatePercentage = async (percent: number) => {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({ loyalty_percentage: percent }).eq("id", profile.id);
    setProfile({ ...profile, loyalty_percentage: percent });
    setSaving(false);
    await fetchProfileAndStats();
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl px-1 pb-20 md:px-0">
        <p className="text-gray-600 text-sm">Sign in as a seller to manage loyalty rewards.</p>
      </div>
    );
  }

  const loyaltyEnabled = profile.loyalty_enabled === true;
  const loyaltyPct = profile.loyalty_percentage ?? 1;

  return (
    <div className="max-w-4xl space-y-6 md:space-y-8 pb-20 px-1 md:px-0">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase flex items-center justify-center md:justify-start gap-3">
          <Coins className="text-amber-500 shrink-0" size={32} fill="currentColor" /> Store Coin loyalty
        </h1>
        <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">
          Grow your business by rewarding your community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-50 p-2 rounded-xl text-amber-600">
              <LineChart size={20} />
            </div>
            <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-widest">
              Retention
            </span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reward volume</p>
          <h4 className="text-2xl font-black text-gray-900 tracking-tight">₦{stats.issued.toLocaleString()}</h4>
          <p className="text-[9px] font-bold text-gray-400 mt-1">
            Your reward rate applied to every qualifying order total.
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
              <ArrowUpRight size={20} />
            </div>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">
              Active Spend
            </span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Actual Discounts Used</p>
          <h4 className="text-2xl font-black text-gray-900 tracking-tight">₦{stats.redeemed.toLocaleString()}</h4>
          <p className="text-[9px] font-bold text-gray-400 mt-1">Real impact on your bottom line.</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm sm:col-span-2 md:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Returning buyers</p>
          <h4 className="text-2xl font-black text-gray-900 tracking-tight">{stats.customers}</h4>
          <p className="text-[9px] font-bold text-gray-400 mt-1">Customers tied to your ecosystem.</p>
        </div>
      </div>

      <div
        className={`p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border-2 transition-all duration-500 ${
          loyaltyEnabled ? "bg-white border-amber-200 shadow-xl shadow-amber-50" : "bg-gray-50 border-gray-100"
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-md">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">
              {loyaltyEnabled ? "Loyalty: Active" : "Loyalty: Off"}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
              When enabled, customers earn coins on every purchase. These coins act as cash discounts (capped at 15%
              per order) in any store in the StoreLink network.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleLoyalty(!loyaltyEnabled)}
            disabled={saving}
            className={`relative inline-flex h-10 md:h-12 w-20 md:w-24 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
              loyaltyEnabled ? "bg-amber-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-6 md:h-8 w-6 md:w-8 transform rounded-full bg-white transition-transform ${
                loyaltyEnabled ? "translate-x-12 md:translate-x-14" : "translate-x-2"
              }`}
            />
          </button>
        </div>

        {loyaltyEnabled && (
          <div className="mt-8 pt-8 md:mt-10 md:pt-10 border-t border-amber-100 animate-in slide-in-from-top-4 duration-500">
            <h3 className="font-black text-[10px] md:text-xs text-amber-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <LineChart size={14} /> Set Reward Percentage
            </h3>

            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {[1, 2, 5].map((percent) => (
                <button
                  key={percent}
                  type="button"
                  onClick={() => updatePercentage(percent)}
                  disabled={saving}
                  className={`py-4 md:py-6 px-2 rounded-2xl md:rounded-[2rem] border-2 transition-all ${
                    loyaltyPct === percent
                      ? "border-amber-500 bg-amber-50 text-amber-600 shadow-inner"
                      : "border-gray-100 bg-white text-gray-400 hover:border-amber-200"
                  }`}
                >
                  <p className="text-xl md:text-3xl font-black">{percent}%</p>
                  <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1">Reward</p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
              <Info className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <p className="text-[11px] md:text-xs text-amber-700 font-medium leading-relaxed">
                We recommend <span className="font-bold">2%</span> for high-frequency stores (Food) and{" "}
                <span className="font-bold">5%</span> for premium luxury goods.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="p-5 md:p-6 bg-emerald-50 rounded-[2rem] md:rounded-[2.5rem] border border-emerald-100 flex items-start gap-4">
          <div className="bg-white p-2.5 md:p-3 rounded-2xl text-emerald-600 shadow-sm shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-black text-emerald-900 uppercase text-[10px] md:text-xs tracking-tight mb-1">
              Retention Shield
            </h4>
            <p className="text-emerald-700/70 text-[10px] md:text-[11px] leading-relaxed">
              Customers are more likely to return when they still have unspent Store Coins in their wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
