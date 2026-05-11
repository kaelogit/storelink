export function normalizeOrderStatus(raw: unknown): string {
  return String(raw || "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export function normalizeOrderOrigin(raw: unknown): string {
  return String(raw || "").trim().toLowerCase();
}

/** Storefront UX treats only paid/completed as terminal web-friendly states. */
export function isStorefrontSettledStatus(status: unknown): boolean {
  const s = normalizeOrderStatus(status);
  return s === "PAID" || s === "COMPLETED";
}

/**
 * Orders not created on web storefront and not in paid/completed
 * should be managed in the mobile app.
 */
export function shouldShowManageInAppNotice(origin: unknown, status: unknown): boolean {
  const o = normalizeOrderOrigin(origin);
  const storefrontLike = o === "storefront" || o === "web_app";
  if (storefrontLike) return false;
  return !isStorefrontSettledStatus(status);
}

