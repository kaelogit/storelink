"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Strength Check Logic for UI Feedback
  const isMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // --- PASSWORD STRENGTH & MATCH VALIDATION ---
    if (!isMinLength || !hasNumber) {
      setError("Please follow the password security rules.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    // --------------------------------------------

    const redirectUrl = `${window.location.origin}/onboarding`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          
          <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-gray-900">
             <ArrowLeft size={16}/> Back to Login
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Start Selling</h1>
          
          {success ? (
            <div className="text-center py-10">
              <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email!</h2>
              <p className="text-gray-500 mb-4">We sent a confirmation link to <b>{email}</b>.</p>
              <p className="text-sm text-gray-400 bg-gray-50 p-4 rounded-xl">Click the link in the email to automatically verify your account and start setting up your store.</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-bold border border-red-100">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" placeholder="founder@email.com" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input required type="password" placeholder="Enter password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition" value={password} onChange={e => setPassword(e.target.value)} />
                
                {/* --- PASSWORD RULES UI --- */}
                <div className="mt-2 space-y-1">
                  <div className={`text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider ${isMinLength ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <div className={`w-1 h-1 rounded-full ${isMinLength ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>
                    Minimum 8 Characters
                  </div>
                  <div className={`text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider ${hasNumber ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <div className={`w-1 h-1 rounded-full ${hasNumber ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>
                    Includes at least 1 number
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input required type="password" placeholder="Re-Enter password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-sm shadow-lg hover:bg-gray-800 active:scale-95 transition-all uppercase tracking-widest">
                {loading ? <Loader2 className="animate-spin mx-auto text-emerald-400" /> : "Sign Up & Get Started"}
              </button>
            </form>
          )}
          
          {!success && (
             <p className="mt-6 text-sm text-gray-500 text-center">
                Already have a store? <Link href="/login" className="font-bold text-gray-900 hover:text-emerald-600">Login here</Link>
             </p>
          )}
        </div>
      </div>
    </div>
  );
}