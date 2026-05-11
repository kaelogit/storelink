"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

/** Increments `profiles.view_count` — same visibility metric as mobile (single source of truth). */
export default function ProfileStorefrontViewTracker({ profileId }: { profileId: string }) {
  const hasCounted = useRef(false);

  useEffect(() => {
    const sessionKey = `viewed_profile_storefront_${profileId}`;
    if (sessionStorage.getItem(sessionKey) || hasCounted.current) {
      return;
    }

    const countView = async () => {
      try {
        hasCounted.current = true;
        sessionStorage.setItem(sessionKey, "true");

        await supabase.rpc("increment_profile_storefront_view", { p_profile_id: profileId });
      } catch (error) {
        console.error(error);
      }
    };

    countView();
  }, [profileId]);

  return null;
}
