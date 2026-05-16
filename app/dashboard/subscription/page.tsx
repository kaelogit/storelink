"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Check,
  Star,
  Shield,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Trophy,
  Sparkles,
  Download,
  LayoutDashboard,
  X,
} from "lucide-react";
import { effectiveSellerTier } from "@/utils/marketplaceDiscovery";
import { BILLING_DURATIONS, calculateDiamondPrice, majorToPaystackSmallestUnit, SUBSCRIPTION_PRICES } from "@/lib/subscriptionPricing";
import { STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [currentPlan, setCurrentPlan] = useState("standard");
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [billingMonths, setBillingMonths] = useState<number>(1);
  const [billingCurrency, setBillingCurrency] = useState("NGN");
  const [lastPaidMonths, setLastPaidMonths] = useState(1);
  const [receiptMajorAmount, setReceiptMajorAmount] = useState<number | null>(null);
  const [receiptCurrencySnapshot, setReceiptCurrencySnapshot] = useState("NGN");
  
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

      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "display_name, full_name, slug, subscription_plan, subscription_expiry, subscription_status, currency_code, is_seller"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        const label =
          profile.display_name?.trim() || profile.full_name?.trim() || user.email?.split("@")[0] || "My storefront";
        setStoreName(label);
        setStoreSlug(profile.slug?.trim() || "");
        setCurrentPlan(profile.subscription_plan || "standard");
        setExpiryDate(profile.subscription_expiry ?? null);
        setSubscriptionStatus(profile.subscription_status ?? null);
        setBillingCurrency(String(profile.currency_code || "NGN").toUpperCase());
      }
      setLoading(false);
    };
    loadData();
  }, [router]);

  const formatMajor = (amount: number, code: string) => {
    const c = code.toUpperCase();
    const prefix = c === "NGN" ? "₦" : `${c} `;
    const body =
      c === "NGN"
        ? amount.toLocaleString("en-NG")
        : amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
    return `${prefix}${body}`;
  };

  const handleSuccess = async (reference: any, amountPaid: number, months: number, currencyPaid: string) => {
    if (!user?.id) {
      setStatusMsg({ type: "error", text: "Session expired. Log in again and contact support with your Paystack reference." });
      return;
    }
    const { error: rpcError } = await supabase.rpc("upgrade_user_subscription", {
      p_user_id: user.id,
      p_plan: "diamond",
      p_months: months,
    });

    if (rpcError) {
      setStatusMsg({
        type: "error",
        text: `Payment recorded but plan sync failed: ${rpcError.message}. Contact support with your Paystack reference.`,
      });
      return;
    }

    await supabase.from("transactions").insert({
      seller_id: user.id,
      owner_id: user.id,
      amount: amountPaid,
      plan_type: "diamond",
      status: "success",
    });

    const { data: refreshed } = await supabase
      .from("profiles")
      .select("subscription_expiry, subscription_plan, subscription_status")
      .eq("id", user.id)
      .maybeSingle();

    setReceiptRef(reference.reference);
    setLastPaidMonths(months);
    setReceiptMajorAmount(amountPaid);
    setReceiptCurrencySnapshot(String(currencyPaid || "NGN").toUpperCase());
    setUpgradedPlan("diamond");
    if (refreshed?.subscription_expiry) setExpiryDate(refreshed.subscription_expiry);
    setCurrentPlan(refreshed?.subscription_plan || "diamond");
    setSubscriptionStatus(refreshed?.subscription_status ?? null);
    setShowSuccessModal(true);
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

  const getPaystackConfig = () => {
    const { finalPrice } = calculateDiamondPrice("seller", billingMonths, billingCurrency);
    const activeDiamond =
      effectiveSellerTier(currentPlan, expiryDate, subscriptionStatus) === "diamond";
    const renewing =
      activeDiamond && expiryDate && new Date(expiryDate) > new Date();
    return {
      reference: new Date().getTime().toString(),
      email: user?.email || "customer@storelink.com",
      amount: majorToPaystackSmallestUnit(finalPrice, billingCurrency),
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || "",
      text: renewing ? `Renew Diamond (${billingMonths} mo)` : `Upgrade Diamond (${billingMonths} mo)`,
      onSuccess: (ref: any) => handleSuccess(ref, finalPrice, billingMonths, billingCurrency),
      onClose: () => {
        setStatusMsg({ type: "error", text: "Payment cancelled." });
        setTimeout(() => setStatusMsg(null), 3000);
      },
    };
  };

  if (loading) return <div className="flex min-h-dvh items-center justify-center"><Loader2 className="animate-spin text-gray-400"/></div>;

  const effective = effectiveSellerTier(currentPlan, expiryDate, subscriptionStatus);
  const displayTier = effective === "diamond" ? "Diamond" : "Standard";
  const boostLapsed = currentPlan === "diamond" && effective === "standard";

  const { finalPrice: checkoutTotal, perMonth: diamondPerMonth, discount: activeDiscount } = calculateDiamondPrice(
    "seller",
    billingMonths,
    billingCurrency
  );
  const baseRow = SUBSCRIPTION_PRICES[billingCurrency.toUpperCase()] ?? SUBSCRIPTION_PRICES.NGN;
  const listTotalUndiscounted = baseRow.seller_diamond * billingMonths;
  const currencyPrefix = billingCurrency === "NGN" ? "₦" : `${billingCurrency} `;
  const diamondPriceLabel =
    billingCurrency === "NGN"
      ? checkoutTotal.toLocaleString("en-NG")
      : checkoutTotal.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <div className={`min-h-dvh bg-gray-50 pb-20 font-sans relative print:bg-white overflow-x-hidden ${STOREFRONT_SAFE_BOTTOM}`}>
      
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-300 print:hidden">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 md:p-10 text-center shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500 overflow-y-auto max-h-[90vh]">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                 <Trophy size={40} className="text-emerald-600 animate-bounce" />
                 <Sparkles className="absolute -top-1 -right-1 text-amber-500 animate-pulse" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Plan upgraded!</h2>
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
                  <span className="font-black text-gray-900">
                    {receiptMajorAmount != null
                      ? formatMajor(receiptMajorAmount, receiptCurrencySnapshot)
                      : `${currencyPrefix}${diamondPriceLabel}`}
                  </span>
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
                    <p className="font-black text-gray-900 uppercase">Diamond subscription</p>
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
                        <p className="text-xs text-gray-400">{lastPaidMonths} month{lastPaidMonths === 1 ? "" : "s"} Diamond access</p>
                    </td>
                    <td className="py-6 text-right font-black text-xl text-gray-900">
                        {receiptMajorAmount != null
                          ? formatMajor(receiptMajorAmount, receiptCurrencySnapshot)
                          : `${currencyPrefix}${diamondPriceLabel}`}
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
                    <p className="font-black text-3xl">
                      {receiptMajorAmount != null
                        ? formatMajor(receiptMajorAmount, receiptCurrencySnapshot)
                        : `${currencyPrefix}${diamondPriceLabel}`}
                    </p>
                </div>
                </div>

                <p className="text-center text-[10px] text-gray-300 font-bold mt-12 uppercase tracking-[0.3em]">Thank you for growing with StoreLink</p>
            </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-6 md:py-10 mb-8 print:hidden">
         <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
               <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter">Visibility &amp; boosts</h1>
               
            </div>
            <button onClick={() => router.push("/dashboard")} className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest bg-gray-100 px-6 py-3 rounded-2xl transition-all self-start sm:self-center">
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 print:hidden">
        
        <div className="p-6 md:p-8 rounded-[2rem] border shadow-sm mb-12 bg-white border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Effective tier</h2>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`text-3xl md:text-4xl font-black uppercase tracking-tighter ${
                  effective === "diamond" ? "text-purple-600" : "text-gray-900"
                }`}
              >
                {displayTier}
              </span>
              {effective === "diamond" && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200">
                  Boost active
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-gray-500 max-w-xl leading-relaxed">
              Your storefront link stays online on Standard. Diamond only changes tools and discovery priority—it never takes your store offline.
            </p>
            {effective === "diamond" && expiryDate && new Date(expiryDate) >= new Date() && (
              <p className="text-xs font-bold text-gray-400">
                Paid boost renews on {new Date(expiryDate).toLocaleDateString()}
              </p>
            )}
            {boostLapsed && (
              <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 inline-block">
                {expiryDate
                  ? `Your Diamond period ended on ${new Date(expiryDate).toLocaleDateString()}. You're on Standard again—renew anytime for extra visibility.`
                  : "Your Diamond boost has ended. You're on Standard again—renew anytime for extra visibility."}
              </p>
            )}
          </div>
        </div>

        {statusMsg && (
          <div className={`p-5 mb-8 rounded-[1.5rem] border flex items-center gap-3 animate-in slide-in-from-top-2 ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {statusMsg.type === 'success' ? <Check size={20} strokeWidth={3} /> : <AlertTriangle size={20} />}
              <span className="font-black text-xs uppercase tracking-tight">{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 items-stretch max-w-5xl mx-auto">
          <div
            className={`bg-white p-8 rounded-[2.5rem] border-2 flex flex-col transition-all duration-300 ${
              effective === "standard"
                ? "border-gray-900 shadow-xl scale-[1.02]"
                : "border-gray-100 shadow-sm opacity-80"
            }`}
          >
            <div className="mb-6 bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
              <Shield size={28} />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Standard</h3>
            <div className="mt-2 mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-black">Free</span>
            </div>
            <ul className="space-y-5 text-xs font-bold text-gray-500 mb-10 flex-1">
              <li className="flex gap-4 items-center">
                <div className="bg-emerald-100 text-emerald-600 p-1 rounded-md">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>Unlimited products</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-emerald-100 text-emerald-600 p-1 rounded-md">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>Full storefront &amp; checkout</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-emerald-100 text-emerald-600 p-1 rounded-md">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>Fair marketplace discovery</span>
              </li>
              <li className="flex gap-4 items-center opacity-40 italic">
                <X size={14} /> <span>Diamond-only AI background removal</span>
              </li>
            </ul>
            <button
              disabled
              className="w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed"
            >
              {effective === "standard" ? "Your default plan" : "Included for every seller"}
            </button>
          </div>

          <div
            className={`bg-gray-900 p-8 rounded-[2.5rem] border-2 relative overflow-hidden flex flex-col transition-all duration-300 ${
              effective === "diamond"
                ? "border-purple-500 shadow-2xl scale-[1.02]"
                : "border-gray-800 shadow-xl shadow-gray-200"
            }`}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-white text-[9px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg">
              Diamond
            </div>
            <div className="mb-6 bg-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-400 border border-gray-700">
              <Star size={28} fill="currentColor" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Diamond</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Billing cycle</p>
            <p className="text-xs text-gray-500 mt-1 mb-1">
              Same options as the app: Monthly, Quarterly, Biannual (6 mo), Yearly — with the same term discounts (5%, 8%, 12%).
            </p>
            <div className="flex flex-wrap gap-2 mt-3 mb-4">
              {BILLING_DURATIONS.map((d) => (
                <button
                  key={d.months}
                  type="button"
                  onClick={() => setBillingMonths(d.months)}
                  className={`relative px-3 py-2.5 rounded-xl text-left min-w-[7.5rem] border transition ${
                    billingMonths === d.months
                      ? "bg-purple-500 border-purple-400 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"
                  }`}
                >
                  <span className="block text-[10px] font-black uppercase tracking-tight">{d.label}</span>
                  {d.discount > 0 ? (
                    <span className="absolute -top-1.5 -right-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-black text-gray-900">
                      −{Math.round(d.discount * 100)}%
                    </span>
                  ) : (
                    <span className="block text-[9px] font-bold text-gray-500 mt-1">List price</span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-1 mb-8">
              {activeDiscount > 0 ? (
                <p className="text-gray-500 text-xs font-medium mb-1">
                  <span className="line-through opacity-70">
                    {currencyPrefix}
                    {billingCurrency === "NGN"
                      ? listTotalUndiscounted.toLocaleString("en-NG")
                      : listTotalUndiscounted.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Save {Math.round(activeDiscount * 100)}%
                  </span>
                </p>
              ) : null}
              <p className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {currencyPrefix}
                {diamondPriceLabel}
              </p>
              <p className="text-gray-400 text-xs font-medium mt-1">
                Total for {billingMonths} month{billingMonths === 1 ? "" : "s"} · effective ~{" "}
                {billingCurrency === "NGN"
                  ? `₦${diamondPerMonth.toLocaleString("en-NG")}`
                  : `${billingCurrency} ${diamondPerMonth.toLocaleString("en-US", { maximumFractionDigits: 2 })}`}
                /mo
              </p>
            </div>
            <ul className="space-y-5 text-xs font-bold text-gray-300 mb-10 flex-1">
              <li className="flex gap-4 items-center">
                <div className="bg-purple-500 text-white p-1 rounded-md">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-white">Higher discovery caps &amp; ranking priority</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-purple-500 text-white p-1 rounded-md">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-white">Trending / homepage-style spotlight</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-purple-500 text-white p-1 rounded-md">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-white">Stronger marketplace presence vs Standard</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="bg-purple-500 text-white p-1 rounded-md">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>One-click AI background cleanup</span>
              </li>
            </ul>
            <PaystackButton
              {...getPaystackConfig()}
              className="w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all shadow-xl shadow-purple-900/30"
            />
          </div>
        </div>

      </div>
    </div>
  );
}