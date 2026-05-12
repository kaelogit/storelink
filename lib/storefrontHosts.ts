/**
 * Host-based routing for the storefront on `*.storelink.ng`.
 * - `shop.storelink.ng` → marketplace index (`/`).
 * - `{slug}.storelink.ng` → seller storefront (`/[slug]`) when path is `/`.
 *
 * Configure with `NEXT_PUBLIC_STOREFRONT_ROOT_DOMAIN` (e.g. storelink.ng) and
 * `NEXT_PUBLIC_STOREFRONT_SHOP_SUBDOMAIN` (default `shop`).
 */

const DEFAULT_ROOT = "storelink.ng";
const DEFAULT_SHOP_SUB = "shop";

/** Subdomains that never map to a seller slug on `{sub}.{root}`. */
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "app",
  "admin",
  "cdn",
  "mail",
  "ftp",
  "static",
  "assets",
  "staging",
  "dev",
  DEFAULT_SHOP_SUB,
  "marketplace",
  "sell",
  "store",
  "help",
  "support",
  "billing",
  "status",
]);

export function storefrontRootDomain(): string {
  return (process.env.NEXT_PUBLIC_STOREFRONT_ROOT_DOMAIN || DEFAULT_ROOT).trim().toLowerCase() || DEFAULT_ROOT;
}

export function storefrontShopSubdomain(): string {
  return (process.env.NEXT_PUBLIC_STOREFRONT_SHOP_SUBDOMAIN || DEFAULT_SHOP_SUB).trim().toLowerCase() || DEFAULT_SHOP_SUB;
}

function hostOnly(hostHeader: string | null): string {
  const raw = (hostHeader || "").split(",")[0]?.trim() || "";
  return raw.split(":")[0]?.trim().toLowerCase() || "";
}

export type StorefrontHostKind =
  | { kind: "default" }
  | { kind: "shop" }
  | { kind: "seller"; slug: string };

/**
 * Classify request host for middleware rewrites.
 * Local / preview hosts → `default` (no tenant rewrite).
 */
export function resolveStorefrontHost(hostHeader: string | null): StorefrontHostKind {
  const full = hostOnly(hostHeader);
  if (!full || full === "localhost" || full.endsWith(".local")) {
    return { kind: "default" };
  }

  const root = storefrontRootDomain();
  const shopSub = storefrontShopSubdomain();
  const shopFqdn = `${shopSub}.${root}`;

  if (full === shopFqdn) {
    return { kind: "shop" };
  }

  if (!full.endsWith(`.${root}`) || full === root) {
    return { kind: "default" };
  }

  const sub = full.slice(0, -(root.length + 1));
  if (!sub || sub.includes(".")) {
    return { kind: "default" };
  }
  if (RESERVED_SUBDOMAINS.has(sub)) {
    return { kind: "default" };
  }

  return { kind: "seller", slug: sub };
}
