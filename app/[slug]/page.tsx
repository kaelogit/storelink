import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import StoreFront from "@/components/StoreFront";
import type { Metadata } from "next"; 
import { shuffleArray } from "@/utils/shuffle";
import ViewTracker from "@/components/ViewTracker";
import { Lock, ShieldAlert } from "lucide-react"; 

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

  if (!store) return { title: "Store Not Found" };

  const ogImage = store.cover_image_url || store.logo_url || "https://storelink.ng/og-image.png";

  return {
    title: store.name,
    description: store.description || `Check out ${store.name} on StoreLink.`,
    openGraph: {
      title: store.name,
      description: store.description || "Order directly via WhatsApp.",
      url: `https://storelink.ng/${resolvedParams.slug}`,
      siteName: "StoreLink",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: store.name,
        },
      ],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: store.name,
      description: store.description || "Order directly via WhatsApp.",
      images: [ogImage],
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

  if (store.status === 'banned') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 border border-red-200">
          <ShieldAlert size={32} className="text-red-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Store Suspended</h1>
        <p className="text-gray-500 max-w-md mb-6 font-medium">
          This store has been suspended for violating community guidelines. 
          Access to this storefront is currently restricted.
        </p>
        <div className="mt-8 pt-8 border-t border-gray-200 w-full max-w-xs">
          <p className="text-[10px] text-red-400 font-black uppercase tracking-[0.3em]">
            Admin Action Enforced
          </p>
        </div>
      </div>
    );
  }

  if (store.subscription_expiry && new Date(store.subscription_expiry) < new Date()) {
     return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
              <Lock size={32} className="text-red-600" />
           </div>
           
           <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Store Locked</h1>
           
           <p className="text-gray-500 max-w-md mb-6 font-medium">
             This store’s subscription has expired. 
             If you are the **Store Owner**, please log into your dashboard and renew to restore public access.
           </p>

           <div className="mt-8 pt-8 border-t border-gray-200 w-full max-w-xs">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Status: Subscription Expired
              </p>
           </div>
        </div>
     );
  }

  let productsQuery = supabase
    .from("storefront_products")
    .select("*")
    .eq("store_id", store.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (store.subscription_plan === 'free') {
    productsQuery = productsQuery.limit(5);
  }

  const { data: products } = await productsQuery;

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