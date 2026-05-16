"use client";

import Link from "next/link";
import { Sparkles, Rocket, ShieldCheck, ArrowRight } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function ComingSoonCountdown() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-24 md:py-32" aria-labelledby="whats-next-heading">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          
          {/* Left — headline + pitch */}
          <div>
            <SectionHeader
              eyebrow="On the horizon"
              headline={
                <>
                  Storefront today.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                    Richer discovery tomorrow.
                  </span>
                </>
              }
              description="We're perfecting the foundation: your shop link, your catalog, and a checkout that works. As StoreLink grows, new ways for buyers to find you—without changing a thing."
              align="left"
            />

            <p className="mt-6 text-sm text-gray-400 leading-relaxed max-w-md border-l-2 border-emerald-200 pl-4">
              Ship on time. Keep your shop sharp. Your reputation puts you first when the next wave arrives.
            </p>
          </div>

          {/* Right — feature cards stacked */}
          <div className="flex flex-col gap-4">
            
            {/* Seller card */}
            <div className="group relative rounded-3xl border border-gray-200 bg-white p-8 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="shrink-0 h-12 w-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center transition-all duration-500 group-hover:bg-emerald-600 group-hover:scale-110 group-hover:rotate-3">
                  <Rocket className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">For Sellers</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    Make StoreLink your home base
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Your products will appear where people already scroll. Keep your shop ready for the spotlight.
                  </p>
                </div>
              </div>
            </div>

            {/* Buyer card */}
            <div className="group relative rounded-3xl border border-gray-200 bg-white p-8 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="shrink-0 h-12 w-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center transition-all duration-500 group-hover:bg-blue-600 group-hover:scale-110 group-hover:rotate-3">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">For Buyers</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                    Secure checkout + discovery
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Order history you can trust. More ways to find brands worth buying from.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA card — dark */}
            <div className="group relative rounded-3xl bg-gray-900 p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Start building today
                </p>
                <p className="text-lg font-bold leading-tight mb-6">
                  The marketplace is live. Your storefront is ready. We'll keep shipping while you build.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-emerald-50 transition-all group/btn"
                >
                  Create your shop
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}