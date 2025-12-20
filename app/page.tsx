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
  .select(`
    *, 
    stores!inner(
      name, 
      subscription_plan, 
      verification_status, 
      slug,
      whatsapp_number,
      loyalty_enabled,   
      loyalty_percentage 
    )
  `)
  .eq("is_active", true)
  .order("created_at", { ascending: false })
  .limit(12);

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