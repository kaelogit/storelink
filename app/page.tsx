import { supabase } from "@/lib/supabase";
import LandingPageWrapper from "@/components/landing/LandingPageWrapper";
import { shuffleArray } from "@/utils/shuffle";

export const revalidate = 0; 
export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  
  // Calculate the "Cutoff" time (Current Time minus 24 hours)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // 1. ✨ FETCH PRODUCTS WITH 24H VISIBILITY LOGIC
  const { data: products } = await supabase
  .from("storefront_products")
  .select(`
    *, 
    stores!inner(
      id,
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
  .neq("stores.subscription_plan", "free")
  // 🔥 THE LOGIC: (In Stock) OR (Sold out in the last 24 hours)
  .or(`stock_quantity.gt.0,sold_out_at.gt.${twentyFourHoursAgo}`)
  .order("created_at", { ascending: false })
  .limit(100);

  // 2. Fetch paid stores ONLY for the vendors view
  const { data: stores } = await supabase
    .from("stores")
    .select("*, subscription_plan") 
    .neq("subscription_plan", "free")
    .limit(100);

  // 3. Shuffle so it feels fresh
  const shuffledProducts = shuffleArray(products || []);
  const shuffledStores = shuffleArray(stores || []);

  return (
    <LandingPageWrapper 
      products={shuffledProducts} 
      stores={shuffledStores} 
    />
  );
}