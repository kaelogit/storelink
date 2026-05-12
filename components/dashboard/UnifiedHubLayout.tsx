"use client";

import { useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Coins,
  User,
  LifeBuoy,
  Store,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { effectiveSellerTier } from "@/utils/marketplaceDiscovery";
import {
  fetchOnboardingContext,
  getAccountOnboardingContinuePath,
  getOnboardingHubRedirect,
  isProfileOnboardingComplete,
} from "@/lib/onboardingState";
import OnboardingProgressCard from "@/components/onboarding/OnboardingProgressCard";
import { getMissingOnboardingFields } from "@/lib/onboardingChecklist";
import { claimGuestOrdersForSession } from "@/lib/claimGuestOrders";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM, TOUCH_TARGET } from "@/lib/mobileLayout";

type HubLink = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number | null;
  color?: string;
  isNew?: boolean;
};

function linkActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/account") return pathname === "/account";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function UnifiedHubLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [effectivePlan, setEffectivePlan] = useState<"standard" | "diamond">("standard");
  const [unreadCount, setUnreadCount] = useState(0);
  const [onboardingPath, setOnboardingPath] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const [meName, setMeName] = useState("");
  const [meLogoUrl, setMeLogoUrl] = useState<string | null>(null);
  const [hasStore, setHasStore] = useState(false);
  const [isSellerFlag, setIsSellerFlag] = useState(false);

  const [sellingLinks, setSellingLinks] = useState<HubLink[]>([]);
  const [shoppingLinks, setShoppingLinks] = useState<HubLink[]>([]);
  const [growLinks, setGrowLinks] = useState<HubLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    let notifyChannel: ReturnType<typeof supabase.channel> | null = null;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const [{ data: storeRes }, notifyRes, profileRes, ctx] = await Promise.all([
        supabase.from("stores").select("id, subscription_expiry, subscription_plan, subscription_status, slug, location").eq("owner_id", user.id).maybeSingle(),
        supabase
          .from("storefront_site_notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_read", false),
        supabase
          .from("profiles")
          .select(
            "full_name, phone_number, slug, location_state, location_city, location, display_name, logo_url, is_seller, onboarding_completed, onboarding_step, buyer_interested_categories, subscription_plan, subscription_expiry, subscription_status, service_latitude, service_longitude, shop_address"
          )
          .eq("id", user.id)
          .maybeSingle(),
        fetchOnboardingContext(supabase, user.id),
      ]);

      const resume = getAccountOnboardingContinuePath(ctx, ctx.profile);
      if (resume.startsWith("/onboarding")) {
        router.replace(resume);
        return;
      }

      const profile = profileRes.data as Record<string, unknown> | null;
      const onboardingDone = isProfileOnboardingComplete(ctx.profile);
      const pPhone = String(profile?.phone_number ?? "");

      await claimGuestOrdersForSession(supabase, {
        userId: user.id,
        email: user.email ?? null,
        phoneDigits: pPhone || null,
      });

      if (cancelled) return;

      const store = storeRes;
      const seller = !!profile?.is_seller;

      /** Seller hub: legacy `stores` row OR completed seller profile (profile-as-storefront). */
      const hasLegacyStore = !!store?.id;
      const hasSellerHub = hasLegacyStore || (seller && onboardingDone);

      setHasStore(hasSellerHub);
      setIsSellerFlag(seller);
      setMeName(
        String(profile?.display_name || profile?.full_name || user.email?.split("@")[0] || "Account").trim()
      );
      setMeLogoUrl(profile?.logo_url ? String(profile.logo_url).trim() || null : null);

      const postLoginPath = getOnboardingHubRedirect(ctx);
      setOnboardingPath(postLoginPath.startsWith("/onboarding") ? postLoginPath : null);
      setMissingFields(
        getMissingOnboardingFields(profile as any, Boolean(profile?.is_seller), store as any)
      );

      const unread = notifyRes.error ? 0 : notifyRes.count || 0;
      setUnreadCount(unread);

      if (profile?.subscription_plan != null) {
        setEffectivePlan(
          effectiveSellerTier(
            String(profile.subscription_plan),
            profile.subscription_expiry as string | null | undefined,
            profile.subscription_status as string | null | undefined
          )
        );
      } else if (store?.subscription_plan != null) {
        setEffectivePlan(
          effectiveSellerTier(store.subscription_plan, store.subscription_expiry, store.subscription_status)
        );
      }

      const sell: HubLink[] = hasSellerHub
        ? [
            { name: "Store orders", href: "/dashboard/orders", icon: ShoppingBag },
            { name: "Store Coin loyalty", href: "/dashboard/loyalty", icon: Coins, isNew: true, color: "text-amber-500" },
            { name: "Visibility & plans", href: "/dashboard/subscription", icon: Crown },
            { name: "Settings", href: "/account/settings", icon: Settings },
          ]
        : [];

      const shop: HubLink[] = [
        {
          name: "Announcements",
          href: "/dashboard/notifications",
          icon: Bell,
          badge: unread > 0 ? unread : null,
        },
        { name: "My orders", href: "/account/orders", icon: ShoppingCart },
        { name: "Wallet", href: "/account/wallet", icon: Coins },
        { name: "Delivery addresses", href: "/dashboard/addresses", icon: MapPin },
        { name: "Personal information", href: "/account/settings", icon: User },
        { name: "Help & support", href: "/account/support", icon: LifeBuoy },
      ];

      const grow: HubLink[] = [];
      if (!hasSellerHub && !seller) {
        grow.push({ name: "Start selling", href: "/account/start-selling", icon: Store });
      } else if (!hasSellerHub && seller && !onboardingDone) {
        grow.push({ name: "Continue storefront setup", href: "/account/start-selling", icon: Store });
      }

      setSellingLinks(sell);
      setShoppingLinks(shop);
      setGrowLinks(grow);

      notifyChannel = supabase
        .channel(`storefront-site-notifications-${user.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "storefront_site_notifications", filter: `user_id=eq.${user.id}` },
          () => setUnreadCount((prev) => prev + 1)
        )
        .subscribe();

      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
      if (notifyChannel) supabase.removeChannel(notifyChannel);
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.assign("/login");
  };

  const planHint =
    effectivePlan === "diamond"
      ? "Diamond visibility boost active"
      : hasStore
        ? "Standard — free storefront"
        : "Shopping profile";

  const overviewHref = "/dashboard";

  const renderLink = (link: HubLink, onNavigate?: () => void) => {
    const active = linkActive(pathname, link.href);
    const Icon = link.icon;
    return (
      <Link
        key={link.name + link.href}
        href={link.href}
        onClick={onNavigate}
        className={`flex min-h-[44px] items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-sm ${
          active ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div className="relative">
          <Icon size={18} className={link.color ? link.color : ""} />
          {link.badge ? (
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white" />
            </span>
          ) : null}
        </div>
        <span>{link.name}</span>
        {link.badge ? (
          <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">{link.badge}</span>
        ) : null}
        {link.isNew && !active && !link.badge ? (
          <span className="ml-auto bg-amber-100 text-amber-600 text-[8px] font-black px-1.5 py-0.5 rounded-md animate-pulse">NEW</span>
        ) : null}
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  const closeMobile = () => setIsMobileMenuOpen(false);

  const navInner = (
    <>
      <div className="p-6 border-b border-gray-100 shrink-0">
        <Link href="/" className="font-extrabold text-xl text-gray-900 flex items-center gap-2 tracking-tight">
          <LayoutDashboard className="text-emerald-600" size={24} /> StoreLink
        </Link>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-4">Your hub</p>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 flex items-center justify-center">
            {meLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={meLogoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-black text-gray-400 uppercase">{meName.slice(0, 1)}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{meName}</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {hasStore && (
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Seller
                </span>
              )}
              {!hasStore && isSellerFlag && (
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                  Becoming a seller
                </span>
              )}
              {!isSellerFlag && !hasStore && (
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  Shopper
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400">ACCOUNT</p>
        <Link
          href={overviewHref}
          onClick={closeMobile}
          className={`flex min-h-[44px] items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            pathname === "/dashboard" ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <LayoutDashboard size={18} className="text-emerald-600" />
          Home
        </Link>

        {sellingLinks.length > 0 && (
          <>
            <p className="px-4 pt-6 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400">SELLER TOOLS</p>
            {sellingLinks.map((l) => renderLink(l, closeMobile))}
          </>
        )}

        <p className="px-4 pt-6 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400">SHOPPING</p>
        {shoppingLinks.map((l) => renderLink(l, closeMobile))}

        {growLinks.length > 0 && (
          <>
            <p className="px-4 pt-6 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400">GROW</p>
            {growLinks.map((l) => renderLink(l, closeMobile))}
          </>
        )}
      </nav>

      {hasStore && (
        <div className="mx-4 mb-2 p-3 rounded-xl border bg-emerald-50/50 border-emerald-100 shrink-0">
          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-relaxed">{planHint}</p>
          <p className="text-[9px] text-emerald-800/75 mt-1 leading-snug">Standard is free forever. Upgrade for marketplace visibility boosts.</p>
        </div>
      )}

      <div className="p-4 border-t border-gray-100 shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold"
        >
          <LogOut size={18} /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-dvh bg-gray-50">
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white pt-[max(0.5rem,env(safe-area-inset-top,0px))] ${STOREFRONT_GUTTER_X} pb-3`}
      >
        <Link href="/" className="font-extrabold text-lg text-gray-900 flex min-h-[44px] items-center gap-2 pr-2">
          <LayoutDashboard className="text-emerald-600 shrink-0" size={20} /> StoreLink
        </Link>
        <div className="flex items-center gap-1 shrink-0">
          {unreadCount > 0 && (
            <Link
              href="/dashboard/notifications"
              className={`${TOUCH_TARGET} rounded-xl bg-red-50 text-red-600 relative`}
              aria-label="Announcements"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full border border-white bg-red-500" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className={`${TOUCH_TARGET} rounded-xl text-gray-700 hover:bg-gray-100`}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={closeMobile} />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,calc(100vw-2rem))] max-w-[85vw] flex-col overflow-y-auto border-r border-gray-200 bg-white pt-[env(safe-area-inset-top,0px)] shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex justify-end border-b border-gray-100 p-3 pr-[max(0.75rem,env(safe-area-inset-right,0px))]">
              <button
                type="button"
                onClick={closeMobile}
                className={`${TOUCH_TARGET} rounded-xl text-gray-500 hover:bg-gray-100`}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            {navInner}
          </div>
        </div>
      )}

      <aside className="no-scrollbar fixed top-0 z-20 hidden h-dvh w-72 flex-col overflow-hidden border-r border-gray-200 bg-white md:flex">
        {navInner}
      </aside>

      <main
        className={`flex min-h-dvh flex-1 flex-col gap-4 overflow-x-hidden pt-[calc(3.75rem+env(safe-area-inset-top,0px))] md:ml-72 md:pt-8 ${STOREFRONT_GUTTER_X} py-4 md:py-8 ${STOREFRONT_SAFE_BOTTOM}`}
      >
        <OnboardingProgressCard continueHref={onboardingPath} missingFields={missingFields} />
        {children}
      </main>
    </div>
  );
}
