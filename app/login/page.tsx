"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError("Your email address is not verified. Please check your inbox for the confirmation link.");
      } else {
        setError(error.message);
      }
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          
          <Link href="/signup" className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-gray-900">
             <ArrowLeft size={16}/> Back to Home
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-500 text-sm mb-6">Log in to manage your StoreLink empire.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input required type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input required type="password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} />
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
            New vendor? <Link href="/signup" className="font-bold text-gray-900 hover:text-emerald-600">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}