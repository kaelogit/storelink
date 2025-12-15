import { supabase } from "@/lib/supabase";
import LandingPageWrapper from "@/components/landing/LandingPageWrapper";

export const revalidate = 0; 

export default async function LandingPage() {
  
  
  const { data: premiumStores } = await supabase
    .from("stores")
    .select("id")
    .neq("subscription_plan", "free"); // <--- FILTER: NO FREE VENDORS

  const premiumStoreIds = premiumStores?.map(s => s.id) || [];

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("store_id", premiumStoreIds) // <--- Only show items from paid stores
    .eq("is_active", true)
    .limit(100)
    .order("created_at", { ascending: false });

  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .limit(50);

  return (
    <LandingPageWrapper 
      products={products || []} 
      stores={stores || []} 
    />
  );
}