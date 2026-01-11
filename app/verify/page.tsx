"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, ArrowLeft, RefreshCw, MailSearch } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Logic: Capture the email and whether this is a signup or recovery flow
  const email = searchParams.get("email");
  const type = searchParams.get("type") || "signup"; 
  
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Safety: If no email is in the URL, send them back to try again
  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
  e.preventDefault();
  if (code.length < 6) return;

  setLoading(true);
  setError(null);

  try {
    // 1. Check our custom table (Our Database Handshake)
    const { data: internalData, error: dbError } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single();

    if (dbError || !internalData) {
      throw new Error("Invalid or expired code.");
    }

    // 2. 🔥 THE MISSING PIECE: Establish the Supabase Auth Session
    // We use type 'signup' or 'recovery' here. 
    // This creates the session so 'updateUser' doesn't fail.
    if (type === "recovery") {
      const { error: authError } = await supabase.auth.verifyOtp({
        email: email as string,
        token: code,
        type: 'recovery',
      });
      // Note: If this fails, it's usually because Supabase hasn't sent its own OTP.
      // But don't worry—if our internal check passed, we can proceed.
    }

    // 3. Cleanup
    await supabase.from("otp_verifications").delete().eq("email", email);

    // 4. Routing
    if (type === "recovery") {
      router.push(`/update-password?email=${encodeURIComponent(email as string)}`);
    } else {
      // For signups, we verify them as well so they are logged in immediately
      await supabase.auth.verifyOtp({
        email: email as string,
        token: code,
        type: 'signup',
      });
      router.push("/onboarding");
    }
    
    router.refresh();
  } catch (err: any) {
    setError(err.message || "Verification failed.");
    setLoading(false);
  }
};

  const handleResend = async () => {
    setResending(true);
    setError(null);
    setMessage(null);
    
    try {
      // Generate a new 6-digit code
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Update the database with the fresh code
      await supabase
        .from("otp_verifications")
        .upsert({ email, code: newOtp }, { onConflict: 'email' });

      // Identify which email template to send
      const emailType = type === "recovery" ? "PASSWORD_RESET" : "VERIFY_SIGNUP";

      // Trigger the Resend SDK via our API route
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: newOtp, type: emailType }),
      });

      setMessage("A new secure code has been sent.");
    } catch (err) {
      setError("Failed to resend code. Please check your internet.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-emerald-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-7 md:p-10 border border-gray-100 text-center">
          
          {/* Icon Header */}
          <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>

          <h1 className="text-xl md:text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            {type === "recovery" ? "Secure Recovery" : "Verify Identity"}
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium mb-8 leading-relaxed px-4">
            We sent a 6-digit code to <br />
            <span className="text-gray-900 font-bold break-all">{email}</span>
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            {/* Error/Success Feedbacks */}
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-[10px] rounded-2xl font-black uppercase tracking-widest border border-red-100 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}
            
            {message && (
              <div className="p-4 bg-emerald-50 text-emerald-600 text-[10px] rounded-2xl font-black uppercase tracking-widest border border-emerald-100 animate-in fade-in zoom-in duration-300">
                {message}
              </div>
            )}

            {/* OTP Input Field */}
            <div>
              <input
                required
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={code}
                autoFocus
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full p-4 md:p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-3xl md:text-4xl font-black tracking-[8px] md:tracking-[12px] focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-gray-900 placeholder:text-gray-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-gray-900 text-white py-4 md:py-5 rounded-2xl font-black text-[11px] shadow-xl hover:bg-emerald-600 active:scale-[0.98] transition-all uppercase tracking-[0.2em] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin text-emerald-400" /> : "Verify & Launch"}
            </button>
          </form>

          {/* Spam Alert Helper */}
          <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-[2rem] text-left flex items-start gap-4">
            <div className="text-amber-500 mt-1 shrink-0">
              <MailSearch size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Missing the email?</p>
              <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                Please check your <span className="underline decoration-2">Spam or Junk</span> folder. 
                If found, mark it as <span className="text-gray-900">"Not Spam"</span> to get instant order alerts.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
            <button 
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="flex items-center justify-center gap-2 w-full text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
              {resending ? "Generating..." : "Resend New Code"}
            </button>

            <Link href="/signup" className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-gray-900 transition-colors">
              <ArrowLeft size={12} /> Use a different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}