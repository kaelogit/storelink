"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/landing/Navbar";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react"; // Added MailCheck for consistency
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // redirectTo ensures the user is sent to your custom Update Password page after clicking the email link
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link sent! Check your email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          
          <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16}/> Back to Login
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your email to receive a secure reset link.</p>

          {message ? (
             <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <MailCheck size={32} />
                </div>
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold border border-emerald-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {message}
                </div>
                <p className="text-xs text-gray-400">Can't find it? Check your spam folder.</p>
             </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center font-bold border border-red-100">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  placeholder="Enter your registered email"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-sm shadow-lg hover:bg-gray-800 active:scale-95 transition-all uppercase tracking-widest"
              >
                {loading ? <Loader2 className="animate-spin mx-auto text-emerald-400" /> : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}