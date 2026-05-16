import type { StorefrontThemeNormalized } from "@/lib/storefrontTheme";

export interface Store {
  /** Present when row is built from `profiles` (canonical). */
  __surface?: "profile" | "merged";
  /** Deprecated: always null when sourced from `profiles`. */
  __legacy_store_id?: string | null;
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  owner_email?: string;
  description: string | null;
  location: string;
  /** Structured region for compact UI (cards, pins) — aligned with `profiles.location_*`. */
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  /** ISO 3166-1 alpha-2 — aligned with `profiles.location_country_code`. */
  location_country_code?: string | null;
  whatsapp_number: string;
  logo_url: string | null;
  cover_image_url: string | null;
  
  instagram_url?: string | null;
  tiktok_url?: string | null;
  instagram_handle?: string; 

  verification_status?: 'none' | 'pending' | 'verified' | 'rejected';
  verification_doc_url?: string;
  verification_selfie_url?: string; // 👈 ADDED THIS LINE
  verification_note?: string;

  view_count?: number;
  /** Canonical: `standard` | `diamond`. Legacy: `free`, `premium`. */
  subscription_plan: 'standard' | 'free' | 'premium' | 'diamond' | string;
  subscription_expiry?: string | null;
  subscription_status?: 'active' | 'inactive' | 'expired' | string | null;

  loyalty_enabled?: boolean;
  loyalty_percentage?: number;
  /** product | service | both — web storefront only surfaces product tools. */
  seller_type?: string;
  /** Parsed from `profiles.storefront_theme` — always set for profile-backed stores. */
  storefront_theme?: StorefrontThemeNormalized;
}

export interface Category {
  id: string;
  /** Merchant catalog: owner profile id. Omitted for global `category_scope=platform` rows. */
  seller_id?: string | null;
  name: string;
  created_at?: string;
  parent_id?: string | null;
  category_scope?: "platform" | "seller";
}

export interface Product {
  id: string;
  /** Seller profile id — same as `profiles.id` for storefront joins. */
  seller_id: string;
  category_id?: string | null;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image_urls: string[];
  is_active: boolean;
  /** Canonical on `products` — use with `flash_end_time` / `flash_expiry`. */
  is_flash_drop?: boolean | null;
  flash_price?: number | null;
  flash_end_time?: string | null;
  flash_expiry?: string | null;
  /** Aliases from `storefront_products` / RPCs only — not columns on `products`. */
  flash_drop_price?: number;
  flash_drop_expiry?: string;
  /** From `storefront_products` / discovery RPCs — `product_effective_checkout_unit_price(...)`. */
  effective_checkout_unit_price?: number | null;
  
  /** Joined seller row (from `profiles` via `fetchMergedStoreRowsForSellerIds`). */
  stores?: Store; 
  categories?: { name: string };
  /** Cart snapshot only: original list price when `price` is the flash amount — not a DB column. */
  compare_at_price?: number | null;
  /** Web storefront merchandising; mobile catalog can ignore. */
  storefront_new_arrival?: boolean | null;
  storefront_best_seller?: boolean | null;
}

export interface Order {
  id: string;
  store_id?: string | null;
  seller_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  total_amount: number;
  coins_redeemed?: number; // ✨ ADDED THIS for the Order Ledger
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}