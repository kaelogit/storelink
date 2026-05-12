"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Twitter,
  Copy,
  PartyPopper
} from "lucide-react";
import Link from "next/link";
import { storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM, TOUCH_TARGET } from "@/lib/mobileLayout";

// Wrapper component to handle search params
function WaitlistContent() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [myReferralCode, setMyReferralCode] = useState("");

  // Capture the referral code from the URL (e.g., ?ref=abdul-123)
  const referredBy = searchParams.get("ref");

  const generateReferralCode = (emailStr: string) => {
    const prefix = emailStr.split('@')[0].slice(0, 5).toLowerCase();
    const random = Math.random().toString(36).substring(2, 6);
    return `${prefix}-${random}`;
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const newCode = generateReferralCode(email);

    const { error } = await supabase
      .from("waitlist")
      .insert([{ 
        email, 
        business_name: businessName,
        phone: phone,
        referral_code: newCode,
        referred_by: referredBy // 🔥 Logs who referred them
      }]);

    if (error) {
      if (error.code === '23505') {
        setError("You're already on the list! We'll reach out soon.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    } else {
      setMyReferralCode(newCode);
      setSubmitted(true);
      setLoading(false);
    }
  };

  if (submitted) {
    const shareUrl = `${storefrontAbsolutePath("/waitlist")}?ref=${encodeURIComponent(myReferralCode)}`;

    return (
      <div className={`flex min-h-dvh flex-col items-center justify-center bg-white text-center animate-in fade-in zoom-in duration-700 ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}>
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 relative">
          <PartyPopper size={40} className="animate-bounce" />
          <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full animate-pulse">
            <Crown size={16} />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter uppercase italic">Welcome to StoreLink!</h1>
        <p className="text-gray-500 max-w-sm mb-8 font-medium text-sm leading-relaxed">
          You're officially on the list. But why wait alone?
        </p>

        {/* --- REFERRAL CARD --- */}
        <div className="w-full max-w-md bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 text-left shadow-xl shadow-emerald-900/5 mb-10">
           <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
             <Crown size={14} /> Unlock Diamond Access (₦4,000 Value)
           </h3>
           <p className="text-gray-700 font-bold text-sm mb-4 leading-snug">
             Refer <span className="text-emerald-600 font-black italic">3 fellow vendors</span> to join the waitlist and get <span className="underline decoration-emerald-300">1 Month of Diamond Subscription</span> for FREE at launch!
           </p>

           <div className="space-y-2 mb-6">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Diamond Perks include:</p>
              {[
                "Verified Vendor Badge",
                "Priority Marketplace Spot",
                "Advanced Sales Analytics",
                "Store Coin loyalty"
              ].map((perk) => (
                <div key={perk} className="flex items-center gap-2 text-xs font-bold text-gray-500 italic">
                  <CheckCircle2 size={14} className="text-emerald-500" /> {perk}
                </div>
              ))}
           </div>

           <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between group">
                <code className="text-[10px] font-mono font-bold text-emerald-600 truncate">{shareUrl}</code>
                <button 
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert("Referral Link Copied! 🚀");
                  }}
                  className={`rounded-xl bg-gray-900 p-2 text-white transition-colors hover:bg-emerald-600 ${TOUCH_TARGET}`}
                >
                  <Copy size={16} />
                </button>
              </div>
              <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Share this link to claim your reward</p>
           </div>
        </div>

        <Link href="/" className="text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className={`relative min-h-dvh overflow-x-hidden bg-[#fafafa] font-sans text-gray-900 selection:bg-emerald-100 ${STOREFRONT_SAFE_BOTTOM}`}>
      {/* --- BACKGROUND AMBIANCE (PRESERVED) --- */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-50/60 via-emerald-50/20 to-transparent -z-10" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/20 blur-[120px] rounded-full -z-10 animate-pulse" />

      <main className={`mx-auto max-w-5xl pb-20 pt-10 md:pt-24 ${STOREFRONT_GUTTER_X}`}>
        <div className="flex justify-between items-center mb-14">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <LayoutDashboard className="text-emerald-600" size={20} />
            <span className="font-black text-lg tracking-tighter uppercase italic">StoreLink</span>
          </div>
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-colors flex items-center gap-2 group">
            Peek Main Site <Globe size={14} className="group-hover:rotate-12 transition-transform"/>
          </Link>
        </div>

        <div className="text-center mb-12 px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
             <Rocket size={12} /> Launching Q1 2026
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight uppercase leading-[0.85] italic">
            Stop Chatting. <br />
            <span className="text-emerald-600">Start Selling.</span>
          </h1>
          <p className="text-gray-500 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            The engine for the Naija Hustle is almost ready. Launch a professional storefront and reach buyers beyond your contacts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(16,185,129,0.1)] border border-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-l font-black mb-8 uppercase tracking-widest text-gray-600 text-center italic">Join the VIP Waitlist</h2>
              
              {referredBy && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700">
                  <Crown size={16} />
                  <span className="text-[10px] font-black uppercase">Referral Link Active</span>
                </div>
              )}

              <form onSubmit={handleJoin} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Your Business Name"
                  className="min-h-[48px] w-full rounded-2xl border border-gray-100 bg-gray-50 px-6 py-4 text-base font-bold outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
                <input
                  required
                  type="tel"
                  placeholder="Business phone number"
                  className="min-h-[48px] w-full rounded-2xl border border-gray-100 bg-gray-50 px-6 py-4 text-base font-bold outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="min-h-[48px] w-full rounded-2xl border border-gray-100 bg-gray-50 px-6 py-4 text-base font-bold outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="text-red-500 text-xs font-bold text-center px-2">{error}</p>}
                <button
                  disabled={loading}
                  className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Secure My Founder Perk <ArrowRight size={16}/></>}
                </button>
              </form>
            </div>
          </div>

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
             <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-3xl shadow-2xl border border-emerald-50 animate-bounce transition-transform group-hover:scale-110">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Zap size={20} fill="currentColor"/></div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Growth Tracked</p>
                      <p className="text-xl font-black text-gray-900 leading-none">You&apos;re on the list</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Zap className="text-emerald-600 mb-6" size={36} />
            <h3 className="font-black text-sm uppercase mb-3 tracking-tight italic">Instant Setup</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Turn your hustle into a professional store in 5 minutes.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <ShieldCheck className="text-emerald-600 mb-6" size={36} />
            <h3 className="font-black text-sm uppercase mb-3 tracking-tight italic">Verified Trust</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Stand out with official verification badges.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <Crown className="text-emerald-600 mb-6" size={36} />
            <h3 className="font-black text-sm uppercase mb-3 tracking-tight italic">Elite Loyalty</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Automated rewards keep your customers coming back.</p>
          </div>
        </div>

        <footer className="border-t border-gray-100 pt-0 md:pt-16 pb-8 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
           <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2 grayscale opacity-40">
                <LayoutDashboard size={18} />
                <span className="font-black text-base tracking-tighter uppercase italic">StoreLink</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">© 2025 StoreLink</p>
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

export default function WaitlistPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center"><Loader2 className="animate-spin text-emerald-600"/></div>}>
      <WaitlistContent />
    </Suspense>
  );
}