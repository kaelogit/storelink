"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { fetchOnboardingContext, getOnboardingHubRedirect, isProfileOnboardingComplete } from "@/lib/onboardingState";

/**
 * Web-only finish step for app users left on `follow-stores` (storefront skips in-app follow flow).
 * Requires identity, home location, and 3+ category picks — same SSOT as buyer interests completion.
 */
export default function BuyerOnboardingCompletePage() {
  const router = useRouter();
  const [msg, setMsg] = useState("Finishing setup…");

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

      if (isProfileOnboardingComplete(ctx.profile)) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      const next = getOnboardingHubRedirect(ctx);
      if (next !== "/onboarding/buyer/complete") {
        router.replace(next);
        router.refresh();
        return;
      }

      setMsg("Saving…");
      const { error } = await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          onboarding_step: "done",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (cancelled) return;
      if (error) {
        setMsg(error.message);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-gray-50 px-6">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-600" aria-hidden />
      <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">{msg}</p>
    </div>
  );
}
