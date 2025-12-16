import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/shared/AddToCartButton";
import ProductHeader from "@/components/shared/ProductHeader";
import ProductGallery from "@/components/shared/ProductGallery";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params; 
  
  const { data: product } = await supabase
    .from("storefront_products")
    .select("*, stores(name)")
    .eq("id", resolvedParams.id) 
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const p: any = product; 
  const storeName = Array.isArray(p.stores) ? p.stores[0]?.name : p.stores?.name;

  return {
    title: `${p.name} - ₦${p.price.toLocaleString()}`,
    description: p.description || `Buy ${p.name} from ${storeName}`,
    openGraph: {
      title: `${p.name} | ${storeName}`,
      description: `Price: ₦${p.price.toLocaleString()}. Order via WhatsApp.`,
      images: p.image_urls || [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params; // ✅ Await it first!
  
  const { data: product } = await supabase
    .from("storefront_products")
    .select("*, stores(*)")
    .eq("id", resolvedParams.id) // ✅ Use the resolved version
    .single();

  if (!product) return notFound();

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("id", product.store_id)
    .single();

  const isStockAvailable = product.stock_quantity > 0;

  return (
    <div className="min-h-screen bg-white pb-32 font-sans">
      <ProductHeader storeSlug={store.slug} />
      
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          
          <ProductGallery images={product.image_urls || [product.image_url]} />

          <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-2xl text-emerald-600 font-extrabold">₦{product.price.toLocaleString()}</p>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isStockAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                     {isStockAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
                <p>{product.description}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
                 <h3 className="font-bold text-sm text-gray-900 mb-2">Delivery Info</h3>
                 <p className="text-sm text-gray-500">Delivery fees are calculated by {store.name} after order confirmation on WhatsApp.</p>
              </div>
          </div>
        </div>
      </div>

      <AddToCartButton product={product} store={store} />
    </div>
  );
}