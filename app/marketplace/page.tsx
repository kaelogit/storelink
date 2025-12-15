import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import FullMarketplaceClient from "@/components/marketplace/FullMarketplaceClient";

export const dynamic = 'force-dynamic';

export default async function MarketplacePage() {
  
  const { data: initialProducts } = await supabase
    .from("storefront_products") 
    .select("*, stores(name, slug, subscription_plan, whatsapp_number, location, logo_url, owner_id)")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: stores } = await supabase
    .from("stores")
    .select("id, name")
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
           initialProducts={initialProducts || []} 
           stores={stores || []} 
         />
       </div>

       <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
          <div className="max-w-6xl mx-auto px-4 text-center">
             <p className="font-extrabold text-gray-300 text-2xl mb-2 flex items-center justify-center gap-2">
                <LayoutDashboard className="text-gray-200"/> StoreLink
             </p>
             <p className="text-gray-400 text-sm">
                The decentralized marketplace for modern vendors.
             </p>
             <p className="text-xs text-gray-300 mt-6">© {new Date().getFullYear()} StoreLink. All rights reserved.</p>
          </div>
       </footer>

    </div>
  );
}