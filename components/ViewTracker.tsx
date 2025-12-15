"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function ViewTracker({ storeId }: { storeId: string }) {
  const hasCounted = useRef(false);

  useEffect(() => {
    if (hasCounted.current) return;
    
    const countView = async () => {
      hasCounted.current = true;
      await supabase.rpc('increment_store_views', { row_id: storeId });
    };

    countView();
  }, [storeId]);

  return null; 
}