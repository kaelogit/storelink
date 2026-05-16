"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchOnboardingContext, getOnboardingHubRedirect } from "@/lib/onboardingState";
import { getClientUserSafe } from "@/lib/getClientUserSafe";
import { buildVerifyRedirectPath, isEmailVerifiedForStorefront } from "@/lib/authVerification";

export default function PostLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Opening your account…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const user = await getClientUserSafe(supabase);
        if (!user) {
          router.replace("/login");
          return;
        }

        const verified = await isEmailVerifiedForStorefront(supabase, user);
        if (!verified) {
          router.replace(buildVerifyRedirectPath(user.email, "/post-login"));
          return;
        }

        const ctx = await fetchOnboardingContext(supabase, user.id);
        if (cancelled) return;

        const requestedNext = searchParams.get("next") || "";
        const safeNext =
          requestedNext.startsWith("/") &&
          !requestedNext.startsWith("//") &&
          requestedNext !== "/login" &&
          requestedNext !== "/signup"
            ? requestedNext
            : null;
        const gate = getOnboardingHubRedirect(ctx);

        setMsg("Redirecting…");
        router.replace(safeNext || gate);
        router.refresh();
      } catch {
        if (cancelled) return;
        setMsg("Still connecting…");
        setTimeout(() => {
          if (!cancelled) router.replace("/onboarding/role");
        }, 1200);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-gray-50">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">{msg}</p>
    </div>
  );
}
