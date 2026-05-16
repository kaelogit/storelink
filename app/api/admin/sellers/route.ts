import { NextResponse } from "next/server";
import { requireStorefrontAdmin } from "@/lib/adminRouteAuth";

const PROFILE_SELECT =
  "id, email, full_name, display_name, slug, phone_number, is_seller, is_verified, verification_status, subscription_plan, subscription_expiry, subscription_status, account_status, loyalty_enabled, loyalty_percentage, category, created_at";

function normalizeVerificationStatus(value: unknown): "none" | "pending" | "verified" | "rejected" {
  const status = String(value || "").trim().toLowerCase();
  if (status === "approved" || status === "verified") return "verified";
  if (status === "pending") return "pending";
  if (status === "rejected") return "rejected";
  return "none";
}

export async function GET() {
  const gate = await requireStorefrontAdmin();
  if (!gate.ok) return gate.response;

  const { data: profiles, error } = await gate.svc
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("is_seller", true)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = profiles ?? [];
  const ids = rows.map((p) => p.id);
  const mvMap = new Map<string, { id_url: string; face_url: string }>();
  if (ids.length > 0) {
    const { data: mvs } = await gate.svc.from("merchant_verifications").select("user_id, id_url, face_url").in("user_id", ids);
    for (const m of mvs || []) {
      const uid = m.user_id as string;
      if (uid) mvMap.set(uid, { id_url: m.id_url as string, face_url: m.face_url as string });
    }
  }

  const sellers = rows.map((p) => {
    const mv = mvMap.get(p.id);
    const name = (p.full_name as string | null)?.trim() || (p.display_name as string) || "Seller";
    const suspended =
      String(p.account_status || "").toLowerCase() === "suspended" ||
      String(p.account_status || "").toLowerCase() === "banned";
    return {
      id: p.id,
      name,
      slug: p.slug as string,
      owner_email: (p.email as string | null) ?? null,
      whatsapp_number: (p.phone_number as string | null) ?? null,
      status: suspended ? "banned" : "active",
      is_verified: Boolean(p.is_verified),
      verification_status: normalizeVerificationStatus(p.verification_status),
      subscription_plan: p.subscription_plan,
      subscription_expiry: p.subscription_expiry,
      subscription_status: p.subscription_status,
      loyalty_enabled: Boolean(p.loyalty_enabled),
      loyalty_percentage: Number(p.loyalty_percentage ?? 1),
      total_revenue: 0,
      verification_doc_url: mv?.id_url ?? null,
      verification_selfie_url: mv?.face_url ?? null,
      verification_note: null as string | null,
      category: p.category,
    };
  });

  return NextResponse.json({ sellers });
}
