"use client";

import { useState, Suspense } from "react"; // Added Suspense
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import Navbar from "@/components/landing/Navbar";

// 🔥 FIX: Extracted logic into a Content component
function UpdatePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isMinLength || !hasNumber) {
      setError("Please follow the security rules below.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin-update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update password.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-amber-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100 transition-all">
          
          {success ? (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Security Updated</h2>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Your new password is live. <br />
                Redirecting to your <span className="text-gray-900 font-bold">dashboard...</span>
              </p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Lock size={28} strokeWidth={2.5} />
              </div>

              <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter leading-none">
                New <span className="text-amber-500 italic">Credentials</span>
              </h1>
              <p className="text-gray-500 text-sm font-medium mb-8">Secure your account with a strong password.</p>

              <form onSubmit={handleUpdate} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-[10px] rounded-2xl text-center font-black uppercase tracking-widest border border-red-100 animate-in fade-in slide-in-from-top-1">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">New Password</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-bold text-gray-900" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                  
                  <div className="mt-4 space-y-2 px-1">
                    <div className={`text-[9px] flex items-center gap-2 font-black uppercase tracking-widest ${isMinLength ? 'text-emerald-600' : 'text-gray-300'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isMinLength ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                      8+ Characters
                    </div>
                    <div className={`text-[9px] flex items-center gap-2 font-black uppercase tracking-widest ${hasNumber ? 'text-emerald-600' : 'text-gray-300'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                      At least 1 Number
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Confirm New Password</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-bold text-gray-900" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs shadow-xl hover:bg-amber-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin text-amber-400" /> : "Verify & Secure Account"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔥 FIX: Main export wrapped in Suspense for Vercel Build
export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-amber-600" size={40} />
      </div>
    }>
      <UpdatePasswordContent />
    </Suspense>
  );
}