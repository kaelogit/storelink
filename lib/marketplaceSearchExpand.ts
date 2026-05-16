/**
 * Expands a buyer search into a primary string plus synonym alternates for
 * parallel `get_storefront_marketplace_products` calls (first page merge only).
 */

const SYNONYM_GROUPS: string[][] = [
  ["sneaker", "sneakers", "trainer", "trainers", "kicks"],
  ["phone", "phones", "smartphone", "iphone", "samsung", "tecno", "infinix", "itel"],
  ["bag", "bags", "purse", "tote", "handbag"],
  ["dress", "dresses", "gown", "outfit", "apparel"],
  ["shoe", "shoes", "footwear", "slides", "sandals", "heels"],
  ["wig", "wigs", "weave", "hair", "braids"],
  ["watch", "watches", "wristwatch", "timepiece"],
  ["cream", "skincare", "lotion", "serum"],
  ["laptop", "laptops", "notebook", "macbook", "chromebook"],
  ["charger", "chargers", "cable", "adapter", "usb"],
  ["perfume", "fragrance", "scent", "cologne"],
  ["jewelry", "jewellery", "necklace", "bracelet", "earrings"],
  ["vitamin", "supplement", "wellness"],
  ["makeup", "cosmetic", "lipstick", "foundation"],
  ["hoodie", "sweatshirt", "jacket", "joggers"],
  ["belt", "wallet", "leather"],
];

/** Short labels for suggested-search chips (buyer taps → fills search). */
export const MARKETPLACE_SUGGESTED_SEARCHES = [
  "Phone",
  "Sneakers",
  "Dress",
  "Bag",
  "Skincare",
  "Charger",
  "Wig",
  "Watch",
] as const;

function tokensFromQuery(q: string): Set<string> {
  const t = new Set<string>();
  const lower = q.toLowerCase();
  for (const w of lower.split(/[\s,./+|]+/)) {
    const clean = w.replace(/[^a-z0-9]/g, "");
    if (clean.length >= 2) t.add(clean);
  }
  return t;
}

export function expandMarketplaceSearch(raw: string): { primary: string; alternatives: string[] } {
  const primary = raw.trim();
  if (!primary) return { primary: "", alternatives: [] };

  const tokens = tokensFromQuery(primary);
  const hay = primary.toLowerCase();
  const alts = new Set<string>();

  for (const group of SYNONYM_GROUPS) {
    const hit = group.some((g) => tokens.has(g) || hay.includes(g));
    if (!hit) continue;
    for (const term of group) {
      if (hay.includes(term)) continue;
      if (term.length < 3) continue;
      alts.add(term);
    }
  }

  return { primary, alternatives: [...alts].slice(0, 6) };
}
