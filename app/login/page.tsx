"use client";

import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react"; 
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/post-login";
  const sellerIntent = searchParams.get("seller_intent") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [needsMFA, setNeedsMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
         if (error.message.includes('Email not confirmed')) {
           throw new Error("Your email address is not verified. Please check your inbox.");
         } else {
           throw error;
         }
      }

      const { data: factors } = await supabase.auth.mfa.listFactors();
      const has2FA = factors?.all?.some(f => f.status === 'verified');
      
      if (has2FA) {
        setNeedsMFA(true); 
        setLoading(false);
        return; 
      }

      if (sellerIntent) {
        localStorage.setItem("storelink_post_auth_seller_intent", "1");
      }

      const guestIdentityRaw = localStorage.getItem("storelink_guest_identity");
      if (guestIdentityRaw && data?.user?.id) {
        try {
          const guestIdentity = JSON.parse(guestIdentityRaw);
          await supabase.rpc("claim_guest_orders", {
            p_user_id: data.user.id,
            p_email: guestIdentity?.email || null,
            p_phone: guestIdentity?.phone || null,
          });
        } catch {
          // best-effort merge; do not block login
        }
      }

      router.push(nextPath);

    } catch (err: any) {
      setError(err.message);
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

      if (sellerIntent) {
        localStorage.setItem("storelink_post_auth_seller_intent", "1");
      }

      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      const guestIdentityRaw = localStorage.getItem("storelink_guest_identity");
      if (guestIdentityRaw && userId) {
        try {
          const guestIdentity = JSON.parse(guestIdentityRaw);
          await supabase.rpc("claim_guest_orders", {
            p_user_id: userId,
            p_email: guestIdentity?.email || null,
            p_phone: guestIdentity?.phone || null,
          });
        } catch {
          // best-effort merge; do not block login
        }
      }

      router.push(nextPath);

    } catch (err: any) {
      setError("Invalid code. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-gray-900">
             <ArrowLeft size={16}/> Back to Home
          </Link>
          
          {!needsMFA && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
              <p className="text-gray-500 text-sm mb-6">Log in to manage your StoreLink storefront.</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{error}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input required type="password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                
                <div className="text-right">
                  <Link href="/forgot-password" className="text-xs font-bold text-red-500 hover:text-red-600">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Log In"}
                </button>
              </form>

              <p className="mt-6 text-sm text-gray-500 text-center">
                New vendor? <Link href={`/signup?next=${encodeURIComponent(nextPath)}${sellerIntent ? "&seller_intent=1" : ""}`} className="font-bold text-gray-900 hover:text-emerald-600">Sign up here</Link>
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
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-mono tracking-[0.5em] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" 
                  value={mfaCode} 
                  onChange={e => setMfaCode(e.target.value)} 
                />

                <button type="submit" disabled={loading || mfaCode.length !== 6} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition disabled:opacity-50">
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
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>}>
      <LoginContent />
    </Suspense>
  );
}