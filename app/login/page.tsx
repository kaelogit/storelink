"use client";

import { Suspense, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react"; 
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";
import { isEmailVerifiedForStorefront } from "@/lib/authVerification";

const AUTH_TIMEOUT_MS = 12000;
const NETWORK_RETRY_LIMIT = 2;

function isNetworkLikeError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  const msg = err instanceof Error ? err.message : String(err || "");
  return /networkerror|failed to fetch|fetch failed|network request failed/i.test(msg);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Network request timed out. Please try again.")), timeoutMs)
    ),
  ]);
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/post-login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [needsMFA, setNeedsMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (user) {
        const emailOk = await isEmailVerifiedForStorefront(supabase, user);
        const dest = emailOk ? nextPath : `/verify?email=${encodeURIComponent(user.email || "")}&type=signup&next=${encodeURIComponent(nextPath)}`;
        router.replace(dest);
        return;
      }
      setCheckingSession(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [nextPath, router]);

  const navigateAfterLogin = (path: string) => {
    router.replace(path);
    if (typeof window !== "undefined") {
      // Hard navigation fallback prevents the button from spinning forever
      // if client-side route transition gets stuck.
      window.location.assign(path);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let data: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["data"] | null = null;
      let error: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["error"] | null = null;

      for (let attempt = 0; attempt <= NETWORK_RETRY_LIMIT; attempt += 1) {
        try {
          const result = await withTimeout(
            supabase.auth.signInWithPassword({
              email,
              password,
            }),
            AUTH_TIMEOUT_MS
          );
          data = result.data;
          error = result.error;
          break;
        } catch (attemptErr) {
          if (!isNetworkLikeError(attemptErr) || attempt >= NETWORK_RETRY_LIMIT) {
            throw attemptErr;
          }
          await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
        }
      }

      if (error) {
         if (error.message.includes('Email not confirmed')) {
           throw new Error("Your email address is not verified. Please check your inbox.");
         } else {
           throw error;
         }
      }

      const factorsResult = await Promise.race([
        supabase.auth.mfa.listFactors(),
        new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 6000)),
      ]);
      const factors = factorsResult?.data ?? null;
      const has2FA = factors?.all?.some(f => f.status === 'verified');
      
      if (has2FA) {
        setNeedsMFA(true); 
        setLoading(false);
        return; 
      }

      if (!data?.session) {
        throw new Error("Sign in succeeded but session was not created. Please try again.");
      }
      navigateAfterLogin(nextPath);
      return;

    } catch (err: unknown) {
      const message = isNetworkLikeError(err)
        ? "Cannot reach auth server right now. Check internet/VPN/firewall and try again."
        : err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  const verifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.all?.find(f => f.factor_type === 'totp');
      if (!totpFactor) throw new Error("No 2FA factor found");

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id
      });
      
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code: mfaCode
      });

      if (verifyError) throw verifyError;

      navigateAfterLogin(nextPath);
      return;

    } catch {
      setError("Invalid code. Please try again.");
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className={`min-h-dvh bg-gray-50 font-sans ${STOREFRONT_SAFE_BOTTOM} flex items-center justify-center`}>
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-dvh bg-gray-50 font-sans ${STOREFRONT_SAFE_BOTTOM}`}>
      <Navbar />
      <div className={`flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center ${STOREFRONT_GUTTER_X} py-6`}>
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
          
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-gray-900">
             <ArrowLeft size={16}/> Back to Home
          </Link>
          
          {!needsMFA && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
              <p className="text-gray-500 text-sm mb-2">Sign in to shop, track orders, or manage your storefront.</p>
              
              
              <form onSubmit={handleLogin} className="space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{error}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required type="email" className="w-full min-h-[48px] rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-base outline-none transition focus:border-emerald-500" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input required type="password" className="w-full min-h-[48px] rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-base outline-none transition focus:border-emerald-500" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                
                <div className="text-right">
                  <Link href="/forgot-password" className="text-xs font-bold text-red-500 hover:text-red-600">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" disabled={loading} className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-gray-900 py-3.5 font-bold text-white shadow-lg transition hover:bg-gray-800 disabled:opacity-60">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Log In"}
                </button>
              </form>

              <p className="mt-6 text-sm text-gray-500 text-center">
                New to StoreLink?{" "}
                <Link
                  href={`/signup?next=${encodeURIComponent(nextPath)}`}
                  className="font-bold text-gray-900 hover:text-emerald-600"
                >
                  Sign up
                </Link>{" "}
                to shop the marketplace or open a store.
              </p>
            </>
          )}

          {needsMFA && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="text-center mb-6">
                 <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                   <ShieldCheck size={24} />
                 </div>
                 <h1 className="text-xl font-bold text-gray-900">Security Check</h1>
                 <p className="text-gray-500 text-sm">Enter the code from Google Authenticator</p>
              </div>

              <form onSubmit={verifyMFA} className="space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{error}</div>}
                
                <input 
                  autoFocus
                  type="text" 
                  maxLength={6}
                  placeholder="000000"
                  className="w-full min-h-[48px] rounded-xl border border-gray-200 bg-gray-50 p-4 text-center font-mono text-2xl tracking-[0.5em] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" 
                  value={mfaCode} 
                  onChange={e => setMfaCode(e.target.value)} 
                />

                <button type="submit" disabled={loading || mfaCode.length !== 6} className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Login"}
                </button>

                <button type="button" onClick={() => setNeedsMFA(false)} className="w-full py-2 text-sm text-gray-500 hover:text-gray-900">
                  Cancel
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>}>
      <LoginContent />
    </Suspense>
  );
}