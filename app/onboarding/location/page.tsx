"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchOnboardingContext, getOnboardingHubRedirect } from "@/lib/onboardingState";
import { getClientUserSafe } from "@/lib/getClientUserSafe";

// 1. Extracted Spinner UI to use both as the initial fallback and internal page render
function OnboardingLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50">
      <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
    </div>
  );
}

// 2. The inner functional component isolating useSearchParams
function LocationRedirectHandler() {
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
      if (next !== "/onboarding/location") {
        router.replace(next);
        return;
      }

      const suffix = search.get("upgrade") === "1" ? "?upgrade=1" : "";
      router.replace(ctx.profile?.is_seller ? `/onboarding/seller/location${suffix}` : "/onboarding/buyer/location");
    })();
    return () => {
      cancelled = true;
    };
  }, [router, search]);

  return <OnboardingLoader />;
}

// 3. Clean default Page export wrapped safely inside a Suspense boundary
export default function OnboardingLocationPage() {
  return (
    <Suspense fallback={<OnboardingLoader />}>
      <LocationRedirectHandler />
    </Suspense>
  );
}