/**
 * Public URLs for the seller storefront when mounted at `storelink.ng/sell` (Vercel rewrite from storelink-web).
 * Set NEXT_PUBLIC_SITE_URL in production, e.g. https://storelink.ng/sell
 */

export const STOREFRONT_BASE_PATH = "/sell" as const;

/** Origin + base path, no trailing slash (e.g. https://storelink.ng/sell). */
export function storefrontSiteBase(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/\/+$/, "");
    return `https://${host}${STOREFRONT_BASE_PATH}`;
  }
  return `http://localhost:3000${STOREFRONT_BASE_PATH}`;
}

/** Absolute URL for a path under this app (path must start with `/`, e.g. `/dashboard`). */
export function storefrontAbsolutePath(path: string): string {
  const base = storefrontSiteBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
