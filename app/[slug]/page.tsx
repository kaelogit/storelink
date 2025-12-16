import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import StoreFront from "@/components/StoreFront";
import type { Metadata } from "next"; 
import { shuffleArray } from "@/utils/shuffle";

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
    .select("*, products(*)") // Ensure products are selected for views loop
    .eq("slug", resolvedParams.slug)
    .single();

  if (!store) return notFound();

  if (store.products) {
    for (const product of store.products) {
        await supabase.rpc('increment_product_view', { product_id: product.id }); 
    }
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
    <StoreFront 
      store={store} 
      products={shuffledProducts}
      categories={categories || []} 
    />
  );
}