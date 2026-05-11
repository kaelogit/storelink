"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SellerStoreSetup from "@/components/onboarding/SellerStoreSetup";

function SellerIdentityInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgrade = searchParams.get("upgrade") === "1";

  return (
    <SellerStoreSetup
      upgradeFromBuyer={upgrade}
      initialStep={1}
      onStepChange={(nextStep) => {
        const suffix = upgrade ? "?upgrade=1" : "";
        if (nextStep === 2) router.replace(`/onboarding/seller/location${suffix}`);
        else if (nextStep === 3) router.replace(`/onboarding/seller/brand${suffix}`);
      }}
    />
  );
}

export default function SellerIdentityPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <SellerIdentityInner />
    </Suspense>
  );
}
