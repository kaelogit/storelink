"use client";

import Link from "next/link";
import { UserPlus, LayoutGrid, Share2, Radar, ArrowRight, ChevronRight } from "lucide-react";
import { useState } from "react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import SectionHeader from "./SectionHeader";

const steps = [
  { 
    step: "01", 
    title: "Create Account", 
    body: "Launch your seller profile in minutes. No paperwork, no waiting.", 
    Icon: UserPlus,
    color: "from-violet-500 to-purple-600",
    bg: "bg-purple-50",
    accent: "text-purple-600",
  },
  { 
    step: "02", 
    title: "Build Catalog", 
    body: "Upload products, set prices. Your storefront goes live as you build.", 
    Icon: LayoutGrid,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    accent: "text-blue-600",
  },
  { 
    step: "03", 
    title: "Share Link", 
    body: "One URL. Instagram bio, WhatsApp status, Twitter — everywhere.", 
    Icon: Share2,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    accent: "text-amber-600",
  },
  { 
    step: "04", 
    title: "Sell & Scale", 
    body: "Fulfil orders from your dashboard. Marketplace discovery kicks in automatically.", 
    Icon: Radar,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    accent: "text-emerald-600",
  },
];

export default function SellerJourney() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section 
      className={`relative overflow-hidden bg-white py-24 md:py-32 ${STOREFRONT_GUTTER_X}`}
      id="seller-journey"
    >
      <div className="relative max-w-6xl mx-auto">
        
        <SectionHeader
          eyebrow="The Process"
          headline={
            <>
              From setup to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                sales
              </span>
            </>
          }
          description="Skip the agencies. Four steps to a storefront that converts."
          align="center"
          singleLine
        />

        {/* Timeline layout */}
        <div className="relative mt-16">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

          <div className="space-y-16 md:space-y-24">
            {steps.map(({ step, title, body, Icon, color, accent }, i) => {
              const isLeft = i % 2 === 0;
              const isActive = activeStep === i;

              return (
                <div 
                  key={step}
                  className="relative md:grid md:grid-cols-2 md:gap-16 items-center"
                  onMouseEnter={() => setActiveStep(i)}
                >
                  {/* Content block */}
                  <div className={`${isLeft ? 'md:text-right md:pr-16' : 'md:order-2 md:pl-16'}`}>
                    <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${accent} mb-2 block`}>
                      Step {step}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      {title}
                    </h3>
                    <p className={`text-base text-gray-500 leading-relaxed max-w-sm ${isLeft ? 'md:ml-auto' : ''}`}>
                      {body}
                    </p>
                    
                    {/* CTA on last step */}
                    {i === 3 && (
                      <Link
                        href="/signup?next=%2Fpost-login"
                        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all group"
                      >
                        Start selling
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>

                  {/* Orb */}
                  <div className={`flex justify-center py-6 md:py-0 ${isLeft ? 'md:order-2' : ''}`}>
                    <div className="relative">
                      {isActive && (
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${color} opacity-20 blur-xl animate-pulse`} />
                      )}
                      <div className={`relative h-16 w-16 rounded-full bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-xl transition-transform duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
                        <Icon className="h-7 w-7" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/signup?next=%2Fpost-login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold uppercase tracking-wider"
          >
            Start your journey
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}