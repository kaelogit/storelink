export interface Store {
  /** Present when row is built from `profiles` (profile-as-storefront). */
  __surface?: "profile" | "merged"; /** merged = legacy `stores` row + profile as display source of truth */
  /** Real `stores.id` when a legacy row exists; checkout keys off `owner_id` (profile id). */
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
  /** Seller profile id — joins `stores.owner_id`. */
  seller_id: string;
  category_id?: string | null;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  image_urls: string[];
  is_active: boolean;
  flash_drop_price?: number; 
  flash_drop_expiry?: string;
  
  stores?: Store; 
  categories?: { name: string };
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