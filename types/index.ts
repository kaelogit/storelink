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

  view_count?: number; // <--- ADDED THIS (Needed for Dashboard Stats)
  subscription_plan: 'free' | 'premium' | 'diamond'; // <--- ADDED DIAMOND
  subscription_status?: 'active' | 'inactive' | 'expired'; // <--- ADDED THIS (Good for logic)
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
  
  stores?: Store; 
  categories?: { name: string }; // <--- ADDED THIS (Needed for Dashboard & Marketplace)
}

export interface Order {
  id: string;
  store_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  total_amount: number;
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