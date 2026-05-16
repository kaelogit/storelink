"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { logMarketplaceProductRankingEvent } from "@/lib/marketplaceRankingLog";

type Band = "grid" | "trending";

type Props = {
  href: string;
  className?: string;
  product: { id: string; seller_id: string };
  position: number;
  band?: Band;
  children: ReactNode;
};

/**
 * Wraps a marketplace product tile: logs one **impression** when sufficiently visible (signed-in only per RPC),
 * and a **click** when the shopper activates the tile link (add-to-cart uses stopPropagation so it does not count).
 */
export default function MarketplaceTrackedProductLink({ href, className, product, position, band = "grid", children }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const impressionSent = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || impressionSent.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e?.isIntersecting || impressionSent.current) return;
        impressionSent.current = true;
        void logMarketplaceProductRankingEvent(supabase, {
          event: "impression",
          productId: product.id,
          sellerId: product.seller_id,
          position,
          band,
        });
      },
      { root: null, rootMargin: "100px 0px", threshold: 0.12 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [product.id, product.seller_id, position, band]);

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      onClick={() =>
        void logMarketplaceProductRankingEvent(supabase, {
          event: "click",
          productId: product.id,
          sellerId: product.seller_id,
          position,
          band,
        })
      }
    >
      {children}
    </Link>
  );
}
