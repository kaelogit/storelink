export interface Store {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  description: string | null;
  location: string;
  whatsapp_number: string;
  logo_url: string | null;
  cover_image_url: string | null;
  
  instagram_url?: string | null;
  tiktok_url?: string | null;
  instagram_handle?: string; 

  verification_status?: 'none' | 'pending' | 'verified' | 'rejected';
  verification_doc_url?: string;
  verification_note?: string;

  view_count?: number; 
  subscription_plan: 'free' | 'premium' | 'diamond';
  subscription_status?: 'active' | 'inactive' | 'expired';

  loyalty_enabled?: boolean;
  loyalty_percentage?: number;
}

export interface Category {
  id: string;
  store_id: string;
  name: string;
  created_at?: string;
}

export interface Product {
  id: string;
  store_id: string;
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
  store_id: string;
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