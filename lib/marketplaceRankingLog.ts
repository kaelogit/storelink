import type { SupabaseClient } from "@supabase/supabase-js";

const SURFACE = "discover";

type Band = "grid" | "trending";

export async function logMarketplaceProductRankingEvent(
  supabase: SupabaseClient,
  opts: {
    event: "impression" | "click";
    productId: string;
    sellerId: string;
    position?: number;
    band?: Band;
  },
): Promise<void> {
  const { event, productId, sellerId, position, band } = opts;
  if (!productId || !sellerId) return;

  const { error } = await supabase.rpc("log_ranking_event", {
    p_surface: SURFACE,
    p_event_name: event,
    p_item_id: productId,
    p_item_type: "product",
    p_seller_id: sellerId,
    p_position: position ?? null,
    p_metadata: {
      source: "web_marketplace",
      path: "/marketplace",
      band: band ?? "grid",
    },
  });

  if (error) {
    console.debug("[marketplace] log_ranking_event skipped:", error.message);
  }
}
