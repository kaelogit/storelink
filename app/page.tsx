import { supabase } from "@/lib/supabase";
import LandingPageWrapper from "@/components/landing/LandingPageWrapper";
import { shuffleArray } from "@/utils/shuffle";

export const revalidate = 0; 
export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  
  const { data: premiumStores } = await supabase
    .from("stores")
    .select("id")
    .neq("subscription_plan", "free");

  const premiumStoreIds = premiumStores?.map(s => s.id) || [];

  const { data: products } = await supabase
    .from("storefront_products") 
    .select("*, stores(name, slug, subscription_plan)")
    .in("store_id", premiumStoreIds) 
    .eq("is_active", true)
    .limit(100)
    .order("created_at", { ascending: false });

  const { data: stores } = await supabase
    .from("stores")
    .select("*, subscription_plan") 
    .neq("subscription_plan", "free") 
    .limit(50);

  const shuffledProducts = shuffleArray(products || []);
  const shuffledStores = shuffleArray(stores || []);

  return (
    <LandingPageWrapper 
      products={shuffledProducts} 
      stores={shuffledStores} 
    />
  );
}