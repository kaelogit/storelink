"use client";

import { X, Check, ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import SectionHeader from "./SectionHeader";

const comparisons = [
  {
    id: "checkout",
    label: "Storefront & Orders",
    oldProblem: "Link-in-bio sprawl with nowhere for buyers to actually purchase.",
    newSolution: "A centralized checkout. Turn intent into cash on a single, branded page.",
  },
  {
    id: "operations",
    label: "Stock Visibility",
    oldProblem: "Endless 'Is this available?' chats and hunting down payment proofs.",
    newSolution: "Real-time catalog tracking. Your storefront answers questions while you sleep.",
  },
  {
    id: "overhead",
    label: "Setup & Maintenance",
    oldProblem: "Months of expensive engineering or fighting clunky design plugins.",
    newSolution: "Zero configuration. We maintain infrastructure so you focus on product.",
  },
  {
    id: "reach",
    label: "Discovery Edge",
    oldProblem: "Buried in social feeds. Zero marketplace visibility.",
    newSolution: "Private URL for your community + native visibility on our marketplace.",
  },
];

export default function ValueProp() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-50 py-16 md:py-24"
      id="value-prop"
    >
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        
        <SectionHeader
          eyebrow="Why StoreLink"
          headline={
            <>
              Stop chatting.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Start selling.
              </span>
            </>
          }
          description="Bridge the gap between social discovery and structured checkout."
          align="center"
        />

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          
          {/* Before */}
          <div className="group relative rounded-2xl md:rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center">
                <X className="h-4 w-4 text-red-500" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">The Old Way</p>
                <p className="text-sm font-semibold text-gray-700">Status Quo</p>
              </div>
            </div>

            <div className="space-y-5">
              {comparisons.map((item) => (
                <div key={item.id} className="relative pl-3 border-l-2 border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{item.label}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.oldProblem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="group relative rounded-2xl md:rounded-3xl border-2 border-gray-900 bg-gray-900 p-6 md:p-8 shadow-xl shadow-gray-900/10">
            <div className="absolute -top-3 left-6 md:left-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-lg shadow-emerald-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> StoreLink
            </div>

            <div className="flex items-center gap-3 mb-6 pt-2">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Check className="h-4 w-4 text-emerald-400" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">The New Way</p>
                <p className="text-sm font-semibold text-white">Unified Architecture</p>
              </div>
            </div>

            <div className="space-y-5">
              {comparisons.map((item) => (
                <div key={item.id} className="relative pl-3 border-l-2 border-zinc-800 group-hover:border-emerald-500/30 transition-colors duration-300">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 group-hover:text-emerald-400 transition-colors">{item.label}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">{item.newSolution}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                <span className="text-emerald-400 font-semibold">+ Growth tools</span> included
              </p>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}