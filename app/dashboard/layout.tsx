"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, LayoutDashboard, ShoppingBag, Bell, Settings, LogOut, 
  Menu, X, Crown, BadgeCheck, AlertTriangle, CheckCircle, XCircle,
  Coins, Clock, ShieldCheck 
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expiryWarning, setExpiryWarning] = useState<{ type: 'warn' | 'expired', days: number } | null>(null);
  const [planName, setPlanName] = useState(""); 
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState(0); 

  useEffect(() => {
    const checkAuthAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const [storeRes, notifyRes] = await Promise.all([
        supabase.from("stores").select("subscription_expiry, subscription_plan").eq("owner_id", user.id).single(),
        supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false)
      ]);

      if (storeRes.data) {
        const store = storeRes.data;
        setPlanName(store.subscription_plan); 

        if (store.subscription_expiry) {
          const expiry = new Date(store.subscription_expiry);
          const now = new Date();
          const diffTime = expiry.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          setDaysRemaining(diffDays > 0 ? diffDays : 0);

          if (diffTime < 0) {
            setExpiryWarning({ type: 'expired', days: 0 });
          } else if (diffDays <= 7) {
            setExpiryWarning({ type: 'warn', days: diffDays });
          }
        }
      }

      setUnreadCount(notifyRes.count || 0);

      const channel = supabase
        .channel(`user-notifications-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          () => { setUnreadCount(prev => prev + 1); }
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

  const isTrial = planName === 'premium' && daysRemaining !== null && daysRemaining <= 14;

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { name: "Empire Loyalty", href: "/dashboard/loyalty", icon: Coins, isNew: true, color: "text-amber-500" },
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
        <div className="flex items-center gap-2">
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

               {planName && (
                 <div className="mx-4 mb-4 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{planName} Active</span>
                      <ShieldCheck size={12} className="text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-700">{daysRemaining} days left</p>
                    {isTrial && <p className="text-[8px] text-emerald-600 italic font-medium mt-1">* Founder's Gift Active</p>}
                 </div>
               )}

               <div className="p-4 border-t border-gray-100">
                 <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold">
                   <LogOut size={18} /> Logout
                 </button>
               </div>
            </div>
        </div>
      )}

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

        {planName && (
          <div className={`mx-4 mb-2 p-3 rounded-xl border transition-all ${expiryWarning?.type === 'expired' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${expiryWarning?.type === 'expired' ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${expiryWarning?.type === 'expired' ? 'text-red-500' : 'text-gray-400'}`}>
                {planName} Plan Active
              </span>
            </div>
            
            <div className="space-y-0.5">
               <p className={`text-[11px] font-bold flex items-center gap-1.5 ${expiryWarning?.type === 'expired' ? 'text-red-600' : 'text-gray-700'}`}>
                  <Clock size={12} className="text-gray-400" />
                  {expiryWarning?.type === 'expired' ? "Empire Locked" : `${daysRemaining} days remaining`}
               </p>
               {isTrial && !expiryWarning && (
                 <p className="text-[9px] text-emerald-600 font-bold italic leading-tight">
                   * Founder's Welcome Gift Applied
                 </p>
               )}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-full overflow-hidden flex flex-col">
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