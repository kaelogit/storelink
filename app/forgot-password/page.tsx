"use client";

import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/landing/Navbar";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";
import { Loader2, ArrowLeft, KeyRound } from "lucide-react"; 
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const sellerIntent = searchParams.get("seller_intent") === "1";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Check if user exists (Optional but good for UX)
      // Note: We don't want to leak if an email exists for security, 
      // but for this launch, we focus on functionality.

      // 2. Generate the 6-digit Reset Code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 3. Save to our OTP table (re-using the same table)
      const { error: dbError } = await supabase
        .from("otp_verifications")
        .upsert({ email, code: resetCode }, { onConflict: 'email' });

      if (dbError) throw dbError;

      // 4. Send the Reset Email via our Resend SDK API
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          code: resetCode, 
          type: 'PASSWORD_RESET' 
        }),
      });

      if (!emailResponse.ok) throw new Error("Failed to send reset code.");

      // 5. Send to a modified Verify Page for Reset
      // We pass a 'type' so the verify page knows where to send them next
      router.push(`/verify?email=${encodeURIComponent(email)}&type=recovery&next=${encodeURIComponent(nextPath)}&seller_intent=${sellerIntent ? "1" : "0"}`);

    } catch (err: any) {
      console.error("Reset Error:", err);
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-dvh bg-gray-50 font-sans text-gray-900 ${STOREFRONT_SAFE_BOTTOM}`}>
      <Navbar />
      <div className={`flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center ${STOREFRONT_GUTTER_X} py-6`}>
        <div className="w-full max-w-md rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-2xl sm:p-8 md:p-10">
          
          <Link href={`/login?next=${encodeURIComponent(nextPath)}${sellerIntent ? "&seller_intent=1" : ""}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-8 hover:text-gray-900 transition-colors">
            <ArrowLeft size={14}/> Back to Login
          </Link>
          
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <KeyRound size={32} strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter leading-none">
            Recover <span className="text-amber-500 italic">Access</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mb-8">Enter your email to receive a secure recovery code.</p>

          <form onSubmit={handleResetRequest} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-[10px] rounded-2xl text-center font-black uppercase tracking-widest border border-red-100 animate-pulse">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Registered Email</label>
              <input 
                required 
                type="email" 
                placeholder="example@email.com"
                className="w-full min-h-[48px] rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base font-bold outline-none transition-all focus:bg-white focus:ring-2 focus:ring-amber-500" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gray-900 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-amber-600 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin text-amber-400" /> : "Send Recovery Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}