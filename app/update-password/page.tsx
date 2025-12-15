"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
        setMessage("❌ " + error.message);
    } else {
        setMessage("✅ Password updated! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Set New Password</h1>
          <form onSubmit={handleUpdate} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input required type="password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} />
             </div>
             {message && <p className="text-center font-bold text-sm mb-4">{message}</p>}
             <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg">
               {loading ? <Loader2 className="animate-spin mx-auto" /> : "Update Password"}
             </button>
          </form>
        </div>
      </div>
    </div>
  );
}