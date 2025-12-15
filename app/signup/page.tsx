"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectUrl = `${window.location.origin}/onboarding`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl, // <--- GOES TO ONBOARDING AFTER CONFIRMATION
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
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input required type="password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Sign Up & Get Started"}
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