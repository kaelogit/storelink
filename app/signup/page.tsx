"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react"; // Removed CheckCircle since we're auto-redirecting
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Capture referral code
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("storelink_ref", ref);
    }
  }, [searchParams]);

  const isMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isMinLength || !hasNumber) {
        throw new Error("Please follow the password security rules.");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      // Supabase Signup Call
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) throw signupError;

      // 🔥 INSTANT REDIRECT: Since email confirmation is OFF, 
      // Supabase returns a session immediately. We send them to onboarding now.
      if (data?.user) {
        router.push("/onboarding");
        router.refresh(); // Ensures the middleware recognizes the new session
      }
    } catch (err: any) {
      console.error("Signup process failed:", err);
      setError(err.message || "Signup failed. Please try again.");
      setLoading(false); // Only stop loading if there is an error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100">
          
          <Link href="/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-8 hover:text-gray-900 transition-colors">
             <ArrowLeft size={14}/> Back to Login
          </Link>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter leading-none">
            Start Your <span className="text-emerald-500 italic">Empire</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mb-8">Launch your store now.</p>
          
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-[11px] rounded-2xl text-center font-black uppercase tracking-widest border border-red-100 animate-pulse">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Business Email</label>
              <input 
                required 
                type="email" 
                placeholder="ceo@yourbrand.com" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold text-gray-900" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Security Password</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold text-gray-900" 
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
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Verify Password</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold text-gray-900" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs shadow-xl hover:bg-emerald-600 active:scale-95 transition-all uppercase tracking-[0.2em] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin text-emerald-400" /> : "Sign up & Get started"}
            </button>
          </form>
          
          <p className="mt-8 text-[11px] font-bold text-gray-400 text-center uppercase tracking-widest">
            Already own a store? <Link href="/login" className="text-gray-900 hover:text-emerald-600 underline decoration-2 underline-offset-4 transition-colors">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Initializing Engine...</p>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}