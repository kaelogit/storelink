"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Crown, Star, Shield, AlertTriangle, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic"; 

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function SubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [storeName, setStoreName] = useState(""); // Added for Header
  const [storeSlug, setStoreSlug] = useState(""); // Added for Header
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      setUser(user);

      const { data: store } = await supabase
        .from("stores")
        .select("name, slug, subscription_plan, subscription_expiry")
        .eq("owner_id", user.id)
        .single();
      
      if (store) {
        setStoreName(store.name);
        setStoreSlug(store.slug);
        setCurrentPlan(store.subscription_plan);
        setExpiryDate(store.subscription_expiry);
      }
      setLoading(false);
    };
    loadData();
  }, [router]);

  const handleSuccess = async (reference: any, plan: 'premium' | 'diamond') => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const { error } = await supabase
      .from("stores")
      .update({ 
        subscription_plan: plan,
        subscription_expiry: nextMonth.toISOString()
      })
      .eq("owner_id", user.id);

    if (error) {
      setStatusMsg({ type: 'error', text: "Payment received but update failed. Contact Support." });
    } else {
      setStatusMsg({ type: 'success', text: `Success! You are now on the ${plan.toUpperCase()} plan.` });
      
      setTimeout(() => {
         window.location.href = "/dashboard"; 
      }, 2000);
    }
  };

  const handleClose = () => {
    setStatusMsg({ type: 'error', text: "Payment cancelled." });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const getPaystackConfig = (amount: number, plan: 'premium' | 'diamond') => {
    return {
      reference: (new Date()).getTime().toString(),
      email: user?.email || "customer@storelink.com",
      amount: amount * 100, 
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || "", 
      text: currentPlan === plan ? "Renew Plan" : "Upgrade Now",
      onSuccess: (ref: any) => handleSuccess(ref, plan),
      onClose: handleClose,
    };
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gray-400"/></div>;

  const isExpired = expiryDate && new Date(expiryDate) < new Date();

  // Helper to determine plan rank for logic
  const getRank = (plan: string) => {
    if (plan === 'diamond') return 3;
    if (plan === 'premium') return 2;
    return 1; // free
  };

  const currentRank = getRank(currentPlan);

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* --- SOFT HEADER --- */}
      <div className="bg-white border-b border-gray-200 px-6 py-8 md:px-12 mb-8">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                 Subscription & Billing
               </h1>
               <p className="text-gray-500 text-sm mt-1">
                 Manage your Empire, <span className="font-bold text-gray-900">{storeName}</span>
               </p>
            </div>
            <div className="flex items-center gap-3">
               <button 
                  onClick={() => router.push("/dashboard")} 
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm bg-gray-100 px-4 py-2 rounded-xl transition"
                >
                  <ArrowLeft size={16} /> Back to Dashboard
                </button>
            </div>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <p className="text-gray-500 mb-10 text-center md:text-left">Choose the plan that fits your business scale.</p>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Current Plan</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-3xl font-extrabold ${currentPlan === 'diamond' ? 'text-purple-600' : currentPlan === 'premium' ? 'text-blue-600' : 'text-gray-900'}`}>
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </span>
              {currentPlan !== 'free' && !isExpired && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">Active</span>}
              {isExpired && <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">Expired</span>}
            </div>
            {expiryDate && (
              <p className={`text-sm mt-1 font-medium ${isExpired ? 'text-red-500' : 'text-gray-400'}`}>
                {isExpired ? `Expired on ${new Date(expiryDate).toLocaleDateString()}` : `Renews on ${new Date(expiryDate).toLocaleDateString()}`}
              </p>
            )}
          </div>
          
          {isExpired && (
            <div className="bg-red-50 px-4 py-3 rounded-xl flex items-center gap-3 text-red-600 font-bold border border-red-100 w-full md:w-auto">
               <AlertTriangle size={20} className="shrink-0"/> 
               <span className="text-sm">Your plan has expired. Products are hidden.</span>
            </div>
          )}
        </div>
        
        {statusMsg && (
          <div className={`p-4 mb-8 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
            statusMsg.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
              {statusMsg.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
              <span className="font-bold">{statusMsg.text}</span>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* --- FREE PLAN --- */}
          <div className={`bg-white p-8 rounded-3xl border-2 ${currentPlan === 'free' ? 'border-gray-900 shadow-xl' : 'border-transparent shadow-sm'} flex flex-col`}>
              <div className="mb-4 bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center"><Shield className="text-gray-600"/></div>
              <h3 className="text-xl font-bold text-gray-900">Starter</h3>
              <div className="mt-2 mb-6"><span className="text-3xl font-extrabold">Free</span></div>
              <ul className="space-y-4 text-sm text-gray-600 mb-8 flex-1">
                <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0"/> <span>5 Products Limit</span></li>
                <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0"/> <span>Basic Store Link</span></li>
                <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0"/> <span>WhatsApp Checkout</span></li>
                <li className="flex gap-3 opacity-50"><XIcon /> <span>No Homepage Feature</span></li>
                <li className="flex gap-3 opacity-50"><XIcon /> <span>No Verified Badge</span></li>
              </ul>
              <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-400 cursor-not-allowed">
                {currentPlan === 'free' ? "Current Plan" : "Downgrade"}
              </button>
          </div>

          {/* --- PREMIUM PLAN --- */}
          <div className={`bg-white p-8 rounded-3xl border-2 relative overflow-hidden ${currentPlan === 'premium' ? 'border-blue-500 shadow-xl' : 'border-transparent shadow-sm'} flex flex-col`}>
              <div className="mb-4 bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center"><Crown className="text-blue-600"/></div>
              <h3 className="text-xl font-bold text-gray-900">Premium</h3>
              <div className="mt-2 mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">₦2,500</span><span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-4 text-sm text-gray-600 mb-8 flex-1">
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span><b>Unlimited Products</b></span></li>
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span><b>Verified Badge (Blue)</b></span></li>
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span>Professional PDF Receipts</span></li>
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span>Priority Support</span></li>
                <li className="flex gap-3 opacity-50"><XIcon /> <span>No Homepage Feature</span></li>
              </ul>
              
              {/* LOGIC: 
                  - If Current == Diamond (Rank 3) -> Disabled (Downgrade)
                  - If Current == Premium (Rank 2) AND Active -> Disabled (Current)
                  - If Current == Premium (Rank 2) AND Expired -> Active (Renew)
                  - If Current == Free (Rank 1) -> Active (Upgrade) 
              */}
              {(currentRank > 2) ? (
                  <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-400 cursor-not-allowed">
                    Included in Diamond
                  </button>
              ) : (currentRank === 2 && !isExpired) ? (
                  <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-blue-50 text-blue-300 cursor-not-allowed">
                    Current Plan
                  </button>
              ) : (
                  <PaystackButton 
                    {...getPaystackConfig(2500, 'premium')}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-blue-50 disabled:text-blue-300 shadow-lg shadow-blue-200"
                  />
              )}
          </div>

          {/* --- DIAMOND PLAN --- */}
          <div className={`bg-gray-900 p-8 rounded-3xl border-2 relative overflow-hidden ${currentPlan === 'diamond' ? 'border-purple-500 shadow-2xl' : 'border-gray-800 shadow-xl'} flex flex-col text-white`}>
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">POPULAR</div>
              <div className="mb-4 bg-gray-800 w-12 h-12 rounded-xl flex items-center justify-center"><Star className="text-purple-400 fill-purple-400"/></div>
              <h3 className="text-xl font-bold text-white">Diamond</h3>
              <div className="mt-2 mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">₦4,000</span><span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 text-sm text-gray-300 mb-8 flex-1">
                <li className="flex gap-3"><Check size={18} className="text-purple-400 shrink-0"/> <span><b>Everything in Premium</b></span></li>
                <li className="flex gap-3"><Check size={18} className="text-purple-400 shrink-0"/> <span><b>Homepage Trending Spot</b></span></li>
                <li className="flex gap-3"><Check size={18} className="text-purple-400 shrink-0"/> <span><b>Top of Search Results</b></span></li>
                <li className="flex gap-3"><Check size={18} className="text-purple-400 shrink-0"/> <span>Dedicated Account Manager</span></li>
              </ul>
              
              {/* LOGIC:
                  - If Current == Diamond AND Active -> Disabled (Current)
                  - Else -> Active (Upgrade/Renew)
              */}
              {(currentRank === 3 && !isExpired) ? (
                  <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700">
                    Current Plan
                  </button>
              ) : (
                  <PaystackButton 
                    {...getPaystackConfig(4000, 'diamond')}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-purple-900/50"
                  />
              )}
          </div>

        </div>
      </div>
    </div>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 shrink-0"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
  )
}