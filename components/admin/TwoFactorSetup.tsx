"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export default function TwoFactorSetup() {
  const [loading, setLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      const { data } = await supabase.auth.mfa.listFactors();
      const totp = data?.all?.find((f) => f.factor_type === 'totp' && f.status === 'verified');
      if (totp) setIsEnabled(true);
    }
    checkStatus();
  }, []);

  const startSetup = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp', 
      });

      if (error) throw error;

      setFactorId(data.id);
      setQrCode(data.totp.qr_code); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async () => {
    if (!factorId) return;
    setLoading(true);
    setError("");

    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: factorId,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factorId,
        challengeId: challenge.id,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;

      setIsEnabled(true);
      setQrCode(null);
      setVerifyCode("");
      alert("Success! 2FA is now active.");

    } catch (err: any) {
      setError("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if(!confirm("Are you sure? Your account will be less secure.")) return;
    const { data } = await supabase.auth.mfa.listFactors();
    const totp = data?.all?.find(f => f.factor_type === 'totp');
    if (totp) {
        await supabase.auth.mfa.unenroll({ factorId: totp.id });
        setIsEnabled(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl max-w-md">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        Two-Factor Authentication
        {isEnabled && <CheckCircle className="text-emerald-500" size={20}/>}
      </h3>

      {isEnabled ? (
        <div className="bg-emerald-900/20 border border-emerald-900 p-4 rounded-xl text-emerald-400 mb-4">
          <p className="font-bold text-sm">✓ Your account is secure.</p>
          <button onClick={disable2FA} className="text-xs text-red-400 hover:underline mt-2">Disable 2FA</button>
        </div>
      ) : (
        <p className="text-gray-400 text-sm mb-6">
          Protect your account with Google Authenticator.
        </p>
      )}

      {error && (
        <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
           <AlertTriangle size={16}/> {error}
        </div>
      )}

      {!isEnabled && !qrCode && (
        <button 
          onClick={startSetup} 
          disabled={loading}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
        >
          {loading ? "Generating..." : "Enable 2FA"}
        </button>
      )}

      {qrCode && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl inline-block">
             <img src={qrCode} alt="Scan this QR" className="w-40 h-40" />
          </div>
          <p className="text-sm text-gray-400">1. Scan this with Google Authenticator.</p>
          <p className="text-sm text-gray-400">2. Enter the code below.</p>
          
          <input 
             type="text" 
             placeholder="123456" 
             className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg tracking-widest text-center text-xl font-mono"
             maxLength={6}
             value={verifyCode}
             onChange={e => setVerifyCode(e.target.value)}
          />

          <button 
            onClick={verifySetup} 
            disabled={loading || verifyCode.length !== 6}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Verify & Activate"}
          </button>
        </div>
      )}
    </div>
  );
}