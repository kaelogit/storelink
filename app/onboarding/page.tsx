"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchOnboardingContext, getOnboardingHubRedirect } from "@/lib/onboardingState";

/** Progressive onboarding router — buyers/sellers use dedicated steps. */
export default function OnboardingHubPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const ctx = await fetchOnboardingContext(supabase, user.id);
      if (cancelled) return;
      router.replace(getOnboardingHubRedirect(ctx));
      router.refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Setting up your flow…</p>
    </div>
  );
}
