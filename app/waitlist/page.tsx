"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Rocket, 
  CheckCircle2, 
  LayoutDashboard, 
  Zap, 
  Crown, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Globe, 
  Instagram, 
  Twitter 
} from "lucide-react";
import Link from "next/link";

export default function WaitlistPage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const { error } = await supabase
      .from("waitlist")
      .insert([{ 
        email, 
        business_name: businessName,
        phone: phone 
      }]);

    if (error) {
      if (error.code === '23505') {
        setError("You're already on the list! We'll reach out soon.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8 border-8 border-emerald-100/50">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">Welcome to the Empire!</h1>
        <p className="text-gray-500 max-w-md mb-8 font-medium text-lg leading-relaxed">
          You're officially on the list. We'll send you an exclusive invite and your 
          <span className="text-emerald-600 font-extrabold"> Founder's Bonus</span> as soon as we launch.
        </p>
        <Link href="/" className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-emerald-600 transition-all active:scale-95">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-emerald-100 overflow-x-hidden">
      {/* --- BACKGROUND AMBIANCE --- */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-50/60 via-emerald-50/20 to-transparent -z-10" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/20 blur-[120px] rounded-full -z-10 animate-pulse" />

      <main className="max-w-5xl mx-auto px-5 pt-10 md:pt-24 pb-20">
        {/* --- NAV / LOGO --- */}
        <div className="flex justify-between items-center mb-14">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <LayoutDashboard className="text-emerald-600" size={20} />
            <span className="font-black text-lg tracking-tighter uppercase italic">StoreLink</span>
          </div>
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-colors flex items-center gap-2 group">
            Peek Main Site <Globe size={14} className="group-hover:rotate-12 transition-transform"/>
          </Link>
        </div>

        {/* --- HERO SECTION --- */}
        <div className="text-center mb-12 px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
             <Rocket size={12} /> Launching Q1 2026
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight uppercase leading-[0.85] italic">
            Stop Chatting. <br />
            <span className="text-emerald-600">Start Selling.</span>
          </h1>
          <p className="text-gray-500 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            The engine for the Naija Hustle is almost ready. Turn your WhatsApp into a 
            professional sales machine and build your empire.
          </p>
        </div>

        {/* --- DUAL SECTION: FORM + PREVIEW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          
          {/* 1. FORM CARD */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(16,185,129,0.1)] border border-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-l font-black mb-8 uppercase tracking-widest text-gray-600 text-center italic">Join the VIP Waitlist</h2>
              <form onSubmit={handleJoin} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Your Business Name"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all focus:bg-white"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
                <input
                  required
                  type="tel"
                  placeholder="WhatsApp Phone Number"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all focus:bg-white"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="text-red-500 text-xs font-bold text-center px-2">{error}</p>}
                <button
                  disabled={loading}
                  className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Secure My Founder Perk <ArrowRight size={16}/></>}
                </button>
              </form>
              <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col items-center justify-center gap-3">
                 
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">400+ Vendors joined the movement</span>
              </div>
            </div>
          </div>

          {/* 2. DASHBOARD PREVIEW (The "Peek" Mockup) */}
          <div className="hidden lg:block relative animate-in slide-in-from-right duration-1000">
             <div className="bg-gray-900 rounded-[3rem] p-4 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700 group">
                <div className="bg-white rounded-[2rem] overflow-hidden aspect-video relative">
                   <div className="absolute inset-0 bg-emerald-600/5 flex flex-col p-8">
                      <div className="w-1/3 h-5 bg-gray-100 rounded-full mb-6" />
                      <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="h-24 bg-emerald-50 rounded-2xl border border-emerald-100" />
                        <div className="h-24 bg-blue-50 rounded-2xl border border-blue-100" />
                        <div className="h-24 bg-purple-50 rounded-2xl border border-purple-100" />
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
                         <LayoutDashboard className="text-gray-200" size={48} />
                      </div>
                   </div>
                </div>
             </div>
             {/* Floating Achievement Badge */}
             <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-3xl shadow-2xl border border-emerald-50 animate-bounce transition-transform group-hover:scale-110">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Zap size={20} fill="currentColor"/></div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Growth Tracked</p>
                      <p className="text-xl font-black text-gray-900 leading-none">Empire Ready</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- FEATURES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Zap className="text-emerald-600 mb-6" size={36} />
            <h3 className="font-black text-sm uppercase mb-3 tracking-tight italic">Instant Setup</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Turn your hustle into a professional store in 5 minutes. No coding, no stress.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <ShieldCheck className="text-emerald-600 mb-6" size={36} />
            <h3 className="font-black text-sm uppercase mb-3 tracking-tight italic">Verified Trust</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Stand out with official verification badges that turn browsers into buyers.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Crown className="text-emerald-600 mb-6" size={36} />
            <h3 className="font-black text-sm uppercase mb-3 tracking-tight italic">Elite Loyalty</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Automated Empire Coin rewards keep your customers coming back for more.</p>
          </div>
        </div>

        <footer className="border-t border-gray-100 pt-0 md:pt-16 pb-8 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
           <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2 grayscale opacity-40">
                <LayoutDashboard size={18} />
                <span className="font-black text-base tracking-tighter uppercase italic">StoreLink</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">© 2025 StoreLink Empire</p>
              <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.1em]">Engineered for the Naija Hustle</p>
           </div>
           
           <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex items-center gap-5">
                <Link href="https://instagram.com/storelink" className="text-gray-300 hover:text-emerald-600 transition-colors">
                  <Instagram size={20}/>
                </Link>
                <Link href="https://twitter.com/storelink" className="text-gray-300 hover:text-emerald-600 transition-colors">
                  <Twitter size={20}/>
                </Link>
              </div>
              <Link href="mailto:support@storelink.ng" className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors border-b border-gray-100 pb-0.5">
                Contact Support
              </Link>
           </div>
        </footer>
      </main>
    </div>
  );
}