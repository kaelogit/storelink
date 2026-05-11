"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardSettingsLegacyRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/account/settings");
  }, [router]);
  return null;
}
