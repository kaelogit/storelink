import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import StoreFront from "@/components/StoreFront";
import type { Metadata } from "next"; 

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. GENERATE METADATA (Runs on server for WhatsApp previews)
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

  // Use cover image if available, otherwise logo, otherwise default
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

// 2. MAIN PAGE COMPONENT
export default async function VendorStorePage({ params }: PageProps) {
  const resolvedParams = await params;
  
  // A. Fetch Store
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!store) return notFound();

  // B. Fetch Products (Using the Secure View)
  const { data: products } = await supabase
    .from("storefront_products")
    .select("*")
    .eq("store_id", store.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // C. Fetch Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("store_id", store.id);

  // D. Render Design
  return (
    <StoreFront 
      store={store} 
      products={products || []} 
      categories={categories || []} 
    />
  );
}