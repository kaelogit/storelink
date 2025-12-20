"use client";

import { useRouter } from "next/navigation";
import { 
  Coins, 
  Zap, 
  Gift, 
  ChevronRight, 
  CheckCircle2,
  TrendingUp,
  ChevronLeft,
  Info,
  ShieldCheck,
  HandCoins,
  History
} from "lucide-react";
import Link from "next/link";

export default function EmpireManual() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-amber-100 flex flex-col overflow-x-hidden">
      
      {/* 1. FIXED NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1 text-gray-900 font-black uppercase text-[10px] tracking-tighter hover:text-amber-500 transition-all active:scale-95"
          >
            <ChevronLeft size={18} strokeWidth={3} />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Empire Manual</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 px-4 sm:px-6">
        {/* 2. HERO SECTION - RESPONSIVE TYPOGRAPHY */}
        <header className="pt-28 pb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-amber-200 animate-bounce">
              <Gift size={14} fill="white" />
              <span className="text-[9px] font-black uppercase tracking-widest">₦50 Gift Active</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-[0.95] mb-6 italic">
              Digital Gold <br />for the <span className="text-amber-500">Empire.</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-lg font-bold max-w-xl mx-auto leading-relaxed uppercase tracking-tight">
              One wallet. Infinite rewards. Empire Coins are the global currency of the StoreLink social network.
            </p>
          </div>
        </header>

        {/* 3. CLAIM CARD */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden border border-white/5">
             <div className="absolute top-0 right-0 opacity-10 transform translate-x-12 -translate-y-12">
                <Coins size={300} className="text-amber-500" />
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 text-center md:text-left">
                   <h2 className="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter mb-4 leading-tight">
                     Claim your <span className="text-amber-500 underline decoration-amber-500/30">₦50 Start-Up</span> Capital
                   </h2>
                   <p className="text-gray-400 text-xs md:text-sm mb-8 leading-relaxed font-bold uppercase tracking-wide opacity-80">
                     Every new Patrons starts with 50 Coins. Sync your WhatsApp number in the Global Cart to activate your balance instantly.
                   </p>
                   <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest">
                         1 Coin = ₦1
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                         Global Sync
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

        {/* 4. THE RULES (15% CAP & VENDOR SYNC) */}
        <section className="py-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex flex-col justify-center">
              <ShieldCheck className="text-amber-600 mb-4" size={32} />
              <h3 className="font-black text-xl text-gray-900 uppercase tracking-tighter mb-3">Instant Spending</h3>
              <p className="text-xs font-bold text-amber-800/70 uppercase leading-relaxed">
                Spend your coins at any verified vendor for an instant discount. To protect our small businesses, discounts are capped at <span className="text-amber-700 underline text-sm">15% of the total order.</span>
              </p>
           </div>
           <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex flex-col justify-center">
              <History className="text-emerald-600 mb-4" size={32} />
              <h3 className="font-black text-xl text-gray-900 uppercase tracking-tighter mb-3">Secured Earning</h3>
              <p className="text-xs font-bold text-emerald-800/70 uppercase leading-relaxed">
                When you buy, potential coins are reserved. They are only added to your "Global Balance" <span className="text-emerald-700 underline text-sm">after the vendor confirms payment.</span> Genuine hustle only.
              </p>
           </div>
        </section>

        {/* 5. 3-STEP PROCESS */}
        <section className="py-20 px-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 group">
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-amber-500 transition-colors duration-500 shadow-xl">
                <Zap size={28} fill="currentColor" />
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight italic">01. Earn Daily</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-bold uppercase tracking-tight">
                Shop from verified Naija vendors. The more you support local businesses, the more digital gold you stack.
              </p>
            </div>

            <div className="space-y-4 group">
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-amber-500 transition-colors duration-500 shadow-xl">
                <TrendingUp size={28} />
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight italic">02. Auto-Sync</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-bold uppercase tracking-tight">
                No passwords required. Your WhatsApp number is your secure vault. Your balance follows you across every store on the network.
              </p>
            </div>

            <div className="space-y-4 group">
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-amber-500 transition-colors duration-500 shadow-xl">
                <HandCoins size={28} />
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight italic">03. Liquid Cash</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-bold uppercase tracking-tight">
                Redeem coins in the cart to pay less. Your coins are liquid and ready to use whenever you see the "Apply Discount" pill.
              </p>
            </div>
          </div>
        </section>

        {/* 6. COMMON QUESTIONS */}
        <section className="py-20 bg-gray-50 rounded-[3rem] md:rounded-[5rem] px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter text-center mb-12 italic">Intel & Info</h2>
            <div className="space-y-4">
              {[
                { q: "Is there an earning limit?", a: "The sky is the limit. Every completed purchase adds to your empire. There is no cap on your total balance." },
                { q: "Do the coins expire?", a: "Empire Coins never expire. They stay in your WhatsApp-linked vault forever until you decide to cash out for a discount." },
                { q: "Which stores accept coins?", a: "Every Premium and Diamond verified vendor on StoreLink supports the Empire Economy. Check for the gold badge!" },
                { q: "What is the 15% rule?", a: "To keep the network healthy, you can apply coins for a discount up to 15% of your cart's total value at any single store." }
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
      </main>

      {/* 7. FOOTER */}
      <footer className="py-16 border-t border-gray-100 bg-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col items-center gap-6">
             <div className="bg-gray-900 text-white p-4 rounded-3xl shadow-xl shadow-gray-200 transform hover:scale-110 transition-transform">
               <Coins size={32} fill="currentColor" className="text-amber-500" />
             </div>
             <div>
               <span className="font-black text-xs uppercase tracking-[0.3em] text-gray-900">StoreLink Empire Economy</span>
               <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest italic">Built for the next generation of Naija Commerce</p>
             </div>
          </div>
          
          <div className="flex justify-center gap-8 mt-12 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-amber-500 transition-colors">Marketplace</Link>
            <Link href="/terms" className="hover:text-amber-500 transition-colors">Terms of Use</Link>
          </div>

          <p className="text-[9px] font-bold text-gray-200 uppercase tracking-[0.5em] mt-12">
            Infrastructure by StoreLink™ • 2025
          </p>
        </div>
      </footer>
    </div>
  );
}