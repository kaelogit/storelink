"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function ViewTracker({ storeId }: { storeId: string }) {
  const hasCounted = useRef(false);

  useEffect(() => {
    const sessionKey = `viewed_store_${storeId}`;
    
    if (hasCounted.current || sessionStorage.getItem(sessionKey)) {
      return;
    }

    const countView = async () => {
      try {
        hasCounted.current = true;
        sessionStorage.setItem(sessionKey, "true");

        await supabase.rpc('increment_store_view', { store_uuid: storeId });
      } catch (error) {
        console.error("View tracking error:", error);
      }
    };

    countView();
  }, [storeId]);

  return null; 
}