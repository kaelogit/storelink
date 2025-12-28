"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, Crown, Loader2, Search, Zap,
  TrendingUp, Award, Mail, Phone, Calendar,
  RefreshCcw, Trophy, MessageCircle
} from "lucide-react";

export default function WaitlistIntelligencePage() {
  const [waitlistRegistry, setWaitlistRegistry] = useState<any[]>([]);
  const [vendorAmbassadors, setVendorAmbassadors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [waitlistSearch, setWaitlistSearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");

  useEffect(() => {
    fetchEmpireData();
  }, []);

  async function fetchEmpireData() {
    setLoading(true);
    try {
      // 1. Fetch EVERYTHING from the waitlist table (Registry)
      const { data: waitlistData, error: wError } = await supabase
        .from('waitlist')
        .select('id, business_name, email, phone, referral_count, created_at')
        .order('created_at', { ascending: false });

      // 2. Fetch EVERYTHING from the stores table (Ambassadors)
      const { data: vendorData, error: vError } = await supabase
        .from('stores')
        .select('id, name, owner_email, whatsapp_number, referral_count, subscription_plan, created_at')
        .order('referral_count', { ascending: false });

      if (waitlistData) setWaitlistRegistry(waitlistData);
      if (vendorData) setVendorAmbassadors(vendorData);
      
      if (wError || vError) console.error("Database Error:", wError || vError);
    } catch (err) {
      console.error("System Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredWaitlist = waitlistRegistry.filter(entry => 
    (entry.business_name?.toLowerCase() || "").includes(waitlistSearch.toLowerCase()) ||
    (entry.email?.toLowerCase() || "").includes(waitlistSearch.toLowerCase()) ||
    (entry.phone || "").includes(waitlistSearch)
  );

  const filteredVendors = vendorAmbassadors.filter(entry => 
    (entry.name?.toLowerCase() || "").includes(vendorSearch.toLowerCase()) ||
    (entry.owner_email?.toLowerCase() || "").includes(vendorSearch.toLowerCase())
  );

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
      <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Loading Empire Records...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Growth Intelligence</h2>
          <p className="text-gray-400 text-sm font-medium">Tracking waitlist merchants and active vendor recruiters.</p>
        </div>
        <button 
          onClick={fetchEmpireData}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-lg"
        >
          <RefreshCcw size={14} /> Refresh Data
        </button>
      </div>

      {/* --- SECTION 1: VENDOR REFERRAL TRACKER --- */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20"><Crown size={20} /></div>
            <div>
              <h3 className="font-black text-xl text-white uppercase tracking-tighter italic">Active Vendor Ambassadors</h3>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Existing Stores referring others</p>
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              value={vendorSearch} 
              onChange={(e) => setVendorSearch(e.target.value)} 
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-2.5 pl-11 pr-4 text-xs text-white outline-none focus:ring-1 focus:ring-amber-500" 
            />
          </div>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-black/60 sticky top-0 z-10 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Vendor</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest italic text-center">Score</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest italic text-right">Reward Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="group hover:bg-amber-500/5 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-white uppercase tracking-tight italic">{vendor.name}</p>
                      <p className="text-[10px] text-gray-500">{vendor.owner_email}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-lg font-black text-amber-500 italic">{vendor.referral_count || 0}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {vendor.referral_count >= 5 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase border border-emerald-500/20">
                          <Award size={10} /> Diamond Qualified
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{5 - (vendor.referral_count || 0)} more to go</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: THE MASTER WAITLIST REGISTRY --- */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20"><Users size={20} /></div>
            <div>
              <h3 className="font-black text-xl text-white uppercase tracking-tighter italic">Waitlist Master Registry</h3>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Prospect Merchants ({filteredWaitlist.length})</p>
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={waitlistSearch} 
              onChange={(e) => setWaitlistSearch(e.target.value)} 
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-2.5 pl-11 pr-4 text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="max-h-[500px] overflow-y-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-black/60 sticky top-0 z-10 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Identity</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Contact Info</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest italic text-center">Score</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredWaitlist.map((entry) => (
                  <tr key={entry.id} className="group hover:bg-blue-500/5 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-white uppercase tracking-tight italic">{entry.business_name}</p>
                      {entry.referral_count >= 3 && (
                        <span className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1 mt-1">
                          <Zap size={8} fill="currentColor" /> Diamond Target Met
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1.5 font-medium"><Mail size={10} className="text-blue-500" /> {entry.email}</span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1.5 font-medium"><Phone size={10} className="text-emerald-500" /> {entry.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-sm font-black text-white">{entry.referral_count || 0}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <a 
                          href={`https://wa.me/${entry.phone?.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(entry.business_name || 'Merchant')},%20this%20is%20Kareem%20from%20StoreLink!`} 
                          target="_blank"
                          className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        >
                          <MessageCircle size={16} />
                        </a>
                        <a 
                          href={`tel:${entry.phone}`} 
                          className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                        >
                          <Phone size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center">
            <Trophy size={24} fill="currentColor" />
          </div>
          <div>
            <h4 className="text-white font-black uppercase italic tracking-tight">Growth Command Center</h4>
            <p className="text-gray-400 text-xs">Direct founder-to-merchant outreach enabled for the Waitlist Registry.</p>
          </div>
        </div>
        <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">
          Data Integrity Verified &copy; 2025
        </div>
      </div>

    </div>
  );
}