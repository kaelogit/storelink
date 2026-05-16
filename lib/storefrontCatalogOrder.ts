import { shuffleArray } from "@/utils/shuffle";

/**
 * Prepare catalog rows for the public web storefront: optional OOS filter,
 * pinned-first ordering, optional shuffle of unpinned tail (discovery variety).
 */
export function prepareStorefrontProductRows<T extends { pinned_at?: string | null; stock_quantity?: number | null }>(
  rows: T[],
  opts: { hideOutOfStock: boolean; shuffleUnpinned: boolean },
): T[] {
  let r = rows.slice();
  if (opts.hideOutOfStock) {
    r = r.filter((p) => Number(p.stock_quantity ?? 0) > 0);
  }
  const pinned = r
    .filter((p) => p.pinned_at)
    .sort((a, b) => new Date(String(b.pinned_at)).getTime() - new Date(String(a.pinned_at)).getTime());
  const unpinned = r.filter((p) => !p.pinned_at);
  const tail = opts.shuffleUnpinned ? shuffleArray(unpinned) : unpinned;
  return [...pinned, ...tail];
}
