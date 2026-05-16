"use client";

import { Sparkles, MessageCircle, Store, BadgeCheck, ArrowUpRight } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import SectionHeader from "./SectionHeader";

const segments = [
  {
    title: "From Influence to Ownership",
    body: "Turn your audience into customers. Launch a storefront and automate checkout — no tech skills needed.",
    Icon: Sparkles,
    stat: "2.4x",
    statLabel: "revenue lift",
  },
  {
    title: "Standardized Operations",
    body: "Stop selling in chat logs. Centralize inventory, set flat rates, accept secure orders.",
    Icon: MessageCircle,
    stat: "10min",
    statLabel: "to launch",
  },
  {
    title: "Creators & Retailers",
    body: "The link-in-bio shop. Mobile-first shopping for followers + marketplace exposure.",
    Icon: Store,
    stat: "50K+",
    statLabel: "monthly reach",
  },
  {
    title: "Established & Verified",
    body: "Enterprise-grade for high-volume merchants. Verified badges, elite positioning.",
    Icon: BadgeCheck,
    stat: "99.9%",
    statLabel: "uptime",
  },
];

export default function SellerSegments() {
  return (
    <section
      className={`relative overflow-hidden bg-white py-16 md:py-24 ${STOREFRONT_GUTTER_X}`}
      aria-labelledby="seller-segments-heading"
    >
      <div className="relative max-w-7xl mx-auto">
        
        <SectionHeader
          eyebrow="Who it's for"
          headline={
            <>
              Built for every stage of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                growth
              </span>
            </>
          }
          description="Starting out or scaling up — StoreLink adapts."
          align="center"
        />

        {/* Cards — no stagger on mobile, single column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
          {segments.map(({ title, body, Icon, stat, statLabel }, i) => (
            <div
              key={title}
              className={`group relative rounded-2xl md:rounded-3xl border border-gray-100 bg-gray-50/30 p-6 md:p-8 transition-all duration-500 ease-out hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 ${i % 2 === 1 ? 'md:translate-y-6' : ''}`}
            >
              <div className="relative flex items-start justify-between mb-5">
                <div className="inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-gray-900 text-white transition-all duration-500 group-hover:bg-emerald-600 group-hover:scale-110">
                  <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-all" />
              </div>

              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {body}
              </p>

              <div className="flex items-baseline gap-2 pt-4 border-t border-gray-100 group-hover:border-emerald-100 transition-colors">
                <span className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {stat}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {statLabel}
                  </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}