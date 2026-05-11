import { NextResponse } from "next/server";
import { requireStorefrontAdmin } from "@/lib/adminRouteAuth";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string;
  phone_number: string | null;
  created_at: string | null;
  acquisition_channel: string | null;
  coin_balance: number | null;
  location_city: string | null;
  location_state: string | null;
};

function matchesSearch(row: ProfileRow, s: string): boolean {
  const q = s.toLowerCase();
  return (
    (row.email?.toLowerCase().includes(q) ?? false) ||
    (row.full_name?.toLowerCase().includes(q) ?? false) ||
    (row.display_name?.toLowerCase().includes(q) ?? false) ||
    (row.phone_number?.replace(/\D/g, "").includes(q.replace(/\D/g, "")) ?? false)
  );
}

export async function GET(request: Request) {
  const gate = await requireStorefrontAdmin();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || 40), 1), 100);
  const offset = Math.max(Number(searchParams.get("offset") || 0), 0);
  const q = searchParams.get("q")?.trim() ?? "";

  const selectCols =
    "id, email, full_name, display_name, phone_number, created_at, acquisition_channel, coin_balance, location_city, location_state";

  if (!q) {
    const { data, error, count } = await gate.svc
      .from("profiles")
      .select(selectCols, { count: "exact" })
      .or("is_seller.eq.false,is_seller.is.null")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ buyers: data ?? [], total: count ?? 0, limit, offset });
  }

  const scanLimit = 800;
  const { data, error } = await gate.svc
    .from("profiles")
    .select(selectCols)
    .or("is_seller.eq.false,is_seller.is.null")
    .order("created_at", { ascending: false })
    .limit(scanLimit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const filtered = (data ?? []).filter((row: ProfileRow) => matchesSearch(row, q));
  const total = filtered.length;
  const slice = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    buyers: slice,
    total,
    limit,
    offset,
    note: total >= scanLimit ? "Search scanned the most recent non-seller profiles only. Refine your query if needed." : null,
  });
}
