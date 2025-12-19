"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, productCount: 0, views: 0 });
  const [isLocked, setIsLocked] = useState(false); 

  const loadDashboardData = useCallback(async () => {
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
        router.push("/onboarding");
        return;
      }

      setStore(storeData);

      if (storeData.subscription_expiry) {
        const expiry = new Date(storeData.subscription_expiry);
        const now = new Date();
        setIsLocked(expiry < now);
      }

      const { data: productsData } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("store_id", storeData.id)
        .order("created_at", { ascending: false });
      
      setProducts(productsData || []);

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", storeData.id)
        .order("created_at", { ascending: false });

      setOrders(ordersData || []);

      const revenue = ordersData?.reduce((acc, order) => {
            return acc + (['completed', 'paid'].includes(order.status) ? order.total_amount : 0);
      }, 0) || 0;

      const count = productsData?.length || 0;
      
      // Set Stats
      setStats({ 
        revenue, 
        productCount: count, 
        views: storeData.view_count || 0 
      });

    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboardData();

    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order update!', payload);
          loadDashboardData(); 
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stores' },
        (payload) => {
          console.log('View count update!', payload);
          loadDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!store) return null;

  return (
    <DashboardClient 
      store={store} 
      initialProducts={products} 
      initialOrders={orders}
      stats={stats}
      isLocked={isLocked} 
    />
  );
}