import { NextResponse } from "next/server";
import { requireStorefrontAdmin } from "@/lib/adminRouteAuth";
import { ADMIN_ORDERS_CORE_COLUMNS, enrichOrdersWithStoreBySeller } from "@/lib/adminOrders";
import { STOREFRONT_ORDER_ORIGIN } from "@/lib/storefrontAdminScope";

const ORDER_SELECT = `
  ${ADMIN_ORDERS_CORE_COLUMNS},
  buyer:profiles!orders_user_id_fkey ( id, email, full_name, display_name, phone_number ),
  seller:profiles!orders_seller_id_fkey ( id, email, full_name, display_name, slug )
`;

export async function GET(request: Request) {
  const gate = await requireStorefrontAdmin();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || 50), 1), 150);
  const offset = Math.max(Number(searchParams.get("offset") || 0), 0);
  const status = searchParams.get("status")?.trim();
  const q = searchParams.get("q")?.trim() ?? "";

  let query = gate.svc
    .from("orders")
    .select(ORDER_SELECT, { count: "exact" })
    .eq("origin_channel", STOREFRONT_ORDER_ORIGIN)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (q) {
    const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q);
    if (uuidLike) {
      query = query.eq("id", q);
    } else {
      const safe = q.replace(/%/g, "");
      const pat = `%${safe}%`;
      query = query.or(
        `buyer.email.ilike.${pat},buyer.display_name.ilike.${pat},buyer.full_name.ilike.${pat},payment_reference.ilike.${pat},shipping_address.ilike.${pat}`,
      );
    }
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as Array<Record<string, unknown> & { seller_id?: string | null }>;
  const orders = await enrichOrdersWithStoreBySeller(gate.svc, rows);

  return NextResponse.json({ orders, total: count ?? orders.length, limit, offset });
}
