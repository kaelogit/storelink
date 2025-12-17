"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, LayoutDashboard, ShoppingBag, Bell, Settings, LogOut, 
  Menu, X, Crown, BadgeCheck, AlertTriangle 
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [expiryWarning, setExpiryWarning] = useState<{ type: 'warn' | 'expired', days: number } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: store } = await supabase
        .from("stores")
        .select("subscription_expiry")
        .eq("owner_id", user.id)
        .single();

      if (store?.subscription_expiry) {
        const expiry = new Date(store.subscription_expiry);
        const now = new Date();
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffTime < 0) {
           setExpiryWarning({ type: 'expired', days: 0 });
        } 
        else if (diffDays <= 3) {
           setExpiryWarning({ type: 'warn', days: diffDays });
        }
      }

      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Subscription", href: "/dashboard/subscription", icon: Crown },
    { name: "Verification", href: "/dashboard/verification", icon: BadgeCheck },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-30">
        <Link href="/" className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-emerald-600" size={20}/> StoreLink
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
           <Menu size={24} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
           <div className="absolute inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <span className="font-black text-xl text-gray-900">Menu</span>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><X size={24} /></button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
                      <link.icon size={18} /> {link.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-gray-100">
                <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold">
                  <LogOut size={18} /> Logout
                </button>
              </div>
           </div>
        </div>
      )}

      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-100">
           <Link href="/" className="font-extrabold text-xl text-gray-900 flex items-center gap-2 tracking-tight">
               <LayoutDashboard className="text-emerald-600" size={24}/> StoreLink
           </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
                <link.icon size={18} /> {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-full overflow-hidden flex flex-col">
        
        {expiryWarning && (
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between gap-4 border ${
             expiryWarning.type === 'expired' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
             <div className="flex items-center gap-3">
               <AlertTriangle size={20} className={expiryWarning.type === 'expired' ? 'text-red-600' : 'text-amber-600'} />
               <p className="text-sm font-bold">
                 {expiryWarning.type === 'expired' 
                   ? "Your plan has expired. Your store is currently hidden from the public." 
                   : `Your plan expires in ${expiryWarning.days} days. Renew now to avoid downtime.`}
               </p>
             </div>
             <Link href="/dashboard/subscription" className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition ${
                expiryWarning.type === 'expired' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
             }`}>
               {expiryWarning.type === 'expired' ? "Reactivate Now" : "Renew Plan"}
             </Link>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}