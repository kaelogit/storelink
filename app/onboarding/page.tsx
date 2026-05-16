"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchOnboardingContext, getOnboardingHubRedirect } from "@/lib/onboardingState";
import { getClientUserSafe } from "@/lib/getClientUserSafe";
import { buildVerifyRedirectPath, isEmailVerifiedForStorefront } from "@/lib/authVerification";

/** Progressive onboarding router — buyers/sellers use dedicated steps. */
export default function OnboardingHubPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await getClientUserSafe(supabase);
      if (!user) {
        router.replace("/login");
        return;
      }
      const verified = await isEmailVerifiedForStorefront(supabase, user);
      if (!verified) {
        router.replace(buildVerifyRedirectPath(user.email, "/onboarding"));
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
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-gray-50">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Setting up your flow…</p>
    </div>
  );
}
