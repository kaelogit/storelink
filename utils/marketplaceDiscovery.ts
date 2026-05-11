/**
 * Matches store-link-mobile seller plans: Standard (free) vs Diamond (paid boost).
 * Legacy DB values `free` and `premium` are treated as Standard unless Diamond is active.
 */
export type EffectiveSellerTier = "standard" | "diamond";

/** Matches store-link-mobile `getSellerPlanState`: Diamond can expire by date or `subscription_status`. */
export function effectiveSellerTier(
  plan: string | null | undefined,
  expiry: string | null | undefined,
  subscription_status?: string | null | undefined
): EffectiveSellerTier {
  const p = (plan || "").toLowerCase();
  if (p !== "diamond") return "standard";

  if ((subscription_status || "").toLowerCase() === "expired") return "standard";

  const now = new Date();
  if (expiry) {
    const exp = new Date(expiry);
    if (!Number.isNaN(exp.getTime()) && exp < now) return "standard";
  }

  return "diamond";
}

const TIER_RANK: Record<EffectiveSellerTier, number> = { diamond: 2, standard: 1 };

type StorePlanSlice = {
  subscription_plan?: string | null;
  subscription_expiry?: string | null;
  subscription_status?: string | null;
};

type ProductRow = {
  seller_id: string;
  stores?: StorePlanSlice & { id?: string };
};

/** Caps apply to marketplace discovery fairness only—not seller catalog size (aligned with mobile feeds). */
export function applyMarketplaceStoreCaps<T extends ProductRow>(
  products: T[],
  caps: { diamond: number; standard: number } = { diamond: 14, standard: 5 }
): T[] {
  const tierOf = (s?: StorePlanSlice | null) =>
    effectiveSellerTier(s?.subscription_plan, s?.subscription_expiry, s?.subscription_status);

  const sorted = [...products].sort((a, b) => {
    const ea = tierOf(a.stores as StorePlanSlice);
    const eb = tierOf(b.stores as StorePlanSlice);
    return TIER_RANK[eb] - TIER_RANK[ea];
  });

  const counts = new Map<string, number>();
  const out: T[] = [];

  for (const p of sorted) {
    const eff = tierOf(p.stores as StorePlanSlice);
    const cap = eff === "diamond" ? caps.diamond : caps.standard;
    const capKey = ((p.stores as StorePlanSlice & { id?: string })?.id || p.seller_id) as string;
    const n = counts.get(capKey) || 0;
    if (n < cap) {
      counts.set(capKey, n + 1);
      out.push(p);
    }
  }

  return out;
}

export function hasActiveDiamondBoost(
  plan: string | null | undefined,
  expiry: string | null | undefined,
  subscription_status?: string | null | undefined
): boolean {
  return effectiveSellerTier(plan, expiry, subscription_status) === "diamond";
}
