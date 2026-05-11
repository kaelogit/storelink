"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Loader2, Tag } from "lucide-react";
import { fetchOnboardingContext, getOnboardingHubRedirect } from "@/lib/onboardingState";
import {
  BUYER_ONBOARDING_CATEGORY_OPTIONS,
  filterBuyerPickSlugsForStorefront,
} from "@/lib/buyerOnboardingCategories";

export default function BuyerInterestsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const ctx = await fetchOnboardingContext(supabase, user.id);
      const next = getOnboardingHubRedirect(ctx);
      if (next !== "/onboarding/buyer/interests") {
        router.replace(next);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("buyer_interested_categories")
        .eq("id", user.id)
        .maybeSingle();

      const existing = profile?.buyer_interested_categories;
      if (Array.isArray(existing) && existing.length > 0) {
        setSelected(new Set(existing.map(String)));
      }

      setBooting(false);
    })();
  }, [router]);

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else if (next.size < 5) next.add(slug);
      return next;
    });
  };

  const handleContinue = async () => {
    const arr = filterBuyerPickSlugsForStorefront(Array.from(selected));
    if (arr.length < 3) {
      setErrorMsg("Pick at least 3 categories (max 5).");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          buyer_interested_categories: arr,
          onboarding_completed: true,
          onboarding_step: "done",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Could not save interests.");
    } finally {
      setLoading(false);
    }
  };

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  const canContinue = selected.size >= 3 && selected.size <= 5;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 pb-24">
      <div className="w-full max-w-xl pt-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 text-center mb-3">StoreLink · Shopper</p>
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Tag size={12} /> Pick interests
          </span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 text-center uppercase tracking-tighter mb-2">What do you like?</h1>
        <p className="text-sm text-gray-500 text-center mb-8 font-medium leading-relaxed">
          Choose 3–5 categories. We use this to tune discovery and keep your web account aligned with the app.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {BUYER_ONBOARDING_CATEGORY_OPTIONS.map((cat) => {
            const on = selected.has(cat.slug);
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggle(cat.slug)}
                className={`rounded-2xl border px-4 py-4 text-left font-bold text-sm transition shadow-sm ${
                  on
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200"
                    : "border-gray-100 bg-white text-gray-800 hover:border-gray-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {errorMsg && <p className="text-xs font-bold text-red-600 text-center mb-4">{errorMsg}</p>}

        <p className="text-[11px] text-gray-400 text-center mb-6 font-medium">
          {selected.size} selected · need 3–5
        </p>

        <button
          type="button"
          disabled={loading || !canContinue}
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              Continue <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
