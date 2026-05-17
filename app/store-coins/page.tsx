"use client";

import { useRouter } from "next/navigation";
import { Coins, Zap, Gift, ChevronLeft, ShieldCheck, HandCoins, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

export default function StoreCoinsPage() {
  const router = useRouter();

  return (
    <div className={`flex min-h-dvh flex-col overflow-x-hidden bg-white font-sans selection:bg-amber-100 ${STOREFRONT_SAFE_BOTTOM}`}>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
        <div className={`mx-auto flex max-w-5xl items-center justify-between py-3 ${STOREFRONT_GUTTER_X}`}>
          <button
            onClick={() => router.back()}
            className="flex min-h-[44px] items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-gray-900 transition-all hover:text-amber-500 active:scale-95"
          >
            <ChevronLeft size={18} strokeWidth={3} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Store Coins</span>
          </div>
        </div>
      </nav>

      <main className={`flex-1 ${STOREFRONT_GUTTER_X}`}>
        <header className="pt-28 pb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-amber-200 animate-bounce">
              <Gift size={14} fill="white" />
              <span className="text-[9px] font-black uppercase tracking-widest">₦50 Gift Active</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-[0.95] mb-6 italic">
              Loyalty rewards <br />
              with <span className="text-amber-500">Store Coins.</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-lg font-bold max-w-xl mx-auto leading-relaxed uppercase tracking-tight">
              One wallet. Real perks. Store Coins are StoreLink&apos;s loyalty currency—earn on purchases, spend as discounts at verified stores.
            </p>
          </div>
        </header>

        <section className="relative mx-auto mb-16 max-w-4xl">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-gray-900 p-8 shadow-2xl md:rounded-[3.5rem] md:p-14">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 transform opacity-10">
              <Coins size={300} className="text-amber-500" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter mb-4 leading-tight">
                  Claim your <span className="text-amber-500 underline decoration-amber-500/30">₦50 Start-Up</span> Capital
                </h2>
                <p className="text-gray-400 text-xs md:text-sm mb-8 leading-relaxed font-bold uppercase tracking-wide opacity-80">
                  Every new shopper starts with 50 coins. Sync the phone number on your account to activate your balance in the vault.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href="/account/wallet"
                    className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-95 sm:w-auto"
                  >
                    Enter My Vault <ArrowRight size={16} />
                  </Link>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest">
                    1 Coin = ₦1
                  </div>
                </div>
              </div>
              <div className="bg-amber-500 p-8 rounded-[3rem] text-center shadow-2xl shadow-amber-500/40 min-w-[180px] transform rotate-3">
                <p className="text-amber-900 font-black uppercase text-[10px] tracking-widest mb-1">Your Gift</p>
                <p className="text-5xl font-black text-white tracking-tighter italic">₦50</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex flex-col justify-center">
            <ShieldCheck className="text-amber-600 mb-4" size={32} />
            <h3 className="font-black text-xl text-gray-900 uppercase tracking-tighter mb-3">Instant Spending</h3>
            <p className="text-xs font-bold text-amber-800/70 uppercase leading-relaxed">
              Spend your coins at any verified vendor for an instant discount. To protect our small businesses, discounts are capped at{" "}
              <span className="text-amber-700 underline text-sm">5% of the total order.</span>
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex flex-col justify-center">
            <Lock className="text-emerald-600 mb-4" size={32} />
            <h3 className="font-black text-xl text-gray-900 uppercase tracking-tighter mb-3">PIN Protection</h3>
            <p className="text-xs font-bold text-emerald-800/70 uppercase leading-relaxed">
              Your balance is secured by a <span className="text-emerald-700 underline text-sm">Personal Vault PIN.</span> Only you can authorize coin spending, even if someone else has your phone.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 group">
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-amber-500 transition-colors duration-500 shadow-xl">
                <Zap size={28} fill="currentColor" />
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight italic">01. Earn Daily</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-bold uppercase tracking-tight">
                Shop from verified vendors. The more you support local businesses, the more Store Coins you stack.
              </p>
            </div>

            <div className="space-y-4 group">
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-amber-500 transition-colors duration-500 shadow-xl">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight italic">02. Secure Vault</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-bold uppercase tracking-tight">
                Sync your account phone number and set a 4-digit PIN to protect your Store Coin balance.
              </p>
            </div>

            <div className="space-y-4 group">
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-amber-500 transition-colors duration-500 shadow-xl">
                <HandCoins size={28} />
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight italic">03. Liquid at Checkout</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-bold uppercase tracking-tight">
                Redeem coins in the cart to pay less. Your coins are ready whenever you see the &quot;Apply Coins&quot; toggle.
              </p>
            </div>
          </div>
        </section>

        <section className={`rounded-[3rem] bg-gray-50 py-20 md:rounded-[5rem] mb-20 ${STOREFRONT_GUTTER_X}`}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter text-center mb-12 italic">Intel &amp; Info</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Is there an earning limit?",
                  a: "There is no cap on how many Store Coins you can hold. Every completed eligible purchase adds to your balance.",
                },
                {
                  q: "Do the coins expire?",
                  a: "Store Coins do not expire. They stay in your StoreLink wallet until you use them toward a discount.",
                },
                {
                  q: "Which stores accept coins?",
                  a: "Verified vendors on StoreLink can participate in the loyalty program. Look for the loyalty banner in your bag at checkout.",
                },
                {
                  q: "What is the 5% rule?",
                  a: "To keep the network healthy, you can apply coins for a discount up to 5% of your cart total at any single store.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-black text-gray-900 uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full shrink-0 animate-pulse" /> {item.q}
                  </div>
                  <p className="text-gray-500 text-[11px] font-bold leading-relaxed uppercase tracking-tight opacity-80">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`mx-auto max-w-4xl pb-24 pt-8 text-center ${STOREFRONT_GUTTER_X}`}>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter italic mb-6">
            Ready to <span className="text-amber-500">save more?</span>
          </h2>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-10 max-w-md mx-auto leading-relaxed">
            Open your secure vault and claim your starting balance today.
          </p>
          <Link
            href="/account/wallet"
            className="inline-flex min-h-[52px] items-center gap-4 rounded-[2rem] bg-gray-900 px-12 py-6 text-xs font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-gray-200 transition-all hover:bg-amber-500 active:scale-95"
          >
            Open My Wallet <ArrowRight size={20} />
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white py-16 text-center">
        <div className={`mx-auto max-w-5xl ${STOREFRONT_GUTTER_X}`}>
          <div className="flex flex-col items-center gap-6">
            <div className="bg-gray-900 text-white p-4 rounded-3xl shadow-xl shadow-gray-200 transform hover:scale-110 transition-transform">
              <Coins size={32} fill="currentColor" className="text-amber-500" />
            </div>
            <div>
              <span className="font-black text-xs uppercase tracking-[0.3em] text-gray-900">StoreLink Store Coins</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest italic">Loyalty built for the next generation of Nigerian commerce</p>
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-12 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-amber-500 transition-colors">
              Marketplace
            </Link>
            <Link href="/terms" className="hover:text-amber-500 transition-colors">
              Terms of Use
            </Link>
          </div>

          <p className="text-[9px] font-bold text-gray-200 uppercase tracking-[0.5em] mt-12">Infrastructure by StoreLink™ • 2026</p>
        </div>
      </footer>
    </div>
  );
}
