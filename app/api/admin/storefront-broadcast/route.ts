import { NextResponse } from "next/server";
import { requireStorefrontAdmin } from "@/lib/adminRouteAuth";

type Audience = "all" | "sellers" | "buyers" | "store_owner";

type Body = {
  audience: Audience;
  title: string;
  body: string;
  msg_type?: string;
  /** When audience === store_owner: `profiles.id` (seller). Legacy: `storeId` accepted as alias. */
  sellerId?: string;
  storeId?: string;
};

const CHUNK = 400;

export async function POST(request: Request) {
  const gate = await requireStorefrontAdmin();
  if (!gate.ok) return gate.response;

  let parsed: Body;
  try {
    parsed = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = parsed.title?.trim();
  const bodyText = parsed.body?.trim();
  const msgType = ["info", "warning", "success"].includes(String(parsed.msg_type))
    ? String(parsed.msg_type)
    : "info";

  if (!title || !bodyText) {
    return NextResponse.json({ error: "title and body are required" }, { status: 400 });
  }

  let userIds: string[] = [];

  try {
    if (parsed.audience === "all") {
      const { data, error } = await gate.svc.from("profiles").select("id");
      if (error) throw error;
      userIds = [...new Set((data ?? []).map((r: { id: string }) => r.id).filter(Boolean))];
    } else if (parsed.audience === "sellers") {
      const { data, error } = await gate.svc.from("profiles").select("id").eq("is_seller", true);
      if (error) throw error;
      userIds = [...new Set((data ?? []).map((r: { id: string }) => r.id).filter(Boolean))];
    } else if (parsed.audience === "buyers") {
      const { data, error } = await gate.svc.from("profiles").select("id").or("is_seller.eq.false,is_seller.is.null");
      if (error) throw error;
      userIds = [...new Set((data ?? []).map((r: { id: string }) => r.id).filter(Boolean))];
    } else if (parsed.audience === "store_owner") {
      const sellerId = (parsed.sellerId || parsed.storeId)?.trim();
      if (!sellerId) {
        return NextResponse.json({ error: "sellerId required for store_owner audience" }, { status: 400 });
      }
      const { data: row, error } = await gate.svc
        .from("profiles")
        .select("id")
        .eq("id", sellerId)
        .eq("is_seller", true)
        .maybeSingle();
      if (error) throw error;
      const owner = row?.id as string | undefined;
      if (!owner) {
        return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });
      }
      userIds = [owner];
    } else {
      return NextResponse.json({ error: "Invalid audience" }, { status: 400 });
    }

    if (userIds.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, warning: "No recipient profiles matched." });
    }

    for (let i = 0; i < userIds.length; i += CHUNK) {
      const slice = userIds.slice(i, i + CHUNK);
      const rows = slice.map((user_id) => ({
        user_id,
        title,
        body: bodyText,
        msg_type: msgType,
      }));
      const { error: insErr } = await gate.svc.from("storefront_site_notifications").insert(rows);
      if (insErr) throw insErr;
    }

    return NextResponse.json({ ok: true, sent: userIds.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Broadcast failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
