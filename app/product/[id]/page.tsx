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
  Truck, ArrowRight, Zap, Package, ShoppingBag, Coins, TrendingUp 
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

// --- 1. METADATA AUDIT (SEO Optimized) ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
    title: `${p.name} - ₦${displayPrice.toLocaleString()} | StoreLink`,
    description: p.description || `Buy ${p.name} from ${storeName} on StoreLink.`,
    openGraph: {
      title: `${p.name} | ${storeName}`,
      description: `Price: ₦${displayPrice.toLocaleString()}. Secure your order via WhatsApp.`,
      images: p.image_urls || [],
    },
  };
}

// --- 2. MAIN PRODUCT VIEW ---
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
  
  // ✨ REWARD CALCULATION: Ensures user earns based on the actual price paid (Flash vs Regular)
  const currentPrice = isFlashActive ? product.flash_drop_price : product.price;
  const potentialReward = store.loyalty_enabled 
    ? Math.floor(currentPrice * ((store.loyalty_percentage || 0) / 100)) 
    : 0;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* GLOBAL HEADER */}
      <ProductHeader 
        storeSlug={store.slug}
        storeLogo={store.logo_url} />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          
          {/* LEFT: GALLERY */}
          <div className="relative">
             <ProductGallery 
                images={product.image_urls || [product.image_url]} 
                stockCount={product.stock_quantity} 
             />
          </div>

          {/* RIGHT: CONTENT */}
          <div className="flex flex-col justify-center">
             <div className="mb-8">
                
                {isFlashActive && (
                  <div className="mb-6">
                    <FlashTimer expiry={product.flash_drop_expiry} />
                  </div>
                )}

                <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tight uppercase italic">
                  {product.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4">
                  {isFlashActive ? (
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                        ₦ {product.flash_drop_price.toLocaleString()}
                      </p>
                      <p className="text-sm font-bold text-gray-400 line-through tracking-tighter decoration-red-500/50 decoration-2">
                        ₦ {product.price.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                      ₦ {product.price.toLocaleString()}
                    </p>
                  )}

                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${
                    isStockAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {isStockAvailable ? `${product.stock_quantity} IN STOCK` : 'OUT OF STOCK'}
                  </span>
                </div>
             </div>
             
             {/* PRODUCT INFO BLOCK */}
             <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 mb-8 relative">
                <div className="absolute -top-3 left-8 bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border border-gray-100 rounded-full shadow-sm">Product Intel</div>
                <div className="prose prose-sm text-gray-600 leading-relaxed font-bold uppercase text-xs">
                  <p className="whitespace-pre-line">{product.description || "No detailed description provided for this item."}</p>
                </div>
             </div>

             {/* ACTIONS */}
             <div className="mb-8">
                <AddToCartButton product={product} store={store} />
             </div>

             {/* ✨ EMPIRE REWARD HIGHLIGHT (Enhanced) */}
             {store.loyalty_enabled && potentialReward > 0 && (
                <div className="mb-10 bg-amber-500 text-white rounded-[2.5rem] p-6 flex items-center justify-between shadow-2xl shadow-amber-200 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex items-center gap-5">
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                      <Coins size={28} className="text-white fill-white/20" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 leading-none mb-1.5">Empire Patron Reward</p>
                      <p className="text-xl font-black tracking-tighter">
                        Earn +₦{potentialReward.toLocaleString()} Coins
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-white text-amber-600 px-3 py-1 rounded-full text-[10px] font-black shadow-sm uppercase tracking-tighter">
                      <Zap size={10} fill="currentColor" /> {store.loyalty_percentage}% BACK
                    </div>
                  </div>
                </div>
             )}

             {/* TRUST BADGES */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-4 hover:border-blue-200 transition-colors">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Truck size={20}/></div>
                   <div>
                      <h3 className="font-black text-xs text-gray-900 mb-1 uppercase tracking-widest">Naija Delivery</h3>
                      <p className="text-[11px] text-gray-500 font-bold leading-snug uppercase">Chat {store.name} for rates after secure checkout.</p>
                   </div>
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-4 hover:border-amber-200 transition-colors">
                   <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Zap size={20}/></div>
                   <div>
                      <h3 className="font-black text-xs text-gray-900 mb-1 uppercase tracking-widest">Verified Vendor</h3>
                      <p className="text-[11px] text-gray-500 font-bold leading-snug uppercase">Instant order receipt generated upon vendor confirmation.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* FOOTER: Design Synced with Marketplace */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 md:py-20 text-center mt-12">
          <div className="flex justify-center items-center gap-8 mb-10">
            <div className="flex flex-col items-center gap-3 opacity-30">
              <ShieldCheck size={32} className="text-gray-900"/>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Safe Shop</span>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex flex-col items-center gap-3 opacity-30">
              <Package size={32} className="text-gray-900"/>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quality Check</span>
            </div>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
             <LayoutDashboard size={20} className="text-emerald-600"/>
             <span className="font-black text-gray-900 uppercase tracking-widest text-sm">StoreLink social engine</span>
          </Link>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.4em] mt-6">Secure Cloud Infrastructure • 2025</p>
      </footer>
    </div>
  );
}