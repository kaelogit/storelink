import type { SupabaseClient } from "@supabase/supabase-js";
import { STOREFRONT_ORDER_ORIGIN } from "@/lib/storefrontAdminScope";

const PAGE_SIZE = 800;
const MAX_PAGES = 100;

/**
 * Sum GMV and platform take for storefront orders in PAID/COMPLETED.
 * Uses `platform_fee` when set; otherwise assumes 2.5% of `total_amount`.
 */
export async function sumStorefrontPaidGmvAndFees(svc: SupabaseClient): Promise<{
  gmvNgn: number;
  platformFeesNgn: number;
  rowsScanned: number;
  capped: boolean;
}> {
  let gmv = 0;
  let fees = 0;
  let scanned = 0;
  let from = 0;
  let capped = false;
  let includePlatformFee: boolean | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const selectCols = includePlatformFee === false ? "total_amount" : "total_amount, platform_fee";
    const { data, error } = await svc
      .from("orders")
      .select(selectCols)
      .eq("origin_channel", STOREFRONT_ORDER_ORIGIN)
      .in("status", ["PAID", "COMPLETED"])
      .order("created_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      if (includePlatformFee !== false && /platform_fee/i.test(error.message)) {
        includePlatformFee = false;
        page -= 1;
        continue;
      }
      throw new Error(error.message);
    }
    if (!data?.length) break;
    if (includePlatformFee === null) includePlatformFee = true;
    const rows = (data ?? []) as Array<{ total_amount?: number | null; platform_fee?: number | string | null }>;

    for (const row of rows) {
      scanned += 1;
      const ta = Number(row.total_amount ?? 0);
      gmv += ta;
      const pf = includePlatformFee === false ? null : row.platform_fee;
      fees += pf != null && pf !== "" ? Number(pf) : ta * 0.025;
    }

    from += PAGE_SIZE;
    if (data.length < PAGE_SIZE) break;
    if (page === MAX_PAGES - 1) capped = true;
  }

  return { gmvNgn: gmv, platformFeesNgn: fees, rowsScanned: scanned, capped };
}
