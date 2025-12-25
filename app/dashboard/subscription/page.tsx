"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Check, Crown, Star, Shield, AlertTriangle, Loader2, 
  ArrowLeft, Lock, PartyPopper, Trophy, 
  Sparkles, Download, LayoutDashboard, X 
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
    const now = new Date();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    let newExpiryDate: Date;

    const getRank = (p: string) => p === 'diamond' ? 3 : p === 'premium' ? 2 : 1;
    const currentRank = getRank(currentPlan);
    const newRank = getRank(plan);

    if (newRank > currentRank) {
      newExpiryDate = new Date(now.getTime() + thirtyDaysInMs);
    } else if (plan === currentPlan && expiryDate && new Date(expiryDate) > now) {
      newExpiryDate = new Date(new Date(expiryDate).getTime() + thirtyDaysInMs);
    } else {
      newExpiryDate = new Date(now.getTime() + thirtyDaysInMs);
    }

    const { error } = await supabase
      .from("stores")
      .update({ 
        subscription_plan: plan,
        subscription_expiry: newExpiryDate.toISOString()
      })
      .eq("owner_id", user.id);

    if (error) {
      setStatusMsg({ type: 'error', text: "Payment received but update failed. Contact Support." });
    } else {
      setReceiptRef(reference.reference);
      setUpgradedPlan(plan);
      setExpiryDate(newExpiryDate.toISOString());
      setCurrentPlan(plan); 
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
    <div className="min-h-screen bg-gray-50 pb-20 font-sans relative print:bg-white overflow-x-hidden">
      
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-300 print:hidden">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 md:p-10 text-center shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500 overflow-y-auto max-h-[90vh]">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                 <Trophy size={40} className="text-emerald-600 animate-bounce" />
                 <Sparkles className="absolute -top-1 -right-1 text-amber-500 animate-pulse" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Empire Upgraded!</h2>
              <p className="text-gray-500 font-medium mb-8 text-sm md:text-base">
                Congratulations! <span className="text-gray-900 font-bold">{storeName}</span> is now on the <span className="text-emerald-600 font-black">{upgradedPlan.toUpperCase()}</span> plan.
              </p>

              <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-5 md:p-6 mb-8 text-left space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="text-emerald-600" size={16}/>
                    <span className="font-bold text-[10px] uppercase tracking-tighter">Transaction Receipt</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">#{receiptRef.slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Amount Paid</span>
                  <span className="font-black text-gray-900">₦{upgradedPlan === 'premium' ? '2,500' : '4,000'}</span>
                </div>
                <button 
                  onClick={handleDownloadReceipt}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest py-3 border-2 border-emerald-100 rounded-xl hover:bg-emerald-50 transition disabled:opacity-50 mt-2"
                >
                  {isDownloading ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />} 
                  {isDownloading ? "Generating..." : "Download Official Receipt"}
                </button>
              </div>

              <button 
                onClick={() => window.location.href = "/dashboard"}
                className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
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

      <div className="bg-white border-b border-gray-200 px-6 py-6 md:py-10 mb-8 print:hidden">
         <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
               <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter">Subscription</h1>
               <p className="text-gray-500 text-sm mt-1">Scale your Empire: <span className="font-bold text-gray-900">{storeName}</span></p>
            </div>
            <button onClick={() => router.push("/dashboard")} className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest bg-gray-100 px-6 py-3 rounded-2xl transition-all self-start sm:self-center">
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 print:hidden">
        
        <div className={`p-6 md:p-8 rounded-[2rem] border shadow-sm mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${isExpired ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
          <div className="space-y-1">
            <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isExpired ? 'text-red-600' : 'text-gray-400'}`}>
               {isExpired ? "CRITICAL: Account Status" : "ACTIVE PLAN"}
            </h2>
            <div className="flex items-center gap-3">
              <span className={`text-3xl md:text-4xl font-black uppercase tracking-tighter ${isExpired ? 'text-red-700' : currentPlan === 'diamond' ? 'text-purple-600' : currentPlan === 'premium' ? 'text-emerald-600' : 'text-gray-900'}`}>
                {isExpired ? "Store Locked" : currentPlan}
              </span>
              {!isExpired && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">Active</span>}
              {isExpired && <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-md animate-pulse uppercase tracking-tighter">Offline</span>}
            </div>
            {expiryDate && (
              <p className={`text-xs font-bold ${isExpired ? 'text-red-500' : 'text-gray-400'}`}>
                {isExpired ? `Access cut off on ${new Date(expiryDate).toLocaleDateString()}` : `Next billing date: ${new Date(expiryDate).toLocaleDateString()}`}
              </p>
            )}
          </div>
          {isExpired && (
            <div className="bg-white p-4 rounded-2xl flex items-center gap-4 text-red-700 font-black border border-red-200 w-full md:w-auto shadow-sm">
               <div className="p-3 bg-red-100 rounded-xl text-red-600"><Lock size={20}/></div>
               <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-widest">Store is Offline</span>
                  <span className="text-[9px] text-red-500 opacity-80">Pay to restore customer access</span>
               </div>
            </div>
          )}
        </div>

        {statusMsg && (
          <div className={`p-5 mb-8 rounded-[1.5rem] border flex items-center gap-3 animate-in slide-in-from-top-2 ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {statusMsg.type === 'success' ? <Check size={20} strokeWidth={3} /> : <AlertTriangle size={20} />}
              <span className="font-black text-xs uppercase tracking-tight">{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 items-stretch">
          
          <div className={`bg-white p-8 rounded-[2.5rem] border-2 flex flex-col transition-all duration-300 ${currentPlan === 'free' && !isExpired ? 'border-gray-900 shadow-xl scale-[1.02]' : 'border-gray-100 shadow-sm opacity-80'}`}>
              <div className="mb-6 bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100"><Shield size={28} /></div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Starter</h3>
              <div className="mt-2 mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-black">Free</span>
              </div>
              <ul className="space-y-5 text-xs font-bold text-gray-500 mb-10 flex-1">
                <li className="flex gap-4 items-center"><div className="bg-emerald-100 text-emerald-600 p-1 rounded-md"><Check size={14} strokeWidth={3}/></div> <span>5 Products Limit</span></li>
                <li className="flex gap-4 items-center"><div className="bg-emerald-100 text-emerald-600 p-1 rounded-md"><Check size={14} strokeWidth={3}/></div> <span>Basic Digital Storefront</span></li>
                <li className="flex gap-4 items-center opacity-40 italic"><X size={14} /> <span>No Homepage Feature</span></li>
                <li className="flex gap-4 items-center opacity-40 italic"><X size={14} /> <span>No Verified Badge</span></li>
              </ul>
              <button disabled className="w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed">
                {currentPlan === 'free' && !isExpired ? "Currently Active" : "Starter Level"}
              </button>
          </div>

          <div className={`bg-white p-8 rounded-[2.5rem] border-2 relative overflow-hidden flex flex-col transition-all duration-300 ${currentPlan === 'premium' && !isExpired ? 'border-emerald-500 shadow-xl scale-[1.02]' : 'border-gray-100 shadow-sm'}`}>
              <div className="mb-6 bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm"><Crown size={28} /></div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Premium</h3>
              <div className="mt-2 mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight text-gray-900">₦2,500</span>
                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">/ Month</span>
              </div>
              <ul className="space-y-5 text-xs font-bold text-gray-600 mb-10 flex-1">
                <li className="flex gap-4 items-center"><div className="bg-emerald-500 text-white p-1 rounded-md shadow-sm"><Check size={14} strokeWidth={3}/></div> <span className="text-gray-900">Unlimited Products</span></li>
                <li className="flex gap-4 items-center"><div className="bg-emerald-500 text-white p-1 rounded-md shadow-sm"><Check size={14} strokeWidth={3}/></div> <span className="text-gray-900">Verified Vendor Badge</span></li>
                <li className="flex gap-4 items-center"><div className="bg-emerald-500 text-white p-1 rounded-md shadow-sm"><Check size={14} strokeWidth={3}/></div> <span className="text-gray-900">Professional PDF Receipts</span></li>
                <li className="flex gap-4 items-center"><div className="bg-emerald-500 text-white p-1 rounded-md shadow-sm"><Check size={14} strokeWidth={3}/></div> <span>Homepage Feature</span></li>
              </ul>
              {(currentRank(currentPlan) > 2 && !isExpired) ? (
                  <button disabled className="w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest bg-gray-50 text-gray-300 cursor-not-allowed">Diamond Is Active</button>
              ) : (
                  <PaystackButton {...getPaystackConfig(2500, 'premium')} className="w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100" />
              )}
          </div>

          <div className={`bg-gray-900 p-8 rounded-[2.5rem] border-2 relative overflow-hidden flex flex-col transition-all duration-300 sm:col-span-2 lg:col-span-1 ${currentPlan === 'diamond' && !isExpired ? 'border-purple-500 shadow-2xl scale-[1.02]' : 'border-gray-800 shadow-xl shadow-gray-200'}`}>
              <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-white text-[9px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg">Ultimate Empire</div>
              <div className="mb-6 bg-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-400 border border-gray-700"><Star size={28} fill="currentColor"/></div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Diamond</h3>
              <div className="mt-2 mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white tracking-tight">₦4,000</span>
                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">/ Month</span>
              </div>
              <ul className="space-y-5 text-xs font-bold text-gray-300 mb-10 flex-1">
                <li className="flex gap-4 items-center"><div className="bg-purple-500 text-white p-1 rounded-md"><Check size={14} strokeWidth={3}/></div> <span className="text-white">Everything in Premium</span></li>
                <li className="flex gap-4 items-center"><div className="bg-purple-500 text-white p-1 rounded-md"><Check size={14} strokeWidth={3}/></div> <span className="text-white">Homepage Trending Spot</span></li>
                <li className="flex gap-4 items-center"><div className="bg-purple-500 text-white p-1 rounded-md"><Check size={14} strokeWidth={3}/></div> <span className="text-white">Top of Search Results</span></li>
                <li className="flex gap-4 items-center"><div className="bg-purple-500 text-white p-1 rounded-md"><Check size={14} strokeWidth={3}/></div> <span>Priority Ad Placement</span></li>
              </ul>
              <PaystackButton {...getPaystackConfig(4000, 'diamond')} className="w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all shadow-xl shadow-purple-900/30" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 text-center mb-20 max-w-2xl mx-auto shadow-sm">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Need a custom plan for your brand?</p>
           <h4 className="text-lg font-black text-gray-900 mb-4">Chat with the StoreLink Support Team</h4>
           <a href="mailto:support@storelink.ng" className="inline-flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-tighter hover:underline">
              Contact Support <ArrowLeft className="rotate-180" size={14} />
           </a>
        </div>

      </div>
    </div>
  );
}