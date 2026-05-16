"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import BuyerDashboardHome from "@/components/dashboard/BuyerDashboardHome";
import { Loader2, CheckCircle2, X } from "lucide-react";
import { orderCountsTowardSellerRevenue } from "@/lib/sellerOrderPayoutFlow";
import { fetchBuyerProductOrders } from "@/lib/buyerOrders";
import {
  fetchOnboardingContext,
  getDashboardOnboardingGatePath,
  isProfileOnboardingComplete,
} from "@/lib/onboardingState";
import { getClientUserSafe } from "@/lib/getClientUserSafe";
import { PROFILE_STOREFRONT_SELECT, profileRowToLegacyStoreShape, type ProfileStorefrontRow } from "@/lib/profileAsStorefront";
import { computeWeeklyRevenueSnapshot } from "@/lib/dashboardRevenueWindow";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

type BuyerHomeState = {
  displayName: string;
  logoUrl: string | null;
  productOrders: any[];
  coinBalance: number;
  hasStore: boolean;
  isSeller: boolean;
  onboardingCompleted: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [storefrontSavedKind, setStorefrontSavedKind] = useState<"appearance" | "hero" | null>(null);
  const [storefrontSavedDismissed, setStorefrontSavedDismissed] = useState(false);

  const [store, setStore] = useState<any>(null);
  const [buyerHome, setBuyerHome] = useState<BuyerHomeState | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, productCount: 0, views: 0, weekThis: 0, weekLast: 0 });

  const loadDashboardData = useCallback(async () => {
    try {
      const user = await getClientUserSafe(supabase);

      if (!user) {
        router.push("/login");
        return;
      }

      const onboardingCtx = await fetchOnboardingContext(supabase, user.id);
      const onboardingGate = getDashboardOnboardingGatePath(onboardingCtx);
      if (onboardingGate) {
        router.replace(onboardingGate);
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select(`${PROFILE_STOREFRONT_SELECT}, onboarding_completed, onboarding_step`)
        .eq("id", user.id)
        .maybeSingle();

      if (prof?.is_seller && !isProfileOnboardingComplete(prof)) {
        router.replace("/account/start-selling");
        return;
      }

      if (prof?.is_seller && isProfileOnboardingComplete(prof)) {
        setBuyerHome(null);
        const storeForUi = profileRowToLegacyStoreShape(prof as ProfileStorefrontRow, {
          ownerEmail: user.email,
        });

        setStore(storeForUi);

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*, categories(name)")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        let productRows = productsData || [];
        if (productsError) {
          console.warn("Dashboard products query:", productsError.message);
          const { data: fallback } = await supabase
            .from("products")
            .select("*")
            .eq("seller_id", user.id)
            .order("created_at", { ascending: false });
          productRows = fallback || [];
        }

        setProducts(productRows);

        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        setOrders(ordersData || []);

        const revenue =
          ordersData?.reduce((acc, order) => {
            return acc + (orderCountsTowardSellerRevenue(order.status) ? Number(order.total_amount) || 0 : 0);
          }, 0) || 0;

        const weekly = computeWeeklyRevenueSnapshot(ordersData || [], orderCountsTowardSellerRevenue);

        setStats({
          revenue,
          productCount: productRows.length,
          views: Number((prof as ProfileStorefrontRow).view_count ?? 0),
          weekThis: weekly.thisWeek,
          weekLast: weekly.lastWeek,
        });
        return;
      }

      /** Pure buyer / shopper hub (not an onboarded seller). */
      setStore(null);

      const p = prof as {
        display_name?: string | null;
        full_name?: string | null;
        logo_url?: string | null;
        coin_balance?: number | null;
        is_seller?: boolean | null;
      } | null;
      const onboardingDone = isProfileOnboardingComplete(prof);

      const rawOrders = await fetchBuyerProductOrders(supabase, user.id, user.email || null).catch(() => []);

      const name =
        p?.display_name?.trim() || p?.full_name?.trim() || user.email?.split("@")[0] || "there";

      setBuyerHome({
        displayName: name,
        logoUrl: p?.logo_url?.trim() || null,
        productOrders: Array.isArray(rawOrders) ? rawOrders : [],
        coinBalance: Number(p?.coin_balance ?? 0),
        hasStore: Boolean(p?.is_seller && onboardingDone),
        isSeller: Boolean(p?.is_seller),
        onboardingCompleted: onboardingDone,
      });

      setProducts([]);
      setOrders([]);
      setStats({ revenue: 0, productCount: 0, views: 0, weekThis: 0, weekLast: 0 });
      return;
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = new URLSearchParams(window.location.search).get("storefront_saved");
    if (raw === "appearance" || raw === "hero") {
      setStorefrontSavedKind(raw);
      setStorefrontSavedDismissed(false);
      router.replace("/dashboard", { scroll: false });
    }
  }, [router]);

  useEffect(() => {
    if (!store?.owner_id) return;

    const channel = supabase
      .channel("dashboard-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => loadDashboardData())
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${store.owner_id}` },
        () => loadDashboardData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [store?.owner_id, loadDashboardData]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (store) {
    const showStorefrontSaved = Boolean(storefrontSavedKind && !storefrontSavedDismissed);
    return (
      <div className={`min-h-dvh space-y-6 bg-gray-50 py-4 md:py-8 ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}>
        {showStorefrontSaved ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-emerald-950">
                {storefrontSavedKind === "hero" ? "Hero saved" : "Storefront appearance saved"}
              </p>
              <p className="mt-1 text-xs font-medium leading-relaxed text-emerald-900/90">
                {storefrontSavedKind === "hero"
                  ? "Your headline and tagline are updated on your live shop."
                  : "Colors, layout, fonts, and catalog rules are updated on your public shop."}
              </p>
              <Link
                href="/dashboard/storefront"
                className="mt-2 inline-block text-xs font-black uppercase tracking-widest text-emerald-800 underline-offset-2 hover:underline"
              >
                Edit storefront again
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setStorefrontSavedDismissed(true)}
              className="shrink-0 rounded-lg p-1 text-emerald-800 hover:bg-emerald-100"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : null}
        <DashboardClient store={store} initialProducts={products} initialOrders={orders} stats={stats} />
      </div>
    );
  }

  if (buyerHome) {
    return (
      <div className={`min-h-dvh space-y-6 bg-gray-50 py-4 md:py-8 ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}>
        <BuyerDashboardHome
          displayName={buyerHome.displayName}
          logoUrl={buyerHome.logoUrl}
          productOrders={buyerHome.productOrders}
          coinBalance={buyerHome.coinBalance}
          hasStore={buyerHome.hasStore}
          isSeller={buyerHome.isSeller}
          onboardingCompleted={buyerHome.onboardingCompleted}
          setupContinueHref={buyerHome.onboardingCompleted ? null : "/onboarding"}
        />
      </div>
    );
  }

  return null;
}
