"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, Rocket, ShieldCheck, Star, Video, TrendingUp, Lock } from "lucide-react";

/** Fixed launch moment (~90 days from roadmap messaging). Adjust if the ship date moves. */
const LAUNCH_DATE = new Date("2026-08-10T00:00:00+01:00").getTime();

type Clock = { days: number; hours: number; minutes: number; seconds: number };

function computeClock(msLeft: number): Clock {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function ComingSoonCountdown() {
  const [isMounted, setIsMounted] = useState(false);
  const [clock, setClock] = useState<Clock>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setIsMounted(true);
    setClock(computeClock(LAUNCH_DATE - Date.now()));

    const id = setInterval(() => {
      setClock(computeClock(LAUNCH_DATE - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Prevent hydration mismatch in Next.js
  if (!isMounted) return null;

  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto rounded-[2.5rem] md:rounded-[3rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-8 md:p-12 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 lg:items-stretch">
          
          {/* Left Column - The Vision & Timer */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full mb-6">
              <Megaphone size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Roadmap</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-[0.95]">
              Social Commerce <span className="text-emerald-600">Without Fear.</span>
            </h2>

            <div className="grid grid-cols-4 gap-3 mt-7 max-w-lg">
              {[
                { label: "Days", value: clock.days },
                { label: "Hours", value: clock.hours },
                { label: "Min", value: clock.minutes },
                { label: "Secs", value: clock.seconds },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-200 bg-white px-3 py-4 text-center shadow-sm">
                  <p className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{pad(item.value)}</p>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-6 max-w-2xl">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">The StoreLink Vision</p>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  Today, e-commerce means scrolling on one app, DMing for a price, and praying you don't get scammed. 
                  <strong className="text-gray-900"> StoreLink Social Commerce</strong> fixes this. We are building one unified feed 
                  where you can watch Shoppable Reels, discover trending items, and checkout instantly—all secured by <strong className="text-emerald-700">The Vault</strong> escrow system.
                </p>
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">What is coming</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Video size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">Shoppable Reels</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Watch products in motion. See the quality and the face behind the brand before you buy.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Star size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">Spotlight</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        When a buyer posts a video and tags the seller they bought from on StoreLink, that moment enters Spotlight — real entertainment for the audience.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">Market Pulse</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Live trends showing what people are watching, saving, and buying across the StoreLink network.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 flex gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">One-Click Vault</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        From "I like this" to "I paid" in one app. Your money stays frozen in The Vault until the item arrives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - For Sellers & Buyers */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Rocket size={14} className="text-emerald-600" /> If you sell: Prepare for Discovery
              </p>
              <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                When Social Commerce launches, your current <strong className="text-gray-900">StoreLink profile</strong> automatically becomes your network hub. 
                Strangers will find your products via the feed, not just your bio link. Sellers who are actively building their catalog, processing Vault orders, and collecting reviews <i>today</i> will be pushed to the top of the feed <i>tomorrow</i>.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <ShieldCheck size={14} className="text-amber-500" /> If you buy: The End of "What I Ordered vs Got"
              </p>
              <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                No more begging for refunds or wiring money to an unverified seller you only know from a DM. You will be able to follow shops, save items, and pay without leaving the feed. 
                If the product isn't right, a single click freezes the payment. Social commerce shouldn't be a gamble.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-700 flex items-center gap-2">
                <ShieldCheck size={14} /> Start Building Your Reputation Today
              </p>
              <p className="text-sm text-emerald-900/80 mt-2 leading-relaxed font-medium">
                The massive social feed is coming, but the Storefronts and the Vault are live right now.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/sell"
                  className="inline-flex items-center rounded-xl bg-gray-900 text-white px-5 py-3 text-[11px] font-black uppercase tracking-wider hover:bg-emerald-600 transition shadow-md"
                >
                  Create Your Storefront
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-xl border border-gray-300 bg-white text-gray-900 px-5 py-3 text-[11px] font-black uppercase tracking-wider hover:border-emerald-500 hover:text-emerald-700 transition"
                >
                  Browse Current Shops
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}