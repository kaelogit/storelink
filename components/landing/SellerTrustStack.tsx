"use client";

import { Receipt, CreditCard, ClipboardList, Shield, ArrowUpRight, Lock, FileCheck, Zap } from "lucide-react";
import { useRef } from "react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import SectionHeader from "./SectionHeader";

const pillars = [
  {
    title: "Structured checkout",
    body: "No more 'send proof' loops. Buyers pay, you ship. Clean record, both sides.",
    Icon: CreditCard,
    color: "bg-blue-600",
    light: "bg-blue-50",
    text: "text-blue-600",
    glow: "shadow-blue-500/30",
    tag1: { label: "Instant payout", bg: "bg-blue-50", text: "text-blue-700" },
    tag2: { label: "SSL secured", bg: "bg-gray-100", text: "text-gray-600" },
  },
  {
    title: "Defend your orders",
    body: "One timeline for every order. Refunds, disputes, fulfillment — no screenshot archaeology.",
    Icon: ClipboardList,
    color: "bg-amber-500",
    light: "bg-amber-50",
    text: "text-amber-600",
    glow: "shadow-amber-500/30",
    tag1: { label: "Full history", bg: "bg-amber-50", text: "text-amber-700" },
    tag2: { label: "Dispute ready", bg: "bg-gray-100", text: "text-gray-600" },
  },
  {
    title: "Receipts that matter",
    body: "Auto-generated paper trail. Not accounting software, but enough to keep everyone honest.",
    Icon: Receipt,
    color: "bg-purple-600",
    light: "bg-purple-50",
    text: "text-purple-600",
    glow: "shadow-purple-500/30",
    tag1: { label: "Auto-generated", bg: "bg-purple-50", text: "text-purple-700" },
    tag2: { label: "PDF export", bg: "bg-gray-100", text: "text-gray-600" },
  },
  {
    title: "Earned trust",
    body: "Verification badge + safety tooling. Serious buyers spot serious sellers instantly.",
    Icon: Shield,
    color: "bg-emerald-600",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    glow: "shadow-emerald-500/30",
    tag1: { label: "Verified badge", bg: "bg-emerald-50", text: "text-emerald-700" },
    tag2: { label: "Buyer protection", bg: "bg-gray-100", text: "text-gray-600" },
  },
];

export default function SellerTrustStack() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-gray-50 py-16 md:py-24 ${STOREFRONT_GUTTER_X}`}
      aria-labelledby="seller-trust-heading"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        
        <SectionHeader
          eyebrow="Trust & operations"
          headline={
            <>
              Get paid.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Stay protected.
              </span>
            </>
          }
          description="Serious checkout infrastructure for sellers who outgrew DMs."
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {pillars.map(({ title, body, Icon, color, text, glow, tag1, tag2 }, i) => (
            <div
              key={title}
              className="group relative rounded-2xl md:rounded-3xl border border-gray-200 bg-white p-6 md:p-8 transition-all duration-500 ease-out hover:border-gray-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="absolute top-5 right-5 md:top-6 md:right-6 text-[10px] font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                0{i + 1}
              </div>

              <div className={`mb-5 md:mb-6 inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl ${color} text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-gray-900/10 group-hover:${glow}`}>
                <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
              </div>

              <h3 className={`text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3 group-hover:${text} transition-colors`}>
                {title}
              </h3>
              
              <p className="text-sm text-gray-500 leading-relaxed mb-5 md:mb-6">
                {body}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className={`text-[10px] font-semibold px-2.5 py-1 ${tag1.bg} ${tag1.text} rounded-full`}>{tag1.label}</span>
                <span className={`text-[10px] font-semibold px-2.5 py-1 ${tag2.bg} ${tag2.text} rounded-full`}>{tag2.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">Bank-grade encryption</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">PCI compliant</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">Instant settlement</span>
          </div>
        </div>
      </div>
    </section>
  );
}