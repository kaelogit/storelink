"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Download, Share2, CheckCircle2, Layout, RotateCw,
  Check, Loader2, Crown, Store, X
} from "lucide-react";
import { toPng } from "html-to-image";
import { supabase } from "@/lib/supabase";

// --- 🚀 URGENCY & SOCIAL PROOF FLYER ---
const UrgencySocialProofFlyer = ({ store, products, qrCode }: any) => (
  <div className="w-[794px] h-[1123px] bg-gradient-to-b from-gray-900 via-gray-800 to-black relative overflow-hidden flex flex-col font-sans text-white">
    {/* Animated Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-gradient-to-b from-amber-500/10 to-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/5 rounded-full blur-3xl" />
    </div>

    {/* Glowing Grid Overlay */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                       linear-gradient(90deg, #fff 1px, transparent 1px)`,
      backgroundSize: '50px 50px'
    }} />

    {/* Main Content */}
    <div className="relative z-10 flex-1 p-16 flex flex-col">
      
      {/* HEADER - Countdown & Logo */}
      <div className="flex justify-between items-start mb-16">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur opacity-70 animate-pulse" />
            <img 
              src={store?.logo_url} 
              crossOrigin="anonymous" 
              className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20"
              alt={store?.name}
            />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">{store?.name}</h2>
            <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mt-1">24/7 STOREFRONT</p>
          </div>
        </div>
        
        {/* LIVE BADGE */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur opacity-50 animate-ping" />
          <div className="relative bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-8 py-3 rounded-full shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="font-black uppercase tracking-[0.3em] text-sm">LIVE NOW</span>
            </div>
          </div>
        </div>
      </div>

      {/* HERO SECTION - Big Bold Message */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-white/10">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-widest">BREAKING NEWS</span>
        </div>
        
        <h1 className="text-7xl font-black leading-[0.85] tracking-tighter">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400">
            NO MORE
          </span>
          <span className="block mt-4">
            "DM FOR <span className="text-red-400">PRICE"</span>
          </span>
        </h1>
        
        <p className="text-2xl text-gray-300 font-medium mt-8 max-w-2xl leading-relaxed">
          Shop instantly. See all prices. Checkout in seconds. 
          <span className="text-emerald-400 font-bold"> No waiting, no stress.</span>
        </p>
      </div>

      {/* SOCIAL PROOF SECTION */}
      <div className="mb-12">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-emerald-400 mb-2">24/7</div>
            <p className="text-sm font-medium text-gray-300">Shop Anytime</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-emerald-400 mb-2">100%</div>
            <p className="text-sm font-medium text-gray-300">Price Transparency</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-emerald-400 mb-2">⚡</div>
            <p className="text-sm font-medium text-gray-300">Instant Checkout</p>
          </div>
        </div>
      </div>

      {/* PRODUCTS SHOWCASE */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">TOP PICKS THIS WEEK</h3>
          <div className="flex items-center gap-2 text-emerald-400">
            <span>🔥</span>
            <span className="text-sm font-bold uppercase tracking-widest">SELLING FAST</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {products.slice(0, 3).map((p: any, i: number) => (
            <div key={i} className="group relative">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-gray-800 to-gray-900 border border-white/10">
                <div className="aspect-square relative">
                  <img 
                    src={p.display_image} 
                    crossOrigin="anonymous" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={p.name || `Product ${i + 1}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* HOT BADGE */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black px-2 py-1 rounded-full">
                      HOT 🔥
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-lg font-bold mb-2">₦{p.price?.toLocaleString()}</p>
                  <p className="text-sm text-gray-300 line-clamp-2">{p.name || `Product ${i + 1}`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION - QR CODE & URGENCY */}
      <div className="flex-1 flex items-end pb-8">
        <div className="grid grid-cols-2 gap-12 w-full items-end">
          
          {/* URGENCY MESSAGING */}
          <div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="font-bold uppercase tracking-widest text-sm">WHY WAIT?</span>
                </div>
                <p className="text-xl font-bold leading-tight">
                  Scan now. Shop now. 
                  <span className="text-emerald-400"> Get it now.</span>
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white font-black text-lg">→</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Direct WhatsApp Checkout</p>
                  <p className="text-xs text-gray-400">Message seller instantly after selection</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR CODE - CENTER STAGE */}
          <div className="text-center">
            <div className="relative inline-block">
              {/* GLOWING RING */}
              <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
              
              {/* QR CONTAINER */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border border-white/20 shadow-2xl">
                <div className="mb-4">
                  <p className="text-2xl font-black mb-1">SCAN & SHOP</p>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em]">IMMEDIATE ACCESS</p>
                </div>
                
                <div className="bg-white p-4 rounded-2xl mb-4">
                  <img 
                    src={qrCode} 
                    crossOrigin="anonymous" 
                    className="w-40 h-40"
                    alt="QR Code"
                  />
                </div>
                
                <div>
                  <p className="text-xl font-black mb-1">
                    storelink.ng/<span className="text-emerald-400">{store?.slug}</span>
                  </p>
                  <p className="text-xs text-gray-400">Your gateway to instant shopping</p>
                </div>
              </div>
              
              {/* ANIMATED ARROWS */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
                <div className="text-emerald-400 animate-bounce text-sm">↓</div>
                <div className="text-emerald-400 animate-bounce text-sm" style={{animationDelay: '0.2s'}}>↓</div>
                <div className="text-emerald-400 animate-bounce text-sm" style={{animationDelay: '0.4s'}}>↓</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* FOOTER */}
    <div className="relative z-10 px-16 py-6 border-t border-white/10">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span>🎯</span>
          <span className="font-bold uppercase tracking-widest text-xs">Stop Asking. Start Shopping.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-black text-xs">#ShopInstantly</span>
          <span className="text-gray-600">•</span>
          <span className="text-emerald-400 font-black text-xs">#NoMoreDM</span>
        </div>
      </div>
    </div>
  </div>
);

const LuxeBlackA4 = ({ store, products, qrCode }: any) => (
  <div className="w-[794px] h-[1123px] bg-black relative overflow-hidden font-sans text-white">
    {/* Subtle Grain */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2937,black)] opacity-80" />

    <div className="relative z-10 h-full flex flex-col px-20 pt-20 pb-12">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-16">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight">
            {store?.name}
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mt-1">
            Premium Online Store
          </p>
        </div>

        <img
          src={store?.logo_url}
          crossOrigin="anonymous"
          className="w-16 h-16 rounded-xl object-cover border border-white/10"
          alt={store?.name}
        />
      </div>

      {/* HERO */}
      <div className="mb-16 max-w-xl">
        <h1 className="text-5xl font-black leading-tight">
          Shop without<br />
          <span className="text-emerald-400 italic">
            asking prices
          </span>
        </h1>
        <p className="mt-4 text-base text-gray-300 leading-relaxed">
          Every product. Every price. Instantly available online.
        </p>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-3 gap-8 mb-16">
        {products.slice(0, 3).map((p: any, i: number) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl bg-gray-900">
              <img
                src={p.display_image}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                alt={p.name || `Product ${i + 1}`}
              />
            </div>
            <p className="text-lg font-black text-emerald-400">
              ₦{p.price?.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto flex items-center justify-between border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">
            Scan to shop
          </p>
          <h3 className="text-xl font-black">
            Our store is live 24/7
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            No DMs. No delays. Just shopping.
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl">
          <img
            src={qrCode}
            crossOrigin="anonymous"
            className="w-32 h-32"
            alt="QR Code"
          />
        </div>
      </div>
    </div>
  </div>
);



// --- 🏆 PROFESSIONAL BUSINESS FLYER (A4 Portrait) ---
const ModernRetail = ({ store, products, qrCode }: any) => (
  <div className="w-[794px] h-[1123px] bg-gradient-to-br from-gray-50 to-white relative overflow-hidden flex flex-col font-sans">
    {/* Premium Background Elements */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
    <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />
    
    {/* Decorative Elements */}
    <div className="absolute top-20 right-10 w-56 h-56 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 opacity-60 blur-3xl" />
    <div className="absolute bottom-40 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-gray-100 to-white opacity-70 blur-2xl" />
    
    {/* Main Content Container */}
    <div className="relative z-10 flex-1 p-14 flex flex-col">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-30" />
            <img 
              src={store?.logo_url} 
              crossOrigin="anonymous" 
              className="relative w-16 h-16 rounded-xl object-cover border-4 border-white shadow-2xl"
              alt={store?.name}
            />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{store?.name}</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Professional Online Storefront</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Now Live</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        <div className="inline-block mb-3">
          <span className="text-sm font-bold text-emerald-600 uppercase tracking-[0.3em]">Introducing</span>
        </div>
        <h1 className="text-6xl font-black text-gray-900 leading-[0.9] tracking-tight">
          <span className="block">Shop Without</span>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">The DM Stress</span>
        </h1>
        <p className="text-xl text-gray-600 font-medium mt-4 max-w-2xl leading-relaxed">
          Browse our collection, see prices instantly, and shop 24/7 directly through WhatsApp
        </p>
      </div>

      {/* Featured Products Section */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Featured Products</h3>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className="text-emerald-600">★</span>
            <span>Customer Favorites</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {products.slice(0, 3).map((p: any, i: number) => (
            <div key={i} className="group">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 mb-3">
                <div className="aspect-square relative">
                  <img 
                    src={p.display_image} 
                    crossOrigin="anonymous" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={p.name || `Product ${i + 1}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    ₦{p.price?.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 font-medium">{p.name || `Product ${i + 1}`}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section - QR Code & Benefits */}
      <div className="flex-1 flex items-end pb-8">
        <div className="grid grid-cols-2 gap-10 w-full">
          {/* Benefits Column */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">✓</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">See Prices Instantly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">✓</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">Shop 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">✓</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">WhatsApp Checkout</span>
              </div>
            </div>
            
            {store?.description && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-xs leading-relaxed italic">
                  {store.description}
                </p>
              </div>
            )}
          </div>

          {/* QR Code Column */}
          <div className="flex flex-col items-end justify-end space-y-4">
            <div className="text-center">
              <div className="bg-white p-4 rounded-2xl shadow-xl inline-block border border-gray-100 mb-3">
                <img 
                  src={qrCode} 
                  crossOrigin="anonymous" 
                  className="w-36 h-36"
                  alt="QR Code"
                />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 mb-1">Scan to Shop Now</p>
                <p className="text-xs text-gray-500 font-medium">
                  storelink.ng/<span className="text-emerald-600 font-bold">{store?.slug}</span>
                </p>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Questions?</p>
              <p className="text-xs text-gray-600 font-medium">
                Message us directly on WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="relative z-10 px-14 py-6 border-t border-gray-200">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="font-medium">© {new Date().getFullYear()} {store?.name}</span>
          <span className="text-gray-300">•</span>
          <span>Professional Storefront</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-emerald-600 text-xs">#NoMoreDMForPrice</span>
        </div>
      </div>
    </div>
  </div>
);

// --- 🚀 MAIN STUDIO PAGE ---
export default function FlyerStudio() {
  const router = useRouter();
  const exportRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastGeneratedFlyer, setLastGeneratedFlyer] = useState<string | null>(null);
  const [store, setStore] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [designIndex, setDesignIndex] = useState(0);

  const FLYER_DESIGNS = [
    { name: "Urgency & Social Proof", component: UrgencySocialProofFlyer },
    { name: "Modern Retail", component: ModernRetail },
    { name: "Luxe Black", component: LuxeBlackA4 },
  ];

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: storeData } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (!storeData) {
        console.error("No store found for user");
        return;
      }

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeData.id)
        .order('created_at', { ascending: false });

      const resolveUrl = (path: any, bucket: string) => {
        if (!path) return "";
        const actualPath = Array.isArray(path) ? path[0] : path;
        if (actualPath?.startsWith('http')) return actualPath;
        if (!actualPath) return "";
        const { data } = supabase.storage.from(bucket).getPublicUrl(actualPath);
        return data.publicUrl;
      };

      const items = (productsData || []).map(p => ({
        ...p, 
        display_image: resolveUrl(p.image_urls, 'products'),
        id: String(p.id)
      }));

      setStore({ 
        ...storeData, 
        logo_url: resolveUrl(storeData.logo_url, 'stores'),
        id: String(storeData.id)
      });
      setAllProducts(items);
    } catch (e) { 
      console.error("Error fetching data:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const downloadFlyer = async () => {
    if (!exportRef.current || selectedIds.length < 3) return;
    
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1000));

    try {
      const dataUrl = await toPng(exportRef.current, { 
        cacheBust: true, 
        pixelRatio: 3, 
        backgroundColor: '#ffffff',
        quality: 1.0
      });
      const link = document.createElement('a');
      link.download = `Empire-Flyer-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setLastGeneratedFlyer(dataUrl);
      setShowSuccess(true);
    } catch (err) { 
      console.error("Error downloading flyer:", err); 
    } finally { 
      setGenerating(false); 
    }
  };

  const selectedProducts = allProducts.filter(p => selectedIds.some(id => String(id) === String(p.id)));
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&color=043927&data=https://storelink.ng/${store?.slug}`;
  
  const CurrentDesign = FLYER_DESIGNS[designIndex]?.component;

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#011a12]">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="mt-6 font-black uppercase italic tracking-widest text-emerald-500">Entering Creative Studio...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#011a12] text-white selection:bg-emerald-500/30">
      
      {/* HEADER */}
      <nav className="p-4 sm:p-6 border-b border-white/5 bg-[#011a12]/80 backdrop-blur-xl sticky top-0 z-[60] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 sm:p-3 bg-white/5 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-black uppercase italic text-lg sm:text-2xl tracking-tighter flex items-center gap-1 sm:gap-2">
              Empire Studio <Crown size={14} className="text-emerald-500"/>
            </h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Designing Flyer Masterpieces
            </p>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button 
            onClick={() => setDesignIndex((prev) => (prev + 1) % FLYER_DESIGNS.length)} 
            className="bg-white/5 border border-white/10 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] tracking-[0.1em] sm:tracking-[0.2em] uppercase hover:bg-white/10 transition-all flex items-center gap-1 sm:gap-2"
          >
            <RotateCw size={12} className="sm:size-[14px]" /> 
            <span className="hidden sm:inline">Switch</span>
            <span className="sm:hidden">Design</span>
            <span className="hidden sm:inline">({designIndex + 1}/{FLYER_DESIGNS.length})</span>
          </button>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        
        {/* SIDEBAR: PICKER (Sticky) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-4 sm:space-y-6">
          <div className="bg-white/5 border border-white/10 p-4 sm:p-8 rounded-2xl sm:rounded-[3rem] backdrop-blur-md">
            <h2 className="font-black uppercase italic text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-emerald-500">
              <Layout size={16} className="sm:size-[20px]"/> 1. Select 3 Items
            </h2>
            {allProducts.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-400">
                <Store size={24} className="sm:size-[32px] mx-auto mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base">No products found</p>
                <p className="text-xs sm:text-sm mt-1">Add products to your store first</p>
              </div>
            ) : (
              <div className="relative">
                {/* Scrollable Container */}
                <div className="overflow-y-auto pr-1 max-h-[60vh] sm:max-h-[50vh]">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {allProducts.map((p) => {
                      const isSelected = selectedIds.includes(String(p.id));
                      return (
                        <button 
                          key={p.id} 
                          onClick={() => toggleProduct(String(p.id))} 
                          className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden transition-all border-2 ${isSelected ? 'border-emerald-500 scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] sm:shadow-[0_0_25px_rgba(16,185,129,0.3)]' : 'border-white/10 opacity-30 hover:opacity-100'}`}
                          aria-label={`Select ${p.name || 'product'}`}
                        >
                          <img 
                            src={p.display_image} 
                            className="w-full h-full object-cover" 
                            alt={p.name || 'Product'} 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23222"/><text x="50" y="50" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dy=".3em">No Image</text></svg>';
                            }}
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center">
                              <Check size={16} className="sm:size-[20px] text-white" strokeWidth={4} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Selected Products Counter (always visible) */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-400">
                      Selected: <span className="font-bold text-emerald-400">{selectedIds.length}/3</span>
                    </span>
                    <span className="text-gray-500">
                      Total: <span className="font-bold">{allProducts.length}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-emerald-500 p-4 sm:p-8 rounded-2xl sm:rounded-[3rem] shadow-xl sm:shadow-2xl shadow-emerald-500/10">
            <h2 className="font-black uppercase italic text-base sm:text-lg mb-3 sm:mb-4 text-[#011a12]">2. Download Flyer</h2>
            <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-[#011a12]/80">
              <p>Current design: <span className="font-bold">{FLYER_DESIGNS[designIndex]?.name}</span></p>
            </div>
            <button 
              disabled={selectedIds.length < 3 || generating} 
              onClick={downloadFlyer} 
              className="w-full py-4 sm:py-6 bg-[#011a12] text-white rounded-xl sm:rounded-[2rem] font-black uppercase tracking-widest text-xs sm:text-sm shadow-xl sm:shadow-2xl flex items-center justify-center gap-2 sm:gap-4 hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Loader2 className="animate-spin sm:size-5" size={16} />
                  Processing...
                </>
              ) : (
                <>
                  <Download size={16} className="sm:size-[20px]" />
                  Export Flyer
                </>
              )}
            </button>
          </div>
        </div>

        {/* PREVIEW BOOTH */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="bg-[#020d09] w-full rounded-2xl sm:rounded-[4rem] border border-white/5 p-4 sm:p-8 lg:p-20 shadow-inner flex flex-col items-center justify-center">
            
            <div className="relative">
              {/* THE CANVAS SCALED DOWN FOR PREVIEW */}
              <div 
                className="shadow-[0_40px_60px_-15px_rgba(0,0,0,0.8)] sm:shadow-[0_80px_100px_-20px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden"
                style={{ 
                  width: '794px', 
                  height: '1123px', 
                  transform: 'scale(0.45)', 
                  transformOrigin: 'top center', 
                  marginBottom: '-250px' 
                }}
              >
                <div ref={exportRef}>
                  {selectedIds.length === 3 && CurrentDesign ? (
                    <CurrentDesign 
                      store={store} 
                      products={selectedProducts} 
                      qrCode={qrUrl} 
                    />
                  ) : (
                    <div className="w-[794px] h-[1123px] bg-white flex flex-col items-center justify-center text-gray-400">
                      <Store size={120} className="sm:size-[200px]" strokeWidth={0.5} />
                      <h2 className="text-3xl sm:text-6xl font-black uppercase italic text-center mt-6 sm:mt-10 text-gray-300">
                        Booth Awaiting <br/> Selection
                      </h2>
                      <p className="text-sm sm:text-lg mt-3 sm:mt-6 text-gray-500">
                        Select 3 products from the sidebar
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-16 sm:mt-20 flex gap-2 sm:gap-4 text-gray-500 font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[8px] sm:text-[10px] items-center">
              <div className="h-px w-6 sm:w-12 bg-white/10" />
              Empire Render v2.0 • Design {designIndex + 1}/{FLYER_DESIGNS.length}
              <div className="h-px w-6 sm:w-12 bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE HUD - Only visible on small screens */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-[100]">
        <div className="bg-emerald-500 p-3 rounded-2xl flex items-center justify-between shadow-xl shadow-emerald-500/40">
          <p className="text-[#011a12] font-black text-[10px] uppercase tracking-widest">
            {selectedIds.length}/3 Items Selected
          </p>
          <button 
            disabled={selectedIds.length < 3 || generating}
            onClick={downloadFlyer}
            className="bg-[#011a12] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? <Loader2 size={10} className="animate-spin" /> : <Download size={10} />} Export
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-2xl">
          <div className="bg-white rounded-2xl sm:rounded-[4rem] p-6 sm:p-12 text-center space-y-4 sm:space-y-8 max-w-md sm:max-w-lg w-full text-gray-900 shadow-[0_0_50px_rgba(16,185,129,0.3)] sm:shadow-[0_0_100px_rgba(16,185,129,0.3)]">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={30} className="sm:size-[50px]" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter">Perfect! 🏰</h2>
            <p className="text-gray-400 text-sm sm:text-base font-medium italic">Flyer saved to your device. Ready to impress.</p>
            <div className="aspect-[3/4] w-32 sm:w-48 mx-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-gray-50">
              <img src={lastGeneratedFlyer || ''} className="w-full h-full object-cover" alt="Generated Flyer" />
            </div>
            <button 
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Our storefront is LIVE! 🏰 No more DM for price. Shop here: storelink.ng/${store?.slug}`)}`, '_blank')}
              className="w-full py-4 sm:py-6 bg-emerald-600 text-white rounded-xl sm:rounded-[2rem] font-black uppercase text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 hover:bg-emerald-700 transition-colors"
            >
              <Share2 size={18} className="sm:size-[24px]" /> Share to WhatsApp
            </button>
            <button 
              onClick={() => setShowSuccess(false)} 
              className="text-gray-400 font-black uppercase text-[9px] sm:text-[10px] tracking-widest italic hover:text-emerald-600 transition-colors"
            >
              Back to Studio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}