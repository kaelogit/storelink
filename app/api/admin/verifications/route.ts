import { NextResponse } from "next/server";
import { requireStorefrontAdmin } from "@/lib/adminRouteAuth";

type DecisionBody = {
  requestId?: string;
  userId?: string;
  decision?: "approve" | "reject";
  reason?: string;
};

export async function GET() {
  const gate = await requireStorefrontAdmin();
  if (!gate.ok) return gate.response;

  const { data: rows, error } = await gate.svc
    .from("merchant_verifications")
    .select("id, user_id, id_type, id_number, id_url, face_url, status, created_at")
    .eq("status", "pending")
    .not("user_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ids = [...new Set((rows ?? []).map((r) => r.user_id).filter(Boolean))] as string[];
  const profilesById: Record<
    string,
    {
      id: string;
      email: string | null;
      display_name: string;
      full_name: string | null;
      slug: string;
      location: string | null;
      location_city: string | null;
      location_state: string | null;
      is_seller: boolean | null;
    }
  > = {};

  if (ids.length) {
    const { data: profiles, error: pErr } = await gate.svc
      .from("profiles")
      .select("id, email, display_name, full_name, slug, location, location_city, location_state, is_seller")
      .in("id", ids);

    if (pErr) {
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }
    for (const p of profiles ?? []) {
      profilesById[p.id] = p;
    }
  }

  const items = (rows ?? []).map((r) => ({
    ...r,
    profile: r.user_id ? profilesById[r.user_id] ?? null : null,
  }));

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const gate = await requireStorefrontAdmin();
  if (!gate.ok) return gate.response;

  let body: DecisionBody;
  try {
    body = (await request.json()) as DecisionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const requestId = body.requestId?.trim();
  const userId = body.userId?.trim();
  const decision = body.decision;
  const reason = body.reason?.trim();

  if (!requestId || !userId || !decision) {
    return NextResponse.json({ error: "requestId, userId, and decision are required" }, { status: 400 });
  }

  if (decision === "reject" && (!reason || reason.length < 10)) {
    return NextResponse.json({ error: "Rejection requires a reason (min 10 characters)" }, { status: 400 });
  }

  const { data: row, error: rowErr } = await gate.svc
    .from("merchant_verifications")
    .select("id, user_id, status")
    .eq("id", requestId)
    .eq("user_id", userId)
    .maybeSingle();

  if (rowErr) {
    return NextResponse.json({ error: rowErr.message }, { status: 500 });
  }
  if (!row || row.status !== "pending") {
    return NextResponse.json({ error: "Request not found or not pending" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const approved = decision === "approve";

  const { error: mvErr } = await gate.svc
    .from("merchant_verifications")
    .update({
      status: approved ? "approved" : "rejected",
      rejection_reason: approved ? null : reason,
      updated_at: now,
    })
    .eq("id", requestId);

  if (mvErr) {
    return NextResponse.json({ error: mvErr.message }, { status: 500 });
  }

  const profilePatch = approved
    ? { is_verified: true, verification_status: "verified" as const, verification_note: null as string | null }
    : { verification_status: "rejected" as const };

  const { error: profErr } = await gate.svc.from("profiles").update(profilePatch).eq("id", userId);

  if (profErr) {
    return NextResponse.json({ error: profErr.message }, { status: 500 });
  }

  const notif = approved
    ? {
        user_id: userId,
        title: "Verification approved",
        message: "Your seller verification is approved. You now have the verified badge.",
        type: "success",
      }
    : {
        user_id: userId,
        title: "Verification rejected",
        message: `Your verification request was rejected. Reason: ${reason}. Please upload a valid ID and selfie.`,
        type: "warning",
      };
  const { error: notifErr } = await gate.svc.from("notifications").insert(notif);
  if (notifErr) {
    /* best-effort — moderation outcome already persisted */
  }

  await gate.svc.from("storefront_site_notifications").insert({
    user_id: userId,
    title: notif.title,
    body: notif.message,
    msg_type: notif.type === "warning" ? "warning" : notif.type === "success" ? "success" : "info",
  });

  return NextResponse.json({ ok: true });
}
