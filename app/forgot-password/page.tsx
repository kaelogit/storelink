"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/landing/Navbar";
import { Loader2, ArrowLeft, KeyRound } from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Check if user exists (Optional but good for UX)
      // Note: We don't want to leak if an email exists for security, 
      // but for this launch, we focus on functionality.

      // 2. Generate the 6-digit Reset Code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 3. Save to our OTP table (re-using the same table)
      const { error: dbError } = await supabase
        .from("otp_verifications")
        .upsert({ email, code: resetCode }, { onConflict: 'email' });

      if (dbError) throw dbError;

      // 4. Send the Reset Email via our Resend SDK API
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          code: resetCode, 
          type: 'PASSWORD_RESET' 
        }),
      });

      if (!emailResponse.ok) throw new Error("Failed to send reset code.");

      // 5. Send to a modified Verify Page for Reset
      // We pass a 'type' so the verify page knows where to send them next
      router.push(`/verify?email=${encodeURIComponent(email)}&type=recovery`);

    } catch (err: any) {
      console.error("Reset Error:", err);
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100">
          
          <Link href="/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-8 hover:text-gray-900 transition-colors">
            <ArrowLeft size={14}/> Back to Login
          </Link>
          
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <KeyRound size={32} strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter leading-none">
            Recover <span className="text-amber-500 italic">Access</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mb-8">Enter your email to receive a secure recovery code.</p>

          <form onSubmit={handleResetRequest} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-[10px] rounded-2xl text-center font-black uppercase tracking-widest border border-red-100 animate-pulse">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Registered Email</label>
              <input 
                required 
                type="email" 
                placeholder="example@email.com"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-bold" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs shadow-xl hover:bg-amber-600 active:scale-95 transition-all uppercase tracking-[0.2em] flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin text-amber-400" /> : "Send Recovery Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}