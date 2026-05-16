import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { isServiceOnlyPlaceholderOrder } from "@/utils/orderPlaceholders";

const ORDER_SELECT = "id, created_at, updated_at, status, total_amount, coin_redeemed, currency_code, origin_channel, checkout_mode, shipping_address, seller_id, payment_reference, guest_email";
const ORDER_ITEM_SELECT = "id, order_id, quantity, unit_price, product_name, item_type, product_id";
const SELLER_SELECT = "id, display_name, full_name, email, logo_url, slug, is_verified";

type OrderRow = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  status: string | null;
  total_amount: string | number | null;
  coin_redeemed?: number | null;
  coins_redeemed?: number | null;
  currency_code: string | null;
  origin_channel: string | null;
  checkout_mode: string | null;
  shipping_address: string | null;
  seller_id: string | null;
  payment_reference: string | null;
  customer_email?: string | null;
};

type OrderItemRow = {
  id: string;
  order_id: string | null;
  quantity: number | null;
  unit_price: string | number | null;
  product_name: string | null;
  item_type: string | null;
  product_id: string | null;
};

type SellerRow = {
  id: string;
  display_name: string | null;
  full_name: string | null;
  email: string | null;
  logo_url: string | null;
  slug: string | null;
  is_verified: boolean | null;
};

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) {
    return NextResponse.json(
      {
        error: "Server config missing.",
        debug: {
          serviceConfigured: Boolean(url && anon && service),
        },
      },
      { status: 500 }
    );
  }

  const authClient = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {
        // No cookie mutation needed in this readonly route.
      },
    },
  });

  let userId: string | null = null;
  let userEmail: string | null = null;
  let authMode: "session" | "user" | "none" = "none";
  let authError: string | null = null;

  try {
    const {
      data: { session },
    } = await authClient.auth.getSession();
    if (session?.user?.id) {
      userId = session.user.id;
      userEmail = session.user.email ?? null;
      authMode = "session";
    }
  } catch (error) {
    authError = error instanceof Error ? error.message : "session lookup failed";
  }

  if (!userId) {
    try {
      const {
        data: { user },
      } = await authClient.auth.getUser();
      if (user?.id) {
        userId = user.id;
        userEmail = user.email ?? null;
        authMode = "user";
      }
    } catch (error) {
      authError = error instanceof Error ? error.message : "user lookup failed";
    }
  }

  if (!userId) {
    return NextResponse.json(
      {
        orders: [],
        debug: {
          serviceConfigured: true,
          authMode,
          authError,
          authUserId: null,
          authEmail: null,
          byUserId: 0,
          byClaimed: 0,
          byEmail: 0,
          merged: 0,
          filtered: 0,
        },
      },
      { status: 200 }
    );
  }

  const admin = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const byId = new Map<string, OrderRow>();

  let byUserCount = 0;
  let byClaimedCount = 0;
  let byEmailCount = 0;
  let byUserError: string | null = null;
  let byClaimedError: string | null = null;
  let byEmailError: string | null = null;

  try {
    const { data: rowsUser, error } = await admin
      .from("orders")
      .select(ORDER_SELECT)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      byUserError = error.message;
    } else {
      const rowsUserSafe = (rowsUser || []) as OrderRow[];
      byUserCount = rowsUserSafe.length;
      for (const row of rowsUserSafe) byId.set(String(row.id), row);
    }
  } catch (error) {
    byUserError = error instanceof Error ? error.message : "user_id query failed";
  }

  try {
    const { data: rowsClaimed, error } = await admin
      .from("orders")
      .select(ORDER_SELECT)
      .eq("claimed_by_user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      byClaimedError = error.message;
    } else {
      const rowsClaimedSafe = (rowsClaimed || []) as OrderRow[];
      byClaimedCount = rowsClaimedSafe.length;
      for (const row of rowsClaimedSafe) byId.set(String(row.id), row);
    }
  } catch (error) {
    byClaimedError = error instanceof Error ? error.message : "claimed_by_user_id query failed";
  }

  const email = String(userEmail || "").trim().toLowerCase();
  if (email.includes("@")) {
    try {
      const { data: rowsEmail, error } = await admin
        .from("orders")
        .select(ORDER_SELECT)
        .eq("guest_email", email)
        .is("user_id", null)
        .order("created_at", { ascending: false });
      if (error) {
        byEmailError = error.message;
      } else {
        const rowsEmailSafe = (rowsEmail || []) as OrderRow[];
        byEmailCount = rowsEmailSafe.length;
        for (const row of rowsEmailSafe) byId.set(String(row.id), row);
      }
    } catch (error) {
      byEmailError = error instanceof Error ? error.message : "guest_email query failed";
    }
  }

  const orders = Array.from(byId.values()).sort((a, b) => {
    const bTime = new Date(String(b.created_at || 0)).getTime();
    const aTime = new Date(String(a.created_at || 0)).getTime();
    return bTime - aTime;
  });

  const orderIds = orders.map((o) => String(o.id));
  let items: OrderItemRow[] = [];
  if (orderIds.length) {
    const { data } = await admin.from("order_items").select(ORDER_ITEM_SELECT).in("order_id", orderIds);
    items = (data || []) as OrderItemRow[];
  }
  const itemMap = new Map<string, OrderItemRow[]>();
  for (const it of items) {
    const id = String(it.order_id || "");
    if (!itemMap.has(id)) itemMap.set(id, []);
    itemMap.get(id)!.push(it);
  }

  const sellerIds = Array.from(
    new Set(
      orders
        .map((o) => String(o.seller_id || "").trim())
        .filter(Boolean)
    )
  );
  let sellers: SellerRow[] = [];
  if (sellerIds.length) {
    const { data } = await admin.from("profiles").select(SELLER_SELECT).in("id", sellerIds);
    sellers = (data || []) as SellerRow[];
  }
  const sellerMap = new Map<string, SellerRow>(sellers.map((s) => [String(s.id), s]));

  const hydrated = orders.map((o) => ({
    ...o,
    order_items: itemMap.get(String(o.id)) || [],
    merchant: sellerMap.get(String(o.seller_id || "")) || null,
  }));

  const filtered = hydrated.filter(
    (row) =>
      !isServiceOnlyPlaceholderOrder(
        row as { order_items?: Array<{ item_type?: string | null; product_id?: string | null }> | null }
      )
  );

  return NextResponse.json(
    {
      orders: filtered,
      debug: {
        serviceConfigured: true,
        authMode,
        authError,
        authUserId: userId,
        authEmail: userEmail,
        byUserId: byUserCount,
        byClaimed: byClaimedCount,
        byEmail: byEmailCount,
        byUserError,
        byClaimedError,
        byEmailError,
        merged: hydrated.length,
        filtered: filtered.length,
      },
    },
    { status: 200 }
  );
}

