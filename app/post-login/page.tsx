"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchOnboardingContext, getOnboardingHubRedirect } from "@/lib/onboardingState";

export default function PostLoginPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("Opening your account…");

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

      const path = getOnboardingHubRedirect(ctx);
      setMsg("Redirecting…");
      router.replace(path);
      router.refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-gray-50">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">{msg}</p>
    </div>
  );
}
