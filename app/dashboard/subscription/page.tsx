"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Check, Crown, Star, Shield, AlertTriangle, Loader2, 
  ArrowLeft, ExternalLink, Lock, PartyPopper, Trophy, 
  Sparkles, Download, Receipt, Printer, LayoutDashboard 
} from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic"; 
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const [storeName, setStoreName] = useState(""); 
  const [storeSlug, setStoreSlug] = useState(""); 
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [upgradedPlan, setUpgradedPlan] = useState("");
  const [receiptRef, setReceiptRef] = useState("");

  const receiptExportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
      setReceiptRef(reference.reference);
      setUpgradedPlan(plan);
      setShowSuccessModal(true);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!receiptExportRef.current) return;
    setIsDownloading(true);

    try {
      const element = receiptExportRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`StoreLink_Receipt_${receiptRef || 'Subscription'}.pdf`);
    } catch (err) {
      console.error("PDF Export failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getPaystackConfig = (amount: number, plan: 'premium' | 'diamond') => {
    return {
      reference: (new Date()).getTime().toString(),
      email: user?.email || "customer@storelink.com",
      amount: amount * 100, 
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || "", 
      text: currentPlan === plan ? "Renew Plan" : "Upgrade Now",
      onSuccess: (ref: any) => handleSuccess(ref, plan),
      onClose: () => {
        setStatusMsg({ type: 'error', text: "Payment cancelled." });
        setTimeout(() => setStatusMsg(null), 3000);
      },
    };
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gray-400"/></div>;

  const isExpired = expiryDate && new Date(expiryDate) < new Date();
  const currentRank = (plan: string) => plan === 'diamond' ? 3 : plan === 'premium' ? 2 : 1;

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans relative print:bg-white">
      
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-300 print:hidden">
           <div className="bg-white w-full max-w-md rounded-[40px] p-8 text-center shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                 <Trophy size={48} className="text-emerald-600 animate-bounce" />
                 <Sparkles className="absolute -top-2 -right-2 text-amber-500 animate-pulse" />
              </div>
              
              <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Empire Upgraded!</h2>
              <p className="text-gray-500 font-medium mb-8">
                Congratulations! <span className="text-gray-900 font-bold">{storeName}</span> is now on the <span className="text-emerald-600 font-black">{upgradedPlan.toUpperCase()}</span> plan.
              </p>

              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 mb-8 text-left space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="text-emerald-600" size={16}/>
                    <span className="font-bold text-xs uppercase tracking-tighter">Receipt</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">#{receiptRef.slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-bold text-gray-900">₦{upgradedPlan === 'premium' ? '2,500' : '4,000'}</span>
                </div>
                <button 
                  onClick={handleDownloadReceipt}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs py-2 border-2 border-emerald-100 rounded-xl hover:bg-emerald-50 transition disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />} 
                  {isDownloading ? "Generating..." : "Download Business Receipt"}
                </button>
              </div>

              <button 
                onClick={() => window.location.href = "/dashboard"}
                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                GO TO DASHBOARD
              </button>
           </div>
        </div>
      )}

      <div className="absolute left-[-9999px] top-0">
        <div ref={receiptExportRef} className="w-[800px] bg-white p-12">
          <div className="max-w-2xl mx-auto border-[12px] border-emerald-50 p-10 rounded-[50px]">
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <LayoutDashboard className="text-emerald-600" size={32}/>
                  <span className="font-black text-3xl tracking-tighter text-gray-900 uppercase">StoreLink</span>
                </div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Official Payment Receipt</p>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900 uppercase">Premium Invoice</p>
                <p className="text-gray-400 text-xs font-mono">{receiptRef}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12 pb-12 border-b border-gray-100">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Billed To</h4>
                <p className="font-bold text-gray-900 text-lg">{storeName}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
              <div className="text-right">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Date Issued</h4>
                <p className="font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
                <p className="text-gray-500 text-sm">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            <table className="w-full mb-12">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-4 text-xs font-black uppercase">Plan Description</th>
                  <th className="text-right py-4 text-xs font-black uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-6">
                    <p className="font-bold text-gray-900">StoreLink {upgradedPlan.toUpperCase()} Subscription</p>
                    <p className="text-xs text-gray-400">30 Days Unlimited Empire Access</p>
                  </td>
                  <td className="py-6 text-right font-black text-xl text-gray-900">
                    ₦{upgradedPlan === 'premium' ? '2,500' : '4,000'}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="bg-gray-900 text-white p-8 rounded-[30px] flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                <p className="font-black text-emerald-400 uppercase tracking-tight">Payment Verified</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Paid</p>
                <p className="font-black text-3xl">₦{upgradedPlan === 'premium' ? '2,500.00' : '4,000.00'}</p>
              </div>
            </div>

            <p className="text-center text-[10px] text-gray-300 font-bold mt-12 uppercase tracking-[0.3em]">Thank you for building your empire with StoreLink</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-8 md:px-12 mb-8 print:hidden">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">Subscription & Billing</h1>
               <p className="text-gray-500 text-sm mt-1">Manage your Empire, <span className="font-bold text-gray-900">{storeName}</span></p>
            </div>
            <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm bg-gray-100 px-4 py-2 rounded-xl transition">
              <ArrowLeft size={16} /> Back
            </button>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 print:hidden">
        <div className={`p-6 rounded-2xl border shadow-sm mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${isExpired ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wide ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
               {isExpired ? "Account Status" : "Current Plan"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-3xl font-extrabold ${isExpired ? 'text-red-700' : currentPlan === 'diamond' ? 'text-purple-600' : currentPlan === 'premium' ? 'text-blue-600' : 'text-gray-900'}`}>
                {isExpired ? "Store Locked" : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </span>
              {currentPlan !== 'free' && !isExpired && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">Active</span>}
              {isExpired && <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md animate-pulse uppercase tracking-tighter">Offline</span>}
            </div>
            {expiryDate && (
              <p className={`text-sm mt-1 font-medium ${isExpired ? 'text-red-500' : 'text-gray-400'}`}>
                {isExpired ? `Expired on ${new Date(expiryDate).toLocaleDateString()}` : `Renews on ${new Date(expiryDate).toLocaleDateString()}`}
              </p>
            )}
          </div>
          {isExpired && (
            <div className="bg-white/50 px-4 py-3 rounded-xl flex items-center gap-3 text-red-700 font-bold border border-red-200 w-full md:w-auto shadow-sm">
               <Lock size={20} className="shrink-0 text-red-600"/> 
               <span className="text-sm">Store offline. Renew to unlock.</span>
            </div>
          )}
        </div>

        {statusMsg && (
          <div className={`p-4 mb-8 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {statusMsg.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
              <span className="font-bold">{statusMsg.text}</span>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className={`bg-white p-8 rounded-3xl border-2 ${currentPlan === 'free' && !isExpired ? 'border-gray-900 shadow-xl' : 'border-transparent shadow-sm'} flex flex-col`}>
              <div className="mb-4 bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center"><Shield className="text-gray-600"/></div>
              <h3 className="text-xl font-bold text-gray-900">Starter</h3>
              <div className="mt-2 mb-6"><span className="text-3xl font-extrabold">Free</span></div>
              <ul className="space-y-4 text-sm text-gray-600 mb-8 flex-1">
                <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0"/> <span>5 Products Limit</span></li>
                <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0"/> <span>Basic Store Link</span></li>
                <li className="flex gap-3 opacity-50"><XIcon /> <span>No Homepage Feature</span></li>
                <li className="flex gap-3 opacity-50"><XIcon /> <span>No Verified Badge</span></li>
              </ul>
              <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-400 cursor-not-allowed">
                {currentPlan === 'free' && !isExpired ? "Current Plan" : "Starter Plan"}
              </button>
          </div>

          <div className={`bg-white p-8 rounded-3xl border-2 relative overflow-hidden ${currentPlan === 'premium' && !isExpired ? 'border-blue-500 shadow-xl' : 'border-transparent shadow-sm'} flex flex-col`}>
              <div className="mb-4 bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center"><Crown className="text-blue-600"/></div>
              <h3 className="text-xl font-bold text-gray-900">Premium</h3>
              <div className="mt-2 mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">₦2,500</span><span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-4 text-sm text-gray-600 mb-8 flex-1">
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span><b>Unlimited Products</b></span></li>
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span><b>Professional PDF Receipts</b></span></li>
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span>Priority Support</span></li>
                <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0"/> <span>Homepage Feature</span></li>
              </ul>
              {(currentRank(currentPlan) > 2 && !isExpired) ? (
                  <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-400 cursor-not-allowed">Diamond Active</button>
              ) : (currentRank(currentPlan) === 2 && !isExpired) ? (
                  <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-blue-50 text-blue-300">Current Plan</button>
              ) : (
                  <PaystackButton {...getPaystackConfig(2500, 'premium')} className="w-full py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200" />
              )}
          </div>

          <div className={`bg-gray-900 p-8 rounded-3xl border-2 relative overflow-hidden ${currentPlan === 'diamond' && !isExpired ? 'border-purple-500 shadow-2xl' : 'border-gray-800 shadow-xl'} flex flex-col text-white`}>
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
              {(currentRank(currentPlan) === 3 && !isExpired) ? (
                  <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700">Current Plan</button>
              ) : (
                  <PaystackButton {...getPaystackConfig(4000, 'diamond')} className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition shadow-lg shadow-purple-900/50" />
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