/**
 * Public URLs for the seller storefront.
 *
 * - Marketplace hub: `NEXT_PUBLIC_SITE_URL` (e.g. https://shop.storelink.ng).
 * - Seller links: `https://{slug}.{NEXT_PUBLIC_STOREFRONT_ROOT_DOMAIN}/` when
 *   `NEXT_PUBLIC_STOREFRONT_SELLER_SUBDOMAIN_URLS=1`, else `{siteUrl}/{slug}`.
 *
 * Legacy paths `/sell/...` are stripped in middleware so old bookmarks still work.
 */

import { storefrontRootDomain } from "@/lib/storefrontHosts";

/** Marketplace / site chrome origin, no trailing slash (e.g. https://shop.storelink.ng). */
export function storefrontSiteBase(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/\/+$/, "");
    return `https://${host}`;
  }
  return "http://localhost:3000";
}

/** Absolute URL for a path on the marketplace host (`path` must start with `/`). */
export function storefrontAbsolutePath(path: string): string {
  const base = storefrontSiteBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * Public URL for a seller's storefront (subdomain when enabled, else path on shop base).
 */
export function sellerStorefrontPublicUrl(slug: string): string {
  const s = String(slug || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  if (!s) return storefrontSiteBase();
  const useSub = process.env.NEXT_PUBLIC_STOREFRONT_SELLER_SUBDOMAIN_URLS === "1";
  const root = storefrontRootDomain();
  if (useSub && root) {
    return `https://${encodeURIComponent(s)}.${root}/`;
  }
  return storefrontAbsolutePath(`/${encodeURIComponent(s)}`);
}
