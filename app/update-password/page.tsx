"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import Navbar from "@/components/landing/Navbar";

export default function UpdatePasswordPage() {
  const router = useRouter();
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

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl p-8 border border-gray-100 transition-all">
          
          <div className="flex items-center gap-2 mb-6 text-gray-900">
             <ShieldCheck className="text-emerald-600" size={24}/>
             <h1 className="text-2xl font-black tracking-tight">Set New Password</h1>
          </div>

          {success ? (
            <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={56} className="text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-black text-gray-900 mb-2">Password Secured</h2>
              <p className="text-gray-500 text-sm">Your new credentials are live. Entering dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center font-bold border border-red-100 animate-shake">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                <input 
                  required 
                  type="password" 
                  placeholder="Enter password"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all font-medium" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                
                <div className="mt-3 space-y-1.5 px-1">
                  <div className={`text-[10px] flex items-center gap-2 font-black uppercase tracking-widest ${isMinLength ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isMinLength ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                    Minimum 8 Characters
                  </div>
                  <div className={`text-[10px] flex items-center gap-2 font-black uppercase tracking-widest ${hasNumber ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                    Include at least 1 number
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
                <input 
                  required 
                  type="password" 
                  placeholder="Re-Enter password"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all font-medium" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Secure My Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}