"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AccountProfilePage from "@/app/account/profile/page";
import { PROFILE_STOREFRONT_SELECT, type ProfileStorefrontRow } from "@/lib/profileAsStorefront";

export default function UnifiedSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: prof } = await supabase.from("profiles").select(PROFILE_STOREFRONT_SELECT).eq("id", user.id).maybeSingle();

      const profRow = prof as ProfileStorefrontRow | null;
      setIsSeller(Boolean(profRow?.is_seller));

      setLoading(false);
    };
    void load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loader2 className="animate-spin text-gray-300" size={30} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Settings</h1>
        <p className="text-sm text-gray-500 font-medium mt-2">Edit profile matches the app — cover, Instagram, and TikTok are extra on web.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account</p>
      </div>
      <AccountProfilePage />

      {isSeller ? (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Seller tools</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Verification and payouts (same as app settings hub).</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/verification"
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50"
            >
              Identity verification
            </Link>
            <Link
              href="/dashboard/payout"
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50"
            >
              Payout &amp; bank details
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
