import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import FullMarketplaceClient from "@/components/marketplace/FullMarketplaceClient";
import { shuffleArray } from "@/utils/shuffle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full Marketplace | Shop the StoreLink Empire",
  description: "Explore thousands of products from verified Nigerian vendors. From perfumes to fashion, find the best deals and order instantly via WhatsApp.",
  openGraph: {
    title: "Full Marketplace | Shop the StoreLink Empire",
    description: "Browse verified vendors, discover new products, and shop the heart of the StoreLink economy.",
    images: ['/og-image.png'],
    url: 'https://storelink.ng/marketplace',
  },
};

export const dynamic = 'force-dynamic';

export default async function MarketplacePage() {
  
  const { data: rawProducts } = await supabase
    .from("storefront_products") 
    .select(`
      *, 
      stores!inner(
        name, 
        whatsapp_number, 
        slug, 
        subscription_plan, 
        category, 
        verification_status, 
        subscription_expiry,
        loyalty_enabled,
        loyalty_percentage
      )
    `) 
    .eq("is_active", true)
    .neq("stores.subscription_plan", "free")
    .order("created_at", { ascending: false }) 
    .limit(100);

  const storeItemTracker: Record<string, number> = {};
  const now = new Date();
  
  const filteredByPlan = (rawProducts || []).filter(product => {
    const plan = product.stores?.subscription_plan;
    const storeId = product.store_id;
    const expiry = product.stores?.subscription_expiry;

    if (expiry && new Date(expiry) < now) {
      return false;
    }

    if (plan !== 'diamond' && plan !== 'premium') {
      return false;
    }

    const currentCount = storeItemTracker[storeId] || 0;
    if (currentCount < 10) { 
      storeItemTracker[storeId] = currentCount + 1;
      return true;
    }
    
    return false;
  });

  const shuffledProducts = shuffleArray(filteredByPlan.slice(0, 60));

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .is("store_id", null) 
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        
       <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 h-16 flex items-center justify-between shadow-sm">
         <Link href="/" className="font-extrabold text-xl tracking-tight text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-emerald-600"/> StoreLink
         </Link>
         
         <div className="hidden md:block font-bold text-gray-400 text-sm uppercase tracking-wider">
            Marketplace
         </div>

         <Link href="/" className="flex items-center gap-2 font-bold text-gray-500 hover:text-gray-900 transition text-sm bg-gray-100 px-3 py-2 rounded-xl hover:bg-gray-200">
           <ArrowLeft size={16} /> <span className="hidden md:inline">Back to Home</span>
         </Link>
       </nav>

       <div className="flex-1">
         <FullMarketplaceClient 
            initialProducts={shuffledProducts || []} 
            categories={categories || []} 
         />
       </div>

       <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
          <div className="max-w-6xl mx-auto px-4 text-center">
              <p className="font-extrabold text-gray-300 text-2xl mb-2 flex items-center justify-center gap-2">
                  <LayoutDashboard className="text-gray-200"/> StoreLink
              </p>
              <p className="text-xs text-gray-300 mt-6">© {new Date().getFullYear()} StoreLink. All rights reserved.</p>
          </div>
       </footer>

    </div>
  );
}