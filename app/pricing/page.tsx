"use client";
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Check, Zap, Crown, Star, Shield, ArrowRight, MessageCircle, Lock, Sparkles, Wand2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: "Starter",
    price: "0",
    id: "free",
    description: "The foundation for every new Naija hustle.",
    features: [
      "5 Product Upload Limit",
      "Basic Digital Storefront",
      "WhatsApp Handshake",
      "Standard Store Link",
      "Basic Inventory Tracking"
    ],
    buttonText: "Start for Free",
    color: "slate",
    isFree: true
  },
  {
    name: "Premium",
    price: "2,500",
    id: "premium",
    description: "The professional engine for growing brands.",
    features: [
      "Unlimited Product Uploads",
      "Verified 'Blue Tick' Badge",
      "Empire Coins Loyalty System",
      "Professional PDF Receipts",
      "Homepage Discovery Feature",
      "Digital Ledger Access",
      "Priority Support"
    ],
    buttonText: "Claim 14-Day Free Trial",
    popular: true,
    color: "emerald"
  },
  {
    name: "Diamond",
    price: "4,000",
    id: "diamond",
    description: "The ultimate power for sovereign empires.",
    features: [
      "Everything in Premium",
      "Diamond Badge",
      "Homepage 'Trending' Spot",
      "Top-of-Search Priority",
      "AI Background Removal",
      "Flashdrop Hype Engine",
      "Priority Ad Placement",
      "Dedicated Account Manager"
    ],
    buttonText: "Claim Diamond Status",
    color: "purple"
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] selection:bg-emerald-100">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gray-900 pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full mb-8">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Empire Growth</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9] md:leading-none">
            Scale your hustle to an <span className="text-emerald-500 italic">Empire.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            No hidden fees. No commissions on your sales. Just the industrial tools you need to dominate the Nigerian market.
          </p>

          {/* Trial Hook Banner - Highly Visible Glassmorphism */}
          <div className="inline-block bg-white/10 backdrop-blur-2xl border border-white/20 p-5 md:p-7 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in zoom-in duration-700">
            <div className="flex flex-col md:flex-row items-center gap-4 text-white">
              <span className="bg-amber-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Automatic Activation</span>
              <p className="font-extrabold text-base md:text-lg tracking-tight">
                Every signup gets <span className="text-emerald-400 underline underline-offset-8 decoration-2">14 Days of Premium Access</span> automatically.
              </p>
            </div>
          </div>
        </div>
        
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-24 -mb-24"></div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-24 px-4 md:px-6 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {tiers.map((tier) => (
            <div 
                key={tier.id}
                className={`relative bg-white rounded-[3.5rem] p-8 md:p-10 lg:p-12 border-4 transition-all duration-500 flex flex-col group ${
                tier.popular 
                ? 'border-emerald-500 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] md:scale-[1.05] z-10' 
                : tier.color === 'purple' 
                ? 'border-purple-100 bg-white shadow-2xl' // 🔥 Changed to White background for Diamond
                : 'border-white bg-white shadow-xl hover:border-gray-100'
                }`}
            >
                {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl whitespace-nowrap">
                    Recommended for Growth
                </div>
                )}

                <div className="mb-10">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 duration-300 ${
                    tier.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                    tier.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400'
                }`}>
                    {tier.id === 'free' ? <Shield size={32} /> : tier.id === 'premium' ? <Crown size={32} /> : <Star size={32} />}
                </div>
                
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-3 text-gray-900">
                    {tier.name}
                </h3>
                
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900">
                    ₦{tier.price}
                    </span>
                    <span className="text-gray-400 font-black text-xs uppercase tracking-widest">/ Month</span>
                </div>
                
                <p className="text-sm mt-6 font-bold leading-relaxed text-gray-500">
                    {tier.description}
                </p>
                </div>

                {/* Features List */}
                <div className="space-y-5 mb-12 flex-grow">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-900">What's Included</p>
                {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-4">
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        tier.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 
                        tier.color === 'purple' ? 'bg-purple-100 text-purple-600' : 
                        'bg-slate-100 text-slate-500'
                    }`}>
                        <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-sm md:text-base font-extrabold tracking-tight text-gray-900">{feature}</span>
                    </div>
                ))}
                </div>

                {/* Action Button */}
                <Link 
                href="/signup"
                className={`w-full py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] text-center transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group/btn ${
                    tier.color === 'emerald' ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' : 
                    tier.color === 'purple' ? 'bg-purple-500 text-white hover:bg-purple-700 shadow-purple-200' : // 🔥 Diamond Button is now Purple
                    'bg-gray-900 text-white hover:bg-black shadow-gray-200'
                }`}
                >
                {tier.buttonText}
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
            ))}
        </div>
        </section>

      {/* Deep Dive - Technical Features */}
      <section className="py-24 px-4 md:px-6 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-6">Built for <span className="text-emerald-500 italic">Speed.</span></h2>
            <div className="h-2 w-24 bg-gray-900 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                title: "WhatsApp Handshake", 
                desc: "The protocol that starts every sales conversation at the finish line. Clean, payment-ready orders sent directly to your DM.",
                icon: <Zap className="text-amber-500" fill="currentColor" />
              },
              { 
                title: "Empire Coin Loyalty", 
                desc: "Turn discounts into digital assets. Storelink keeps your customers coming back by giving them a private wallet they actually care about.",
                icon: <Coins className="text-purple-500" />
              },
              { 
                title: "AI Background Removal", 
                desc: "Exclusively for Diamond Empires. Tap once to remove messy backgrounds and make your products look like they were shot in a studio.",
                icon: <Wand2 className="text-blue-500" />
              },
              { 
                title: "Verified Identity", 
                desc: "Earn the Blue Tick through our manual vetting process. Stop losing customers to the 'Pay and Disappear' fear.",
                icon: <ShieldCheck className="text-emerald-500" />
              }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-[#F8FAFC] border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-white rounded-[1.25rem] shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">{feature.title}</h4>
                <p className="text-gray-500 font-bold leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
              Start your Empire <br />for <span className="text-emerald-500 italic">Free.</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-xl mx-auto font-medium">
              Join 50,000+ vendors building the future of African retail. Your 14-day Premium trial is waiting.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link href="/signup" className="w-full md:w-auto bg-emerald-600 text-white px-6 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-emerald-500 transition-all hover:scale-105 shadow-xl">
                Create My Store
              </Link>
              <a href="https://wa.me/2349125951202" className="text-white hover:text-emerald-500 font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 transition-colors">
                <MessageCircle size={20} />
                Talk to Support
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Minimal missing icon import for standard consistency
function Coins({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>
    </svg>
  );
}