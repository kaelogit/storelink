"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { isEmailVerifiedForStorefront } from "@/lib/authVerification";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, ArrowLeft, RefreshCw, MailSearch } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get("email");
  const type = searchParams.get("type") || "signup"; 
  const nextPath = searchParams.get("next") || "/post-login";
  
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [otpExpiresAtMs, setOtpExpiresAtMs] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const computeExpiryMs = (row: { expires_at?: string | null; created_at?: string | null } | null): number | null => {
    if (!row) return null;
    if (row.expires_at) {
      const explicit = new Date(row.expires_at).getTime();
      if (!Number.isNaN(explicit)) return explicit;
    }
    if (row.created_at) {
      const created = new Date(row.created_at).getTime();
      if (!Number.isNaN(created)) return created + 15 * 60 * 1000;
    }
    return null;
  };

  const refreshOtpWindow = useCallback(async () => {
    if (!email) return;
    const { data } = await supabase
      .from("otp_verifications")
      .select("created_at, expires_at")
      .eq("email", email)
      .maybeSingle();
    const expiry = computeExpiryMs(
      (data as { created_at?: string | null; expires_at?: string | null } | null) || null
    );
    setOtpExpiresAtMs(expiry);
  }, [email]);

  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  useEffect(() => {
    void refreshOtpWindow();
  }, [refreshOtpWindow]);

  useEffect(() => {
    if (!otpExpiresAtMs) {
      setSecondsLeft(0);
      return;
    }
    const tick = () => {
      const secs = Math.max(0, Math.ceil((otpExpiresAtMs - Date.now()) / 1000));
      setSecondsLeft(secs);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [otpExpiresAtMs]);

  /** Email already verified (`is_verified === true`) — skip OTP; this is not KYC. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled || !user) return;
      const paramEmail = String(email || "").trim().toLowerCase();
      if (paramEmail && user.email?.toLowerCase() !== paramEmail) return;
      const ok = await isEmailVerifiedForStorefront(supabase, user);
      if (cancelled || !ok) return;
      router.replace(nextPath);
      router.refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [email, nextPath, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return;

    setLoading(true);
    setError(null);

    try {
      const normalizedEmail = String(email || "").trim().toLowerCase();
      const normalizedCode = code.trim();

      // 1) Mobile parity: match by email + code directly.
      const { data: matchedCode, error: matchError } = await supabase
        .from("otp_verifications")
        .select("created_at, expires_at")
        .eq("email", normalizedEmail)
        .eq("code", normalizedCode)
        .maybeSingle();

      if (matchError) {
        throw new Error("Could not validate code right now. Please try again.");
      }

      if (!matchedCode) {
        // 2) If no direct match, determine whether it's expired vs replaced/invalid.
        const { data: latestRow } = await supabase
          .from("otp_verifications")
          .select("code, created_at, expires_at")
          .eq("email", normalizedEmail)
          .maybeSingle();

        const latest = latestRow as
          | {
              code?: string | null;
              created_at?: string | null;
              expires_at?: string | null;
            }
          | null;
        const latestExpiry = computeExpiryMs(latest);
        if (!latest || !latestExpiry || Date.now() > latestExpiry) {
          setOtpExpiresAtMs(0);
          throw new Error("Code expired. Resend a new code.");
        }
        throw new Error("Code is invalid or replaced. Resend a new code.");
      }

      const expiryMs = computeExpiryMs(
        matchedCode as { created_at?: string | null; expires_at?: string | null } | null
      );
      if (!expiryMs || Date.now() > expiryMs) {
        setOtpExpiresAtMs(0);
        throw new Error("Code expired. Resend a new code.");
      }

      // 2. Profile bootstrap — align with app/mobile gate.
      if (type !== "recovery") {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data: prof } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq(user?.id ? "id" : "email", user?.id ?? normalizedEmail)
          .maybeSingle();

        const updateQuery = supabase
          .from("profiles")
          .update({
            is_verified: true,
            subscription_plan: "none",
            subscription_status: "none",
            updated_at: new Date().toISOString(),
          })
          .eq(user?.id ? "id" : "email", user?.id ?? normalizedEmail);
        await updateQuery;

        if (prof?.onboarding_completed !== true) {
          await supabase
            .from("profiles")
            .update({
              onboarding_step: "role",
              updated_at: new Date().toISOString(),
            })
            .eq(user?.id ? "id" : "email", user?.id ?? normalizedEmail);
        }
      }

      // 3. Cleanup OTP
      await supabase.from("otp_verifications").delete().eq("email", normalizedEmail);

      // 4. Final Routing
      if (type === "recovery") {
        router.push(`/update-password?email=${encodeURIComponent(normalizedEmail)}`);
      } else {
        // Redirect to requested flow (supports checkout resume)
        router.push(nextPath);
      }
      
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    setMessage(null);
    
    try {
      const normalizedEmail = String(email || "").trim().toLowerCase();
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const nextExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      
      await supabase
        .from("otp_verifications")
        .upsert({ email: normalizedEmail, code: newOtp, expires_at: nextExpiry }, { onConflict: "email" });

      const emailType = type === "recovery" ? "PASSWORD_RESET" : "VERIFY_SIGNUP";

      const resendRes = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, code: newOtp, type: emailType }),
      });

      if (!resendRes.ok) {
        const payload = await resendRes.json().catch(() => ({}));
        throw new Error(
          (payload as { error?: string }).error ||
            `Could not send email (${resendRes.status}). Check RESEND_API_KEY and spam folder.`,
        );
      }

      setMessage("A new secure code has been sent.");
      setOtpExpiresAtMs(new Date(nextExpiry).getTime());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  const hasOtpWindow = otpExpiresAtMs != null;
  const isCodeExpired = hasOtpWindow && secondsLeft <= 0;

  return (
    <div className={`min-h-dvh bg-gray-50 font-sans selection:bg-emerald-100 ${STOREFRONT_SAFE_BOTTOM}`}>
      <Navbar />
      <div className={`flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center py-6 ${STOREFRONT_GUTTER_X}`}>
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-7 md:p-10 border border-gray-100 text-center">
          
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
          {hasOtpWindow ? (
            isCodeExpired ? (
              <p className="mb-6 text-[11px] font-black uppercase tracking-widest text-red-600">
                Your code expired. Resend a new code.
              </p>
            ) : (
              <p className="mb-6 text-[11px] font-black uppercase tracking-widest text-amber-600">
                Code expires in {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
              </p>
            )
          ) : (
            <p className="mb-6 text-[11px] font-black uppercase tracking-widest text-amber-600">
              Code valid for 15 minutes.
            </p>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-[10px] rounded-2xl font-black uppercase border border-red-100">
                {error}
              </div>
            )}
            
            {message && (
              <div className="p-4 bg-emerald-50 text-emerald-600 text-[10px] rounded-2xl font-black uppercase border border-emerald-100">
                {message}
              </div>
            )}

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
                className="w-full min-h-[52px] rounded-2xl border-2 border-gray-100 bg-gray-50 p-4 text-center text-3xl font-black tracking-[12px] text-gray-900 outline-none transition-all placeholder:text-gray-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50 md:p-5 md:text-4xl"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6 || isCodeExpired}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gray-900 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50 md:py-5"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify"}
            </button>
          </form>

          <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-[2rem] text-left flex items-start gap-4">
            <div className="text-amber-500 mt-1 shrink-0">
              <MailSearch size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Missing the email?</p>
              <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                Check your <span className="underline decoration-2">Spam or Junk</span> folder. 
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
            <button 
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 transition-colors hover:text-emerald-600 disabled:opacity-50"
            >
              <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
              {resending ? "Generating..." : "Resend New Code"}
            </button>

            <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} className="flex min-h-[44px] items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 transition-colors hover:text-gray-900">
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
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}