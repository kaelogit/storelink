import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createRouteHandlerSupabase } from "@/lib/routeHandlerSupabase";
import { createServiceRoleClient } from "@/lib/supabaseServiceRole";
import { isStorefrontAdminEmail } from "@/lib/storefrontAdmin";

export type AdminGateOk = { ok: true; svc: SupabaseClient; user: User };
export type AdminGateFail = { ok: false; response: NextResponse };

export async function requireStorefrontAdmin(): Promise<AdminGateOk | AdminGateFail> {
  const auth = await createRouteHandlerSupabase();
  const {
    data: { user },
    error,
  } = await auth.auth.getUser();
  if (error || !user?.email || !isStorefrontAdminEmail(user.email)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  const svc = createServiceRoleClient();
  if (!svc) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Server misconfigured (service role)" }, { status: 500 }),
    };
  }
  return { ok: true, svc, user };
}
