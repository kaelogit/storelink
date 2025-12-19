import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/shared/AddToCartButton";
import ProductHeader from "@/components/shared/ProductHeader";
import ProductGallery from "@/components/shared/ProductGallery";
import FlashTimer from "@/components/shared/FlashTimer";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  ChevronLeft, LayoutDashboard, ShieldCheck, 
  Truck, ArrowRight, Zap, Package, ShoppingBag 
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params; 
  const { data: product } = await supabase
    .from("storefront_products")
    .select("*, stores(name)")
    .eq("id", resolvedParams.id) 
    .single();

  if (!product) return { title: "Product Not Found" };

  const p: any = product; 
  const storeName = Array.isArray(p.stores) ? p.stores[0]?.name : p.stores?.name;
  
  const isFlashActive = p.flash_drop_expiry && new Date(p.flash_drop_expiry) > new Date();
  const displayPrice = isFlashActive ? p.flash_drop_price : p.price;

  return {
    title: `${p.name} - ₦${displayPrice.toLocaleString()}`,
    description: p.description || `Buy ${p.name} from ${storeName}`,
    openGraph: {
      title: `${p.name} | ${storeName}`,
      description: `Price: ₦${displayPrice.toLocaleString()}. Order via WhatsApp.`,
      images: p.image_urls || [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params; 
  const { data: product } = await supabase
    .from("storefront_products")
    .select("*, stores(*)")
    .eq("id", resolvedParams.id)
    .single();

  if (!product) return notFound();

  const store = product.stores;
  const isStockAvailable = product.stock_quantity > 0;
  
  const isFlashActive = product.flash_drop_expiry && new Date(product.flash_drop_expiry) > new Date();

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      
      <ProductHeader 
        storeSlug={store.slug}
        storeLogo={store.logo_url} />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          
          <div className="relative">
             <ProductGallery 
                images={product.image_urls || [product.image_url]} 
                stockCount={product.stock_quantity} 
             />
          </div>

          <div className="flex flex-col justify-center">
             <div className="mb-8">
                
                {isFlashActive && (
                  <div className="mb-6">
                    <FlashTimer expiry={product.flash_drop_expiry} />
                  </div>
                )}

                <h1 className="text-1xl md:text-3xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tight uppercase">
                  {product.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4">
                  {isFlashActive ? (
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-black text-emerald-600 tracking-tighter">
                        ₦ {product.flash_drop_price.toLocaleString()}
                      </p>
                      <p className="text-sm font-bold text-gray-400 line-through tracking-tighter decoration-red-500/50">
                        ₦ {product.price.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-2xl font-black text-emerald-600 tracking-tighter">
                      ₦ {product.price.toLocaleString()}
                    </p>
                  )}

                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    isStockAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {isStockAvailable ? `${product.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
                  </span>
                </div>
             </div>
             
             <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 mb-6 relative">
                <div className="absolute -top-3 left-8 bg-white px-3 text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 rounded-lg">Product Details</div>
                <div className="prose prose-sm text-gray-600 leading-relaxed font-medium">
                  <p className="whitespace-pre-line">{product.description || "No detailed description provided for this item."}</p>
                </div>
             </div>

             <div className="mb-10">
                <AddToCartButton product={product} store={store} />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Truck size={20}/></div>
                   <div>
                      <h3 className="font-bold text-sm text-gray-900 mb-1 uppercase tracking-tighter">Delivery</h3>
                      <p className="text-[11px] text-gray-500 leading-snug">Calculated by {store.name} after WhatsApp confirmation.</p>
                   </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                   <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Zap size={20}/></div>
                   <div>
                      <h3 className="font-bold text-sm text-gray-900 mb-1 uppercase tracking-tighter">Response</h3>
                      <p className="text-[11px] text-gray-500 leading-snug">Instant order processing once you chat the vendor.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-10 md:py-16 text-center mt-10 md:mt-20">
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-2 opacity-40">
              <ShieldCheck size={24} className="text-gray-900"/>
              <span className="text-[9px] font-black uppercase tracking-widest">Safe Shop</span>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex flex-col items-center gap-2 opacity-40">
              <Package size={24} className="text-gray-900"/>
              <span className="text-[9px] font-black uppercase tracking-widest">Quality Check</span>
            </div>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-500">
             <LayoutDashboard size={18} className="text-emerald-600"/>
             <span className="font-black text-gray-900 uppercase tracking-tighter text-sm">StoreLink social engine</span>
          </Link>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-4">Security Guaranteed • 2025</p>
      </footer>
    </div>
  );
}