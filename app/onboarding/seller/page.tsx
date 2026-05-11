"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SellerOnboardingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgrade = searchParams.get("upgrade") === "1";

  useEffect(() => {
    router.replace(upgrade ? "/onboarding/seller/identity?upgrade=1" : "/onboarding/seller/identity");
  }, [router, upgrade]);

  return null;
}

export default function SellerOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading…</span>
        </div>
      }
    >
      <SellerOnboardingInner />
    </Suspense>
  );
}
