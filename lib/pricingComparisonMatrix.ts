/** Standard vs Diamond — single source for `/pricing` comparison table. */

import { SELLER_DIAMOND_PRICE_NGN } from "@/lib/subscriptionPricing";

const diamondMo = `₦${SELLER_DIAMOND_PRICE_NGN.toLocaleString("en-NG")} / mo`;

export type PlanMatrixCell = "yes" | "limited" | "no" | "text";

export type PricingMatrixRow = {
  label: string;
  standard: { kind: PlanMatrixCell; detail?: string };
  diamond: { kind: PlanMatrixCell; detail?: string };
};

export const PRICING_MATRIX_ROWS: PricingMatrixRow[] = [
  {
    label: "Seller subscription (StoreLink)",
    standard: { kind: "text", detail: "₦0 / mo" },
    diamond: { kind: "text", detail: `${diamondMo} (in app)` },
  },
  {
    label: "Public storefront & shop link",
    standard: { kind: "yes" },
    diamond: { kind: "yes" },
  },
  {
    label: "Catalog & checkout",
    standard: { kind: "yes" },
    diamond: { kind: "yes" },
  },
  {
    label: "Marketplace discovery",
    standard: { kind: "limited", detail: "Fair caps" },
    diamond: { kind: "limited", detail: "Higher caps & priority" },
  },
  {
    label: "Orders & seller dashboard",
    standard: { kind: "yes" },
    diamond: { kind: "yes" },
  },
  {
    label: "Store Coin loyalty (for your buyers)",
    standard: { kind: "yes" },
    diamond: { kind: "yes" },
  },
  {
    label: "AI background removal",
    standard: { kind: "no" },
    diamond: { kind: "yes" },
  },
  {
    label: "Flash Drop / spotlight-style tools",
    standard: { kind: "limited", detail: "Where available" },
    diamond: { kind: "yes" },
  },
  {
    label: "Blue Tick verification",
    standard: { kind: "text", detail: "Apply on any plan" },
    diamond: { kind: "text", detail: "Apply on any plan" },
  },
];
