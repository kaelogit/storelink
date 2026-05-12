"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import BuyerDashboardHome from "@/components/dashboard/BuyerDashboardHome";
import { Loader2 } from "lucide-react";
import { orderCountsTowardSellerRevenue } from "@/lib/sellerOrderPayoutFlow";
import { fetchBuyerProductOrders } from "@/lib/buyerOrders";
import { isProfileOnboardingComplete } from "@/lib/onboardingState";
import { PROFILE_STOREFRONT_SELECT, profileRowToLegacyStoreShape, type ProfileStorefrontRow } from "@/lib/profileAsStorefront";
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

  const [store, setStore] = useState<any>(null);
  const [buyerHome, setBuyerHome] = useState<BuyerHomeState | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, productCount: 0, views: 0 });

  const loadDashboardData = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const [{ data: storeData }, { data: prof }] = await Promise.all([
        supabase.from("stores").select("*").eq("owner_id", user.id).maybeSingle(),
        supabase
          .from("profiles")
          .select(
            `${PROFILE_STOREFRONT_SELECT}, onboarding_completed, onboarding_step`
          )
          .eq("id", user.id)
          .maybeSingle(),
      ]);

      if (prof?.is_seller && !isProfileOnboardingComplete(prof)) {
        router.replace("/account/start-selling");
        return;
      }

      /** Seller with completed onboarding: dashboard from profile (+ optional legacy `stores` id for RPCs). */
      if (prof?.is_seller && isProfileOnboardingComplete(prof)) {
        setBuyerHome(null);
        const synthetic = profileRowToLegacyStoreShape(prof as ProfileStorefrontRow, {
          legacyStoreId: storeData?.id ?? null,
          ownerEmail: user.email,
        });
        const storeForUi = storeData
          ? {
              ...synthetic,
              id: storeData.id,
              owner_id: user.id,
              __surface: "merged" as const,
              __legacy_store_id: storeData.id,
              seller_type: (prof as ProfileStorefrontRow).seller_type ?? undefined,
            }
          : synthetic;

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

        setStats({
          revenue,
          productCount: productRows.length,
          views: Number((prof as ProfileStorefrontRow).view_count ?? storeData?.view_count ?? 0),
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

      const rawOrders = await fetchBuyerProductOrders(supabase, user.id).catch(() => []);

      const name =
        p?.display_name?.trim() || p?.full_name?.trim() || user.email?.split("@")[0] || "there";

      setBuyerHome({
        displayName: name,
        logoUrl: p?.logo_url?.trim() || null,
        productOrders: Array.isArray(rawOrders) ? rawOrders : [],
        coinBalance: Number(p?.coin_balance ?? 0),
        hasStore: Boolean(storeData?.id),
        isSeller: Boolean(p?.is_seller),
        onboardingCompleted: onboardingDone,
      });

      setProducts([]);
      setOrders([]);
      setStats({ revenue: 0, productCount: 0, views: 0 });
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
    if (!store?.owner_id) return;

    const channel = supabase
      .channel("dashboard-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => loadDashboardData())
      .on("postgres_changes", { event: "*", schema: "public", table: "stores" }, () => loadDashboardData())
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
    return (
      <div className={`min-h-dvh space-y-6 bg-gray-50 py-4 md:py-8 ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}>
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
        />
      </div>
    );
  }

  return null;
}
