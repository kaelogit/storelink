"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchOnboardingContext, getOnboardingHubRedirect } from "@/lib/onboardingState";
import { getClientUserSafe } from "@/lib/getClientUserSafe";

// 1. Extracted Spinner UI
function SetupLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
    </div>
  );
}

// 2. The inner component that safely isolates useSearchParams()
function SetupRedirectHandler() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await getClientUserSafe(supabase);
      if (!user) {
        router.replace("/login");
        return;
      }

      const ctx = await fetchOnboardingContext(supabase, user.id);
      if (cancelled) return;

      const next = getOnboardingHubRedirect(ctx);
      if (next !== "/onboarding/setup") {
        router.replace(next);
        return;
      }

      const suffix = search.get("upgrade") === "1" ? "?upgrade=1" : "";
      router.replace(ctx.profile?.is_seller ? `/onboarding/seller/identity${suffix}` : "/onboarding/buyer/identity");
    })();
    return () => {
      cancelled = true;
    };
  }, [router, search]);

  return <SetupLoader />;
}

// 3. Clean default export wrapped in Suspense
export default function OnboardingSetupPage() {
  return (
    <Suspense fallback={<SetupLoader />}>
      <SetupRedirectHandler />
    </Suspense>
  );
}