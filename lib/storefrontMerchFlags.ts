/**
 * Normalizes storefront merchandising booleans from PostgREST / JSON
 * (handles `true`, `1`, and common string encodings; treats `"false"` as off).
 */
export function isStorefrontMerchFlagOn(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (value === false || value === 0 || value == null) return false;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    return s === "true" || s === "t" || s === "1" || s === "yes";
  }
  return false;
}
