"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Sparkles, ArrowUpRight, ArrowDownLeft, Wallet, Clock, 
  ChevronLeft, ShoppingBag, Lock, ShieldCheck, 
  Loader2, Phone, ArrowRight, Eye, EyeOff, LogOut 
} from "lucide-react";
import Link from "next/link";

export default function WalletPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [walletData, setWalletData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [walletState, setWalletState] = useState<'identify' | 'setup' | 'locked' | 'unlocked' | 'empty'>('identify');
  
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem('storelink_user_phone');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      fetchWalletStatus(savedPhone);
    } else {
      setLoading(false);
      setWalletState('identify');
    }
  }, []);

  const fetchWalletStatus = async (userPhone: string) => {
    setLoading(true);
    setPinError("");
    
    const cleanPhone = userPhone.replace(/\D/g, '').slice(-10);

    if (cleanPhone.length < 10) {
      setPinError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('phone_number', cleanPhone) 
      .maybeSingle();

    if (data) {
      setWalletData(data);
      setPhoneNumber(data.phone_number); 
      localStorage.setItem('storelink_user_phone', data.phone_number); 
      
      if (!data.wallet_pin) {
        setWalletState('setup');
      } else {
        setWalletState('locked');
      }
    } else {
      setWalletState('empty');
    }
    setLoading(false);
  };

  const handleSetPin = async () => {
    setPinError("");
    if (pin.length !== 4) {
      setPinError("PIN must be exactly 4 digits.");
      return;
    }
    if (pin !== confirmPin) {
      setPinError("PINs do not match. Please verify.");
      return;
    }

    setLoading(true);
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);

    const { error } = await supabase
      .from('user_wallets')
      .update({ wallet_pin: pin })
      .eq('phone_number', cleanPhone);

    if (!error) {
      unlockAndFetchHistory();
    } else {
      setPinError("Vault Error: Could not secure wallet.");
      setLoading(false);
    }
  };

  const handleVerifyPin = () => {
    if (pin === walletData.wallet_pin) {
      unlockAndFetchHistory();
    } else {
      setPinError("Incorrect PIN. Access Denied.");
      setPin("");
    }
  };

  const unlockAndFetchHistory = async () => {
    setLoading(true);
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);

    const { data: history, error } = await supabase
      .from('coin_transactions')
      .select('*')
      .eq('phone_number', cleanPhone) 
      .order('created_at', { ascending: false });

    if (error) console.error("History Error:", error);

    setTransactions(history || []);
    setWalletState('unlocked');
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('storelink_user_phone');
    window.location.reload();
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600 mb-4" size={40} />
      <p className="font-black text-gray-900 tracking-tighter uppercase animate-pulse">Establishing Secure Link...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-900">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-gray-900">Empire Wallet</h1>
          </div>
          {walletState === 'unlocked' && (
            <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition group flex items-center gap-2">
              <span className="hidden md:block text-xs font-black uppercase">Sign Out</span>
              <LogOut size={20} />
            </button>
          )}
        </div>
      </header>

      <div className="h-20" />

      <main className="flex-1 max-w-6xl mx-auto w-full p-5 md:p-12">
        {walletState === 'identify' && (
          <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-gray-100 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center"><Phone size={32} /></div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 leading-tight">Identify Your <br/>Account</h2>
              <p className="text-gray-500 mt-2 text-sm font-medium">Enter your number to sync your Empire balance.</p>
            </div>
            <div className="space-y-4">
              <input type="tel" placeholder="080... or 234..." className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none font-bold text-lg transition-all" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <button onClick={() => fetchWalletStatus(phoneNumber)} className="w-full bg-gray-900 text-white py-5 rounded-3xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95">Access My Vault <ArrowRight size={18} /></button>
            </div>
          </div>
        )}

        {walletState === 'setup' && (
          <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-emerald-100 space-y-6 animate-in zoom-in duration-500">
            <div className="flex items-center gap-3 text-emerald-600"><ShieldCheck size={28} /><h2 className="text-2xl font-black italic">Secure Your Loot</h2></div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed text-center">Create a 4-digit PIN. This is your permanent key to spending Empire Coins. **Don't lose it.**</p>
            <div className="space-y-4">
              <div className="relative">
                <input type={showPin ? "text" : "password"} maxLength={4} placeholder="Create PIN" className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none text-center text-1xl font-black tracking-[0.5em]" onChange={(e) => setPin(e.target.value)} />
                <button onClick={() => setShowPin(!showPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPin ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
              <input type="password" maxLength={4} placeholder="Confirm PIN" className="w-full p-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-emerald-500 outline-none text-center text-1xl font-black tracking-[0.5em]" onChange={(e) => setConfirmPin(e.target.value)} />
              {pinError && <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-2xl border border-red-100">{pinError}</p>}
              <button onClick={handleSetPin} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-bold shadow-emerald-200 shadow-xl hover:bg-emerald-700 transition active:scale-95">Lock It In</button>
            </div>
          </div>
        )}

        {walletState === 'locked' && (
          <div className="max-w-md mx-auto bg-white p-10 rounded-[40px] shadow-xl text-center space-y-8 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl"><Lock size={32} /></div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Vault Encrypted</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 text-center">Enter Secret PIN to Continue</p>
            </div>
            <div className="space-y-4">
              <input type="password" maxLength={4} autoFocus placeholder="••••" className="w-full p-5 bg-gray-50 rounded-3xl border-none text-center text-2xl font-black tracking-[0.5em] outline-none focus:ring-2 ring-emerald-500" value={pin} onChange={(e) => setPin(e.target.value)} />
              {pinError && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">{pinError}</p>}
              <button onClick={handleVerifyPin} className="w-full bg-gray-900 text-white py-5 rounded-3xl font-bold shadow-lg active:scale-95 transition-all">Authenticate Access</button>
              <button onClick={() => setWalletState('identify')} className="text-[10px] font-black text-gray-400 underline uppercase tracking-widest">Switch Account</button>
            </div>
          </div>
        )}

        {walletState === 'empty' && (
          <div className="max-w-md mx-auto bg-white p-10 rounded-[40px] text-center shadow-xl border border-gray-100 space-y-8 animate-in zoom-in">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[35px] flex items-center justify-center mx-auto rotate-3"><ShoppingBag size={48} /></div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 leading-tight">The Empire <br/>Awaits You</h2>
              <p className="text-gray-500 text-sm leading-relaxed px-4">No coins found for this number yet.</p>
            </div>
            <Link href="/" className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-5 rounded-3xl font-bold shadow-xl hover:-translate-y-1 transition duration-300">Go Shopping <Sparkles size={18} /></Link>
            <button onClick={() => setWalletState('identify')} className="text-xs font-black text-gray-400 underline uppercase tracking-widest">Try another number</button>
          </div>
        )}

        {walletState === 'unlocked' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start animate-in slide-in-from-bottom-10 duration-700">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="bg-gray-900 rounded-[45px] p-10 text-white relative overflow-hidden shadow-2xl border-t border-white/10">
                <div className="absolute top-[-20%] right-[-20%] w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                     <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md"><Wallet className="text-emerald-400" size={24} /></div>
                     <Sparkles className="text-emerald-500" size={20} />
                  </div>
                  <span className="text-[10px] font-black opacity-40 tracking-[0.3em] uppercase">Current Assets</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-6xl font-black tracking-tighter">₦{walletData?.coin_balance?.toLocaleString() || "0"}</span>
                    <span className="text-emerald-400 text-xs font-bold uppercase italic">Coins</span>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ID: {phoneNumber.slice(-4)}</p>
                     <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-gray-900" />
                        <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-gray-900" />
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xs font-black text-gray-400 tracking-[0.3em] uppercase flex items-center gap-3 px-2">
                <Clock size={14} className="text-emerald-600" /> Activity Ledger
              </h3>
              <div className="space-y-3">
                {transactions.length > 0 ? transactions.map((tx) => (
                  <div key={tx.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5">
                      {/* 🔥 Using standardized transaction_type column */}
                      <div className={`p-4 rounded-2xl ${tx.transaction_type === 'spend' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        {tx.transaction_type === 'spend' ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
                      </div>
                      <div className="text-left">
                        <p className="font-black text-gray-900 text-sm leading-none">{tx.description}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">
                          {new Date(tx.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span className={`font-black text-lg ${tx.transaction_type === 'spend' ? 'text-gray-900' : 'text-emerald-600'}`}>
                      {tx.transaction_type === 'spend' ? '-' : '+'}₦{tx.amount.toLocaleString()}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                     <p className="text-gray-400 text-xs font-black uppercase tracking-widest">No activity found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto bg-white border-t border-gray-100 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-xl" />
            <span className="font-black text-sm tracking-tighter uppercase text-gray-900">StoreLink Ecosystem</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">© 2025 StoreLink Empire Security. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}