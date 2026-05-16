"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/post-login";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedLegal, setAgreedLegal] = useState(false);

  // Capture referral code if present
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("storelink_ref", ref);
    }
  }, [searchParams]);

  const isMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);

  const sendSignupOtpEmail = async (recipient: string, otpCode: string): Promise<void> => {
    const attempts = 2;
    let lastError = "Failed to send verification email.";

    for (let i = 0; i < attempts; i += 1) {
      try {
        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: recipient,
            code: otpCode,
            type: "VERIFY_SIGNUP",
          }),
        });

        if (emailResponse.ok) return;

        const payload = (await emailResponse.json().catch(() => ({}))) as { error?: unknown };
        const errorText =
          typeof payload.error === "string"
            ? payload.error
            : `Verification email failed (${emailResponse.status}). Please try again.`;
        lastError = errorText;
      } catch {
        lastError = "Verification email network error. Please check your connection and try again.";
      }

      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    throw new Error(lastError);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Basic Security Checks
      if (!isMinLength || !hasNumber) {
        throw new Error("Password must be 8+ characters with at least 1 number.");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      if (!agreedLegal) {
        throw new Error("Please agree to the Terms of Service and Privacy Policy to continue.");
      }

      // 2. Create the User in Supabase
      // Note: Make sure 'Confirm Email' is OFF in your Supabase Dashboard
      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Normalize legacy trial defaults on freshly created buyer profiles.
      if (signUpData?.user?.id) {
        await supabase
          .from("profiles")
          .update({
            subscription_plan: "none",
            subscription_status: "none",
            updated_at: new Date().toISOString(),
          })
          .eq("id", signUpData.user.id);
      }

      // 3. Generate a 6-digit Verification Code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiryIso = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      // 4. Save Code to your Database (The Memory Table)
      const { error: dbError } = await supabase
        .from("otp_verifications")
        .upsert({ email, code: otpCode, expires_at: otpExpiryIso }, { onConflict: "email" });

      if (dbError) throw dbError;

      // 5. Send verification email (with retry). Do not continue if delivery request fails.
      await sendSignupOtpEmail(email, otpCode);

      // 6. Move to the Verification Screen
      router.push(`/verify?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`);

    } catch (err: unknown) {
      console.error("Signup Error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-dvh bg-gray-50 font-sans ${STOREFRONT_SAFE_BOTTOM}`}>
      <Navbar />
      <div className={`flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center ${STOREFRONT_GUTTER_X} py-6`}>
        <div className="w-full max-w-md rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-2xl sm:p-8 md:p-10">
          
          <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-8 hover:text-gray-900 transition-colors">
             <ArrowLeft size={14}/> Back to Login
          </Link>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter leading-none">
            Join <span className="text-emerald-500 italic">StoreLink</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mb-6">
            Create an account to shop and track orders.
          </p>
          
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-[10px] rounded-2xl text-center font-black uppercase tracking-widest border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Email Address</label>
              <input 
                required 
                type="email" 
                placeholder="you@example.com" 
                className="w-full min-h-[48px] rounded-2xl border border-gray-100 bg-gray-50 p-4 text-base font-bold text-gray-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Create Password</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                className="w-full min-h-[48px] rounded-2xl border border-gray-100 bg-gray-50 p-4 text-base font-bold text-gray-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              
              <div className="mt-3 flex gap-4">
                <div className={`text-[9px] flex items-center gap-1.5 font-black uppercase tracking-widest ${isMinLength ? 'text-emerald-600' : 'text-gray-300'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isMinLength ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
                  8+ Characters
                </div>
                <div className={`text-[9px] flex items-center gap-1.5 font-black uppercase tracking-widest ${hasNumber ? 'text-emerald-600' : 'text-gray-300'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
                  1+ Number
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Repeat Password</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                className="w-full min-h-[48px] rounded-2xl border border-gray-100 bg-gray-50 p-4 text-base font-bold text-gray-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
              />
            </div>

            <label className="flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <input
                type="checkbox"
                checked={agreedLegal}
                onChange={(e) => setAgreedLegal(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-600"
                required
              />
              <span className="text-[11px] font-bold leading-relaxed text-gray-600 normal-case tracking-normal">
                I agree to the{" "}
                <Link href="/terms" className="text-emerald-700 underline underline-offset-2 font-black">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-emerald-700 underline underline-offset-2 font-black">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <button 
              type="submit" 
              disabled={loading || !agreedLegal} 
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gray-900 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-emerald-600 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin text-emerald-400" /> : "Sign Up & Get Started"}
            </button>
          </form>
          
          <p className="mt-8 text-[11px] font-bold text-gray-400 text-center uppercase tracking-widest">
            Have an account? <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="text-gray-900 hover:text-emerald-600 underline decoration-2 underline-offset-4 transition-colors">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>}>
      <SignupContent />
    </Suspense>
  );
}