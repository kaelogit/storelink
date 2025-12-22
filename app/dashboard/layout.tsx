"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, LayoutDashboard, ShoppingBag, Bell, Settings, LogOut, 
  Menu, X, Crown, BadgeCheck, AlertTriangle, CheckCircle, XCircle,
  Coins 
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // -- State Management --
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expiryWarning, setExpiryWarning] = useState<{ type: 'warn' | 'expired', days: number } | null>(null);
  const [planName, setPlanName] = useState(""); 
  const [unreadCount, setUnreadCount] = useState(0); // 🔴 New: Track unread admin messages

  useEffect(() => {
    const checkAuthAndData = async () => {
      // 1. Auth Check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      // 2. Parallel Fetch: Store Data & Unread Notifications
      const [storeRes, notifyRes] = await Promise.all([
        supabase.from("stores").select("subscription_expiry, subscription_plan").eq("owner_id", user.id).single(),
        supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false)
      ]);

      // 3. Process Store/Subscription Logic
      if (storeRes.data) {
        const store = storeRes.data;
        setPlanName(store.subscription_plan); 

        if (store.subscription_expiry) {
          const expiry = new Date(store.subscription_expiry);
          const now = new Date();
          const diffTime = expiry.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffTime < 0) {
            setExpiryWarning({ type: 'expired', days: 0 });
          } else if (diffDays <= 7) {
            setExpiryWarning({ type: 'warn', days: diffDays });
          }
        }
      }

      // 4. Process Notification Logic
      setUnreadCount(notifyRes.count || 0);

      // 5. 📡 REAL-TIME SUBSCRIPTION (Cyber-Security Ready)
      // Listen for new notifications sent by Admin in real-time
      const channel = supabase
        .channel(`user-notifications-${user.id}`)
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications', 
            filter: `user_id=eq.${user.id}` 
          },
          () => {
            setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();

      setLoading(false);
      return () => { supabase.removeChannel(channel); };
    };

    checkAuthAndData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/logout");
  };

  // Nav Links Definition
  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { 
      name: "Notifications", 
      href: "/dashboard/notifications", 
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null // 🔴 Dynamic Badge
    },
    { 
      name: "Empire Loyalty", 
      href: "/dashboard/loyalty", 
      icon: Coins, 
      isNew: true, 
      color: "text-amber-500" 
    },
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
      
      {/* --- MOBILE TOP BAR --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-30">
        <Link href="/" className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="text-emerald-600" size={20}/> StoreLink
        </Link>
        <div className="flex items-center gap-2">
           {/* Mobile Notification Shortcut */}
           {unreadCount > 0 && (
             <Link href="/dashboard/notifications" className="p-2 bg-red-50 rounded-lg text-red-600 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
             </Link>
           )}
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Menu size={24} />
           </button>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-black text-xl text-gray-900">Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><X size={24} /></button>
               </div>
               <nav className="flex-1 p-4 space-y-2">
                 {links.map((link) => {
                   const isActive = pathname === link.href;
                   const Icon = link.icon;
                   return (
                     <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
                       <div className="relative">
                          <Icon size={18} className={link.color ? link.color : ""} /> 
                          {link.badge && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                       </div>
                       <span>{link.name}</span>
                       {link.badge && <span className="ml-auto bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full">{link.badge}</span>}
                     </Link>
                   );
                 })}
               </nav>
               <div className="p-4 border-t border-gray-100">
                 <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold">
                   <LogOut size={18} /> Logout
                 </button>
               </div>
            </div>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-screen top-0 overflow-y-auto z-20 no-scrollbar">
        <div className="p-6 border-b border-gray-100 shrink-0">
           <Link href="/" className="font-extrabold text-xl text-gray-900 flex items-center gap-2 tracking-tight">
               <LayoutDashboard className="text-emerald-600" size={24}/> StoreLink
           </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
                <div className="relative">
                   <Icon size={18} className={link.color ? link.color : ""} /> 
                   {link.badge && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                      </span>
                   )}
                </div>
                <span>{link.name}</span>
                {link.badge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                    {link.badge}
                  </span>
                )}
                {link.isNew && !isActive && !link.badge && (
                  <span className="ml-auto bg-amber-100 text-amber-600 text-[8px] font-black px-1.5 py-0.5 rounded-md animate-pulse">NEW</span>
                )}
              </Link>
            );
          })}
        </nav>

        {!expiryWarning && planName && (
          <div className="mx-4 mb-2 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{planName} Plan Active</span>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-full overflow-hidden flex flex-col">
        {/* Subscription Alerts */}
        {expiryWarning && (
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between gap-4 border animate-in slide-in-from-top duration-300 ${
              expiryWarning.type === 'expired' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
              <div className="flex items-center gap-3">
                {expiryWarning.type === 'expired' ? <XCircle className="text-red-600" size={20} /> : <AlertTriangle className="text-amber-600" size={20} />}
                <p className="text-sm font-bold">
                  {expiryWarning.type === 'expired' 
                    ? "Your plan has expired. Your store is currently hidden from the public." 
                    : `Your ${planName} plan expires in ${expiryWarning.days} days. Renew now to avoid downtime.`}
                </p>
              </div>
              <Link href="/dashboard/subscription" className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition shadow-sm whitespace-nowrap ${
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