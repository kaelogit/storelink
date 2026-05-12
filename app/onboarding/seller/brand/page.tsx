"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SellerStoreSetup from "@/components/onboarding/SellerStoreSetup";

function SellerBrandInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgrade = searchParams.get("upgrade") === "1";

  return (
    <SellerStoreSetup
      upgradeFromBuyer={upgrade}
      initialStep={3}
      onStepChange={(nextStep) => {
        const suffix = upgrade ? "?upgrade=1" : "";
        if (nextStep === 1) router.replace(`/onboarding/seller/identity${suffix}`);
        else if (nextStep === 2) router.replace(`/onboarding/seller/location${suffix}`);
      }}
    />
  );
}

export default function SellerBrandPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-gray-50" />}>
      <SellerBrandInner />
    </Suspense>
  );
}
