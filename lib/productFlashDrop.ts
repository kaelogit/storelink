/**
 * Canonical unit price for checkout/display is computed in Postgres:
 * `public.product_effective_checkout_unit_price(price, is_flash_drop, flash_price, flash_end_time, flash_expiry)`.
 *
 * `storefront_products.effective_checkout_unit_price` and discovery RPCs expose the same value.
 * Prefer `effective_checkout_unit_price` when present; the client mirror below is only for raw `products` rows
 * (e.g. seller dashboard) and must stay aligned with that SQL (migrations `20260914120000_create_new_order_flash_alignment.sql`,
 * `20261010120000_create_new_order_profile_ssot.sql`).
 */
export type ProductFlashSource = {
  /** When set (view / RPC), use as display & cart line price — single DB formula. */
  effective_checkout_unit_price?: number | string | null;
  is_flash_drop?: boolean | null;
  flash_end_time?: string | null;
  flash_expiry?: string | null;
  flash_price?: number | string | null;
  flash_drop_expiry?: string | null;
  flash_drop_price?: number | string | null;
};

function productFlashEndIso(p: ProductFlashSource): string | null {
  const raw = p.flash_end_time ?? p.flash_expiry ?? p.flash_drop_expiry;
  if (raw == null || String(raw).trim() === "") return null;
  return String(raw);
}

function productFlashPriceNumber(p: ProductFlashSource): number | null {
  const raw = p.flash_price ?? p.flash_drop_price;
  if (raw == null || raw === "") return null;
  const n = typeof raw === "number" ? raw : parseFloat(String(raw));
  return Number.isFinite(n) ? n : null;
}

function isProductFlashDropActive(p: ProductFlashSource, now: Date = new Date()): boolean {
  if (p.is_flash_drop === false) return false;
  const end = productFlashEndIso(p);
  const price = productFlashPriceNumber(p);
  if (!end || price == null) return false;
  return new Date(end) > now;
}

/** Row has flash metadata (may already be expired). Used so the storefront strip can tick until expiry then hide. */
function isFlashDropCandidate(p: ProductFlashSource): boolean {
  if (p.is_flash_drop === false) return false;
  const end = productFlashEndIso(p);
  if (end == null) return false;
  return productFlashPriceNumber(p) != null;
}

function effectiveCheckoutUnitPriceClientMirror(p: ProductFlashSource & { price: number }): number {
  return isProductFlashDropActive(p) ? (productFlashPriceNumber(p) ?? p.price) : p.price;
}

/** Prefer `effective_checkout_unit_price` from DB view/RPC when present. */
function productDisplayPrice(p: ProductFlashSource & { price: number }): number {
  const raw = p.effective_checkout_unit_price;
  if (raw != null && raw !== "") {
    const n = typeof raw === "number" ? raw : parseFloat(String(raw));
    if (Number.isFinite(n)) return n;
  }
  return effectiveCheckoutUnitPriceClientMirror(p);
}

export {
  productFlashEndIso,
  productFlashPriceNumber,
  isProductFlashDropActive,
  isFlashDropCandidate,
  productDisplayPrice,
};
