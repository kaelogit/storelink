"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, ShoppingBag, Store, ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchOnboardingContext, getOnboardingHubRedirect } from "@/lib/onboardingState";

export default function OnboardingRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [sellerHint, setSellerHint] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const meta = user.user_metadata as Record<string, unknown> | undefined;
      const wantsSell =
        meta?.wants_to_sell === true ||
        localStorage.getItem("storelink_post_auth_seller_intent") === "1";
      setSellerHint(!!wantsSell);

      const ctx = await fetchOnboardingContext(supabase, user.id);
      const skip = getOnboardingHubRedirect(ctx);
      if (skip !== "/onboarding/role") {
        router.replace(skip);
        return;
      }
      setChecking(false);
    })();
  }, [router]);

  const chooseBuyer = async () => {
    setLoading("buyer");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("profiles")
        .update({
          is_seller: false,
          prestige_weight: 1,
          onboarding_step: "buyer_identity",
          subscription_plan: null,
          subscription_status: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      localStorage.removeItem("storelink_post_auth_seller_intent");
      router.push("/onboarding/buyer/identity");
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const chooseSeller = async () => {
    setLoading("seller");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("profiles")
        .update({
          is_seller: true,
          prestige_weight: 2,
          subscription_plan: "standard",
          subscription_status: "active",
          onboarding_step: "seller_identity",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      localStorage.removeItem("storelink_post_auth_seller_intent");
      router.push("/onboarding/seller/identity");
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  if (checking) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center mb-3">StoreLink · Step 1</p>
        <h1 className="text-3xl font-black text-gray-900 text-center uppercase tracking-tighter mb-2">How will you use StoreLink?</h1>
        <p className="text-sm text-gray-500 text-center mb-10 font-medium">
          You can shop, track orders, and open a storefront from one StoreLink account. Switch to selling anytime from your dashboard.
        </p>

        <div className="space-y-4">
          <button
            type="button"
            disabled={loading !== null}
            onClick={chooseBuyer}
            className="w-full flex items-center gap-4 p-6 rounded-4xl border-2 border-gray-100 bg-white shadow-sm hover:border-emerald-500 hover:shadow-lg transition-all text-left group disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <ShoppingBag size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 uppercase tracking-tight text-lg">Shop & discover</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Browse stores, checkout securely, track orders.</p>
            </div>
            {loading === "buyer" ? (
              <Loader2 className="animate-spin text-emerald-600 shrink-0" />
            ) : (
              <ArrowRight className="text-gray-300 group-hover:text-emerald-600 shrink-0 transition-colors" />
            )}
          </button>

          <button
            type="button"
            disabled={loading !== null}
            onClick={chooseSeller}
            className="w-full flex items-center gap-4 p-6 rounded-4xl border-2 border-gray-900 bg-gray-900 text-white shadow-xl hover:bg-gray-800 transition-all text-left group disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Store size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black uppercase tracking-tight text-lg">Open my storefront</p>
              <p className="text-xs text-gray-400 font-medium mt-1">Standard plan is free.</p>
              {sellerHint && <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-2">You chose seller at signup</p>}
            </div>
            {loading === "seller" ? (
              <Loader2 className="animate-spin shrink-0" />
            ) : (
              <ArrowRight className="text-gray-500 group-hover:text-white shrink-0 transition-colors" />
            )}
          </button>
        </div>

        <p className="text-center mt-10 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Already have a store?{" "}
          <Link href="/login" className="text-emerald-600 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

