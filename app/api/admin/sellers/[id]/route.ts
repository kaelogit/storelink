import { NextResponse } from "next/server";
import { requireStorefrontAdmin } from "@/lib/adminRouteAuth";

type PatchBody = {
  subscription_plan?: string;
  subscription_expiry?: string | null;
  subscription_status?: string | null;
  account_status?: string | null;
  loyalty_enabled?: boolean;
  loyalty_percentage?: number;
  is_verified?: boolean;
  verification_status?: string | null;
};

function normalizeVerificationStatus(value: string | null | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const status = value.trim().toLowerCase();
  if (!status) return null;
  if (status === "approved") return "verified";
  if (status === "verified" || status === "pending" || status === "rejected" || status === "none") return status;
  return status;
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireStorefrontAdmin();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const sellerId = id?.trim();
  if (!sellerId) {
    return NextResponse.json({ error: "Missing seller id" }, { status: 400 });
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (body.subscription_plan !== undefined) updates.subscription_plan = body.subscription_plan;
  if (body.subscription_expiry !== undefined) updates.subscription_expiry = body.subscription_expiry;
  if (body.subscription_status !== undefined) updates.subscription_status = body.subscription_status;
  if (body.account_status !== undefined) updates.account_status = body.account_status;
  if (body.loyalty_enabled !== undefined) updates.loyalty_enabled = body.loyalty_enabled;
  if (body.loyalty_percentage !== undefined) updates.loyalty_percentage = body.loyalty_percentage;
  if (body.is_verified !== undefined) updates.is_verified = body.is_verified;
  if (body.verification_status !== undefined) {
    updates.verification_status = normalizeVerificationStatus(body.verification_status);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await gate.svc
    .from("profiles")
    .update(updates)
    .eq("id", sellerId)
    .eq("is_seller", true)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Seller not found or not a seller" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
