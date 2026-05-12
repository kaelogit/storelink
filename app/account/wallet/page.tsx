"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Loader2, Coins, ArrowRight, History } from "lucide-react";
import { fetchStoreCoinBalanceDisplay } from "@/lib/coinBalance";
import { classifyCoinTransaction } from "@/utils/coinTransactionDisplay";

export default function AccountWalletPage() {
  const [loading, setLoading] = useState(true);
  const [coinBalance, setCoinBalance] = useState<number>(0);
  const [currencyCode, setCurrencyCode] = useState("NGN");
  const [usedLedgerFallback, setUsedLedgerFallback] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txErr, setTxErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [{ balance, currencyCode: cur, usedLedgerFallback: ledgerFb }, txRes] = await Promise.all([
      fetchStoreCoinBalanceDisplay(supabase, user.id),
      supabase
        .from("coin_transactions")
        .select("id, amount, type, description, created_at")
        .eq("user_id", user.id)
        .neq("type", "ORDER_PAYMENT")
        .order("created_at", { ascending: false })
        .limit(40),
    ]);

    setCoinBalance(balance);
    setCurrencyCode(cur);
    setUsedLedgerFallback(ledgerFb);

    if (txRes.error) setTxErr("Couldn’t load transaction history right now. Try again in a moment.");
    else {
      setTxErr(null);
      setTransactions(txRes.data || []);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Wallet &amp; rewards</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">
          Store Coins on your StoreLink profile — earn when you shop and spend at checkout where loyalty is enabled.
        </p>
      </div>

      <div className="rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-500 to-amber-600 p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Coins size={28} className="opacity-90" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-90">Store Coins</span>
        </div>
        <p className="text-4xl font-black tracking-tight">{coinBalance.toLocaleString()}</p>
        <p className="text-xs font-bold opacity-90 mt-2">≈ {currencyCode} loyalty balance (1 coin ≈ ₦1 when redeemed)</p>
        {usedLedgerFallback && (
          <p className="text-[10px] font-bold opacity-90 mt-3 leading-relaxed border-t border-white/20 pt-3">
            Figure matches your coin activity on this account (profile field was empty or zero while the ledger had movement).
          </p>
        )}
      </div>

      <Link
        href="/store-coins"
        className="flex items-center justify-between rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-200 transition group"
      >
        <div>
          <p className="font-black text-gray-900 uppercase tracking-tight text-sm">How Store Coins work</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Earn on purchases, spend at verified stores.</p>
        </div>
        <ArrowRight className="text-emerald-600 group-hover:translate-x-1 transition-transform" size={20} />
      </Link>

      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <History size={14} /> Recent activity
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Earned
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Spent
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Refund
            </span>
          </div>
        </div>
        {txErr && <p className="text-xs text-amber-900 font-medium bg-amber-50 border border-amber-100 rounded-xl p-4">{txErr}</p>}
        {!txErr && transactions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500 font-medium">
            No reward transactions yet. Coins from purchases and promotions will show here.
          </div>
        )}
        <ul className="space-y-2">
          {transactions.map((t) => {
            const { kind, displayAmount } = classifyCoinTransaction(t);
            const abs = Math.abs(displayAmount);
            const amountClass =
              kind === "spend"
                ? "text-red-600"
                : kind === "refund"
                  ? "text-amber-600"
                  : "text-emerald-600";
            const rowTint =
              kind === "spend"
                ? "border-red-100 bg-red-50/40"
                : kind === "refund"
                  ? "border-amber-100 bg-amber-50/50"
                  : "border-gray-100 bg-white";
            const badge =
              kind === "spend" ? (
                <span className="text-[9px] font-black uppercase tracking-wider text-red-700 bg-red-100/80 px-2 py-0.5 rounded-md shrink-0">
                  Spent
                </span>
              ) : kind === "refund" ? (
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md shrink-0">
                  Refund
                </span>
              ) : (
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                  Earned
                </span>
              );

            return (
              <li
                key={t.id}
                className={`rounded-xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm ${rowTint}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 truncate">{t.description || t.type || "Transaction"}</p>
                    {badge}
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">{new Date(t.created_at).toLocaleString()}</p>
                </div>
                <span className={`font-black shrink-0 text-right text-lg tabular-nums ${amountClass}`}>
                  {displayAmount > 0 ? "+" : displayAmount < 0 ? "−" : ""}
                  {abs.toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
