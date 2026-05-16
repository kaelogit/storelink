"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import {
  Package,
  ExternalLink,
  Eye,
  TrendingUp,
  Tags,
  Edit,
  Trash2,
  Zap,
  Search,
  Plus,
  ShoppingBag,
  AlertTriangle,
  Landmark,
  Crown,
  Settings,
  LayoutTemplate,
  Pin,
  Sparkles,
  Award,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddProductModal from "@/components/store/AddProductModal";
import CategoryManager from "@/components/store/CategoryManager";
import FlashDropModal from "@/components/dashboard/FlashDropModal";
import ShareStore from "./ShareStore";
import { sellerStorefrontTenantUrl } from "@/lib/storefrontPublicUrl";
import { storefrontOrderPayoutFailed, storefrontOrderPayoutQueued } from "@/lib/sellerOrderPayoutFlow";
import { isProductFlashDropActive } from "@/lib/productFlashDrop";
import { isStorefrontMerchFlagOn } from "@/lib/storefrontMerchFlags";
import { cn } from "@/lib/utils";

interface DashboardClientProps {
  store: any;
  initialProducts: any[];
  initialOrders: any[];
  stats: { revenue: number; productCount: number; views: number; weekThis: number; weekLast: number };
}

export default function DashboardClient({ store, initialProducts, initialOrders, stats }: DashboardClientProps) {
  const router = useRouter();
  
  const dashboardAccent = useMemo(() => {
    const raw = String(store?.storefront_theme?.accent || "").trim();
    return /^#([0-9a-f]{6})$/i.test(raw) ? raw : "#059669";
  }, [store?.storefront_theme?.accent]);

  const accentVars = useMemo(() => {
    const r = parseInt(dashboardAccent.slice(1, 3), 16);
    const g = parseInt(dashboardAccent.slice(3, 5), 16);
    const b = parseInt(dashboardAccent.slice(5, 7), 16);
    return {
      ["--dash-accent" as string]: dashboardAccent,
      ["--dash-accent-soft" as string]: `rgba(${r}, ${g}, ${b}, 0.12)`,
      ["--dash-accent-soft-strong" as string]: `rgba(${r}, ${g}, ${b}, 0.22)`,
    };
  }, [dashboardAccent]);

  const [productRows, setProductRows] = useState<any[]>(initialProducts);
  const [liveCategories, setLiveCategories] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [selectedFlashProduct, setSelectedFlashProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addProductGate, setAddProductGate] = useState<{
    title: string;
    description: string;
    href: string;
    cta: string;
  } | null>(null);
  const [checkingAddGate, setCheckingAddGate] = useState(false);

  // Sync initial server products cleanly to state
  useEffect(() => {
    setProductRows(initialProducts);
  }, [initialProducts]);
  
  /** Fetcher to keep products in sync along with their category relational details */
  const refreshProductRows = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("seller_id", store.owner_id)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.warn("refreshProductRows:", error.message);
      return;
    }
    setProductRows(data || []);
  }, [store.owner_id]);
  
  /** Fetch fresh categories */
  const fetchCategories = useCallback(async () => {
    const uid = store.owner_id;

    const primary = await supabase
      .from("categories")
      .select("*")
      .eq("seller_id", uid)
      .eq("category_scope", "seller")
      .order("name");

    if (!primary.error && primary.data?.length) {
      setLiveCategories(primary.data);
      return;
    }

    const { data: prodRows } = await supabase.from("products").select("category_id").eq("seller_id", uid);
    const ids = [...new Set((prodRows || []).map((r: { category_id?: string }) => r.category_id).filter(Boolean))] as string[];
    
    if (!ids.length) {
      setLiveCategories([]);
      return;
    }
    const { data: cats } = await supabase.from("categories").select("*").in("id", ids).order("name");
    if (cats) setLiveCategories(cats);
  }, [store.owner_id]);

  // Initial fetch on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Real-time Engine Listener
  useEffect(() => {
    const dashboardSync = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products', filter: `seller_id=eq.${store.owner_id}` },
        () => {
          void refreshProductRows();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories', filter: `seller_id=eq.${store.owner_id}` },
        () => {
          void fetchCategories();
          void refreshProductRows(); // Re-fetch to apply updated category names on current listings
          router.refresh(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dashboardSync);
    };
  }, [store.owner_id, refreshProductRows, fetchCategories, router]);

  // Derived filter state matching safe values
  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    if (!lowerSearch) return productRows;

    return productRows.filter((p) => {
      const productName = p.name?.toLowerCase() || "";
      const categoryName = p.categories?.name?.toLowerCase() || "general";
      return productName.includes(lowerSearch) || categoryName.includes(lowerSearch);
    });
  }, [searchTerm, productRows]);

  const toggleProductPin = async (p: any) => {
    const nextPinned = p.pinned_at ? null : new Date().toISOString();
    const { error } = await supabase
      .from("products")
      .update({ pinned_at: nextPinned, updated_at: new Date().toISOString() })
      .eq("id", p.id)
      .eq("seller_id", store.owner_id);
    
    if (error) {
      alert(error.message || "Could not update pin.");
      return;
    }
    
    // Instead of dropping data, perform an object spread modification preservation
    setProductRows((prev) =>
      prev.map((row) => (row.id === p.id ? { ...row, pinned_at: nextPinned } : row)),
    );
  };

  const toggleProductStorefrontFlag = async (
    p: any,
    field: "storefront_new_arrival" | "storefront_best_seller",
  ) => {
    const current = isStorefrontMerchFlagOn(p[field]);
    const next = !current;
    const patch: Record<string, unknown> = {
      [field]: next,
      updated_at: new Date().toISOString(),
    };
    if (next && field === "storefront_new_arrival") patch.storefront_best_seller = false;
    if (next && field === "storefront_best_seller") patch.storefront_new_arrival = false;

    const { error } = await supabase.from("products").update(patch).eq("id", p.id).eq("seller_id", store.owner_id);
    if (error) {
      alert(error.message || "Could not update storefront label.");
      return;
    }
    setProductRows((prev) => prev.map((row) => (row.id === p.id ? { ...row, ...patch } : row)));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Could not delete product.");
    } else {
      setProductRows((prev) => prev.filter((row) => row.id !== id));
      router.refresh();
    }
  };

  const openEditModal = (product: any) => {
    setProductToEdit(product);
    setIsAddModalOpen(true);
  };

  const handleAddProductClick = async () => {
    setCheckingAddGate(true);
    setAddProductGate(null);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("verification_status, payout_setup_completed, bank_details")
        .eq("id", store.owner_id)
        .maybeSingle();

      const p = (profile || {}) as {
        verification_status?: string | null;
        payout_setup_completed?: boolean | null;
        bank_details?: { recipient_code?: string | null; account_number?: string | null } | null;
      };
      const verificationStatus = String(p.verification_status || "").toLowerCase();
      const verified = verificationStatus === "verified" || verificationStatus === "approved";
      const hasRecipient = Boolean(p.bank_details?.recipient_code || p.bank_details?.account_number);
      const payoutReady = Boolean(p.payout_setup_completed === true || hasRecipient);

      if (!verified) {
        setAddProductGate({
          title: "Verify seller identity first",
          description: "Upload ID + selfie, then submit for review before listing products.",
          href: "/dashboard/verification",
          cta: "Go to verification",
        });
        return;
      }

      if (!payoutReady) {
        setAddProductGate({
          title: "Set payout bank first",
          description: "Add your payout bank account before listing products for checkout.",
          href: "/dashboard/payout",
          cta: "Go to payout setup",
        });
        return;
      }

      setIsAddModalOpen(true);
    } catch {
      setAddProductGate({
        title: "Could not validate account setup",
        description: "Please open verification and payout setup manually, then try again.",
        href: "/dashboard/verification",
        cta: "Open verification",
      });
    } finally {
      setCheckingAddGate(false);
    }
  };

  const isRecentlySoldOut = (product: any) => {
    if (!product.sold_out_at || product.stock_quantity > 0) return false;
    const soldOutDate = new Date(product.sold_out_at);
    const hoursDiff = (new Date().getTime() - soldOutDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  const storefrontPayoutFailed = useMemo(
    () => initialOrders.filter((o) => storefrontOrderPayoutFailed(o)).length,
    [initialOrders],
  );
  const storefrontPayoutQueued = useMemo(
    () => initialOrders.filter((o) => storefrontOrderPayoutQueued(o)).length,
    [initialOrders],
  );

  const weekDeltaLabel = useMemo(() => {
    const cur = stats.weekThis;
    const prev = stats.weekLast;
    if (prev <= 0 && cur <= 0) return null;
    if (prev <= 0) return "First qualifying week on record";
    const pct = Math.round(((cur - prev) / prev) * 100);
    if (pct === 0) return "Flat vs last week";
    return `${pct > 0 ? "Up" : "Down"} ${Math.abs(pct)}% vs last week`;
  }, [stats.weekThis, stats.weekLast]);

  return (
    <div className="space-y-6 px-1 md:px-0 pb-20" style={accentVars}>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2 tracking-tight uppercase italic">
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">Welcome Back, <span className="font-bold text-gray-900">{store.name}</span></p>
          </div>

          <div className="flex gap-2 w-full md:w-auto flex-wrap">
            <a
              href={sellerStorefrontTenantUrl(store.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg"
            >
              <ExternalLink size={16} /> View Store
            </a>
            <Link
              href="/marketplace"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm"
            >
              Browse marketplace
            </Link>
          </div>
        </header>

        {storefrontPayoutFailed > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <AlertTriangle className="text-red-600 shrink-0" size={22} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-red-700">Payout attention</p>
              <p className="text-sm font-semibold text-red-900 mt-1">
                {storefrontPayoutFailed} storefront order{storefrontPayoutFailed === 1 ? "" : "s"} had a Paystack transfer failure.
                Check payout bank details under membership, then contact support if it persists.
              </p>
            </div>
            <Link
              href="/dashboard/orders"
              className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-red-700 text-white text-xs font-bold hover:bg-red-800 transition"
            >
              View orders
            </Link>
          </div>
        )}

        {storefrontPayoutFailed === 0 && storefrontPayoutQueued > 0 && (
          <div className="rounded-2xl border border-[var(--dash-accent-soft-strong)] bg-[var(--dash-accent-soft)] p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <ShoppingBag className="text-[var(--dash-accent)] shrink-0" size={22} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-[var(--dash-accent)]">Payout queue</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {storefrontPayoutQueued} completed order{storefrontPayoutQueued === 1 ? "" : "s"} in line for automatic Paystack payout.
              </p>
            </div>
            <Link
              href="/dashboard/orders"
              className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-[var(--dash-accent-soft-strong)] bg-white text-[var(--dash-accent)] text-xs font-bold hover:bg-[var(--dash-accent-soft)] transition"
            >
              Order detail
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <div className="col-span-2 flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:col-span-1 md:rounded-3xl md:p-6">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-[var(--dash-accent-soft)] text-[var(--dash-accent)] rounded-xl"><TrendingUp size={20}/></div>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue (all time)</span>
             </div>
             <p className="text-2xl font-black text-gray-900">₦{stats.revenue.toLocaleString()}</p>
             <p className="mt-2 text-[11px] font-semibold text-gray-500 leading-snug">
               This week: <span className="text-gray-900">₦{stats.weekThis.toLocaleString()}</span>
               {" · "}
               Last week: <span className="text-gray-900">₦{stats.weekLast.toLocaleString()}</span>
             </p>
             {weekDeltaLabel && <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--dash-accent)]">{weekDeltaLabel}</p>}
          </div>

          <div className="flex min-h-[120px] flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:min-h-0 md:rounded-3xl md:p-6">
             <div className="flex items-center gap-2 md:mb-2 md:gap-3">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Package size={20}/></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider md:text-xs">Products</span>
             </div>
             <p className="text-2xl font-black leading-none text-gray-900">{stats.productCount}</p>
          </div>

          <div className="flex min-h-[120px] flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:min-h-0 md:rounded-3xl md:p-6">
             <div className="flex items-center gap-2 md:mb-2 md:gap-3">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Eye size={20}/></div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider md:text-xs">Discovery</span>
             </div>
             <p className="text-2xl font-black leading-none text-gray-900">{stats.views.toLocaleString()}</p>
          </div>
        </div>

        <ShareStore slug={store.slug} accent={dashboardAccent} />

        <div className="hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-5">
          <Link
            href="/dashboard/orders"
            className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:border-[var(--dash-accent-soft-strong)] hover:bg-[var(--dash-accent-soft)]"
          >
            <ShoppingBag className="text-[var(--dash-accent)] shrink-0" size={18} />
            Orders
          </Link>
          <Link
            href="/dashboard/payout"
            className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:border-[var(--dash-accent-soft-strong)] hover:bg-[var(--dash-accent-soft)]"
          >
            <Landmark className="text-[var(--dash-accent)] shrink-0" size={18} />
            Payout
          </Link>
          <Link
            href="/dashboard/subscription"
            className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:border-[var(--dash-accent-soft-strong)] hover:bg-[var(--dash-accent-soft)]"
          >
            <Crown className="text-amber-600 shrink-0" size={18} />
            Plans
          </Link>
          <Link
            href="/dashboard/storefront"
            className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:border-[var(--dash-accent-soft-strong)] hover:bg-[var(--dash-accent-soft)]"
          >
            <LayoutTemplate className="text-sky-600 shrink-0" size={18} />
            Customize shop
          </Link>
          <Link
            href="/account/settings"
            className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:border-[var(--dash-accent-soft-strong)] hover:bg-[var(--dash-accent-soft)]"
          >
            <Settings className="text-gray-600 shrink-0" size={18} />
            Settings
          </Link>
        </div>

        {/* Inventory Section */}
        <div id="inventory" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {addProductGate ? (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">{addProductGate.title}</p>
              <p className="mt-1 text-sm font-semibold text-amber-900">{addProductGate.description}</p>
              <Link
                href={addProductGate.href}
                className="mt-2 inline-flex text-xs font-black uppercase tracking-wider text-amber-900 underline underline-offset-2"
              >
                {addProductGate.cta}
              </Link>
            </div>
          ) : null}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="font-bold text-lg text-gray-900 italic uppercase tracking-tight">Inventory</h3>
            <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => setIsCatModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
                   <Tags size={16}/> <span className="md:inline">Subcategories</span>
                </button>
                <button
                  onClick={() => void handleAddProductClick()}
                  disabled={checkingAddGate}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition disabled:opacity-60"
                  style={{ backgroundColor: "var(--dash-accent)" }}
                >
                   {checkingAddGate ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                   <span className="md:inline">{checkingAddGate ? "Checking..." : "Add Product"}</span>
                </button>
            </div>
          </div>

          <div className="relative mb-6 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-gray-900 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col max-h-[600px]">
             {filteredProducts.length === 0 ? (
               <div className="p-12 text-center text-gray-400">
                 <Package size={48} className="mx-auto mb-4 opacity-20"/>
                 <p>{searchTerm ? "No products match your search." : "No products yet."}</p>
               </div>
             ) : (
               <div className="overflow-auto no-scrollbar">
                <table className="w-full text-left min-w-[980px]">
                    <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-500 font-black sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4 text-center">Pin</th>
                        <th className="px-6 py-4 text-center">New</th>
                        <th className="px-6 py-4 text-center">Best</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((p) => {
                        const soldOut = isRecentlySoldOut(p);
                        const isNewMerch = isStorefrontMerchFlagOn(p.storefront_new_arrival);
                        const isBestMerch = isStorefrontMerchFlagOn(p.storefront_best_seller);
                        const flashMerchBlocked = isNewMerch || isBestMerch;
                        return (
                          <tr key={p.id} className="hover:bg-gray-50/80 transition group">
                            <td className="px-6 py-4 font-bold text-gray-900 text-sm whitespace-nowrap">
                              {p.name}
                              {soldOut && <span className="block text-[8px] text-amber-600 font-black uppercase tracking-tighter">Recent Sale</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-lg font-black text-[10px] text-gray-500 uppercase tracking-tight">
                                {p.categories?.name || 'General'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[var(--dash-accent)] font-black text-sm whitespace-nowrap">
                              ₦{p.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-xs font-bold whitespace-nowrap">
                              {p.stock_quantity === 0 
                                ? <span className="text-red-500 bg-red-50 px-2 py-1 rounded-lg uppercase text-[10px]">Sold Out</span> 
                                : <span className="text-gray-600">{p.stock_quantity}</span>
                              }
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => void toggleProductPin(p)}
                                className={`inline-flex rounded-lg p-2 transition ${
                                  p.pinned_at ? "text-[var(--dash-accent)] bg-[var(--dash-accent-soft)]" : "text-gray-300 hover:text-[var(--dash-accent)] hover:bg-[var(--dash-accent-soft)]"
                                }`}
                              >
                                <Pin size={18} fill={p.pinned_at ? "currentColor" : "none"} />
                              </button>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => void toggleProductStorefrontFlag(p, "storefront_new_arrival")}
                                className={`inline-flex rounded-lg p-2 transition ${
                                  isNewMerch ? "text-violet-600 bg-violet-50" : "text-gray-300 hover:text-violet-600 hover:bg-violet-50/50"
                                }`}
                              >
                                <Sparkles size={18} fill={isNewMerch ? "currentColor" : "none"} />
                              </button>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => void toggleProductStorefrontFlag(p, "storefront_best_seller")}
                                className={`inline-flex rounded-lg p-2 transition ${
                                  isBestMerch ? "text-amber-600 bg-amber-50" : "text-gray-300 hover:text-amber-600 hover:bg-amber-50/50"
                                }`}
                              >
                                <Award size={18} fill={isBestMerch ? "currentColor" : "none"} />
                              </button>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <div className="flex justify-end gap-1">
                                <button
                                  type="button"
                                  disabled={flashMerchBlocked}
                                  onClick={() => setSelectedFlashProduct(p)}
                                  className={cn(
                                    "p-2 rounded-lg transition-all",
                                    isProductFlashDropActive(p) ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-amber-500",
                                    flashMerchBlocked && "cursor-not-allowed opacity-40 hover:text-gray-300",
                                  )}
                                >
                                  <Zap size={18} fill={isProductFlashDropActive(p) ? "currentColor" : "none"} />
                                </button>
                                <button onClick={() => openEditModal(p)} className="p-2 text-gray-400 hover:text-blue-600 transition"><Edit size={16}/></button>
                                <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition"><Trash2 size={16}/></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                 </table>
               </div>
             )}
          </div>
        </div>

      <AddProductModal 
        storeId={store.owner_id} 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setProductToEdit(null); }} 
        onSuccess={() => {
          void refreshProductRows();
          router.refresh();
        }} 
        productToEdit={productToEdit} 
        onAddCategory={() => setIsCatModalOpen(true)}
        categories={liveCategories}
      />
      
      <CategoryManager 
        sellerId={store.owner_id}
        isOpen={isCatModalOpen} 
        onClose={() => setIsCatModalOpen(false)} 
        onSuccess={() => {
          fetchCategories();
          void refreshProductRows();
          router.refresh();
        }} 
      />
      
      <FlashDropModal 
        product={selectedFlashProduct} 
        isOpen={!!selectedFlashProduct} 
        onClose={() => setSelectedFlashProduct(null)} 
        onSuccess={() => {
          void refreshProductRows();
          router.refresh();
        }} 
      />
    </div>
  );
}