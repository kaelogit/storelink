import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import StoreFront from "@/components/StoreFront";
import type { Metadata } from "next"; 
import { shuffleArray } from "@/utils/shuffle";
import ViewTracker from "@/components/ViewTracker";
import { AlertTriangle, Lock } from "lucide-react"; // 👈 Added Icons

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  const { data: store } = await supabase
    .from("stores")
    .select("name, description, logo_url, cover_image_url")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!store) {
    return {
      title: "Store Not Found",
    };
  }

  const shareImage = store.cover_image_url || store.logo_url || "/og-image.png";

  return {
    title: store.name,
    description: store.description || `Check out ${store.name} on StoreLink.`,
    openGraph: {
      title: store.name,
      description: store.description || "Order directly via WhatsApp.",
      images: [shareImage], 
    },
  };
}

export default async function VendorStorePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { data: store } = await supabase
    .from("stores")
    .select("*, products(*)") 
    .eq("slug", resolvedParams.slug)
    .single();

  if (!store) return notFound();

  if (store.subscription_expiry && new Date(store.subscription_expiry) < new Date()) {
     return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
           <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Lock size={32} className="text-gray-400" />
           </div>
           <h1 className="text-2xl font-black text-gray-900 mb-2">Store Unavailable</h1>
           <p className="text-gray-500 max-w-md">
             This store is currently inactive due to a subscription issue. 
             Please contact the vendor directly or check back later.
           </p>
           <div className="mt-8 pt-8 border-t border-gray-200 w-full max-w-xs">
              <p className="text-xs text-gray-400 font-mono">ERROR: SUB_EXPIRED</p>
           </div>
        </div>
     );
  }

  const { data: products } = await supabase
    .from("storefront_products")
    .select("*")
    .eq("store_id", store.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("store_id", store.id);

  const shuffledProducts = shuffleArray(products || []);

  return (
    <>
      <ViewTracker storeId={store.id} />

      <StoreFront 
        store={store} 
        products={shuffledProducts}
        categories={categories || []} 
      />
    </>
  );
}