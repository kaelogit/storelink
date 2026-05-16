import { NextResponse } from "next/server";
import { createRouteHandlerSupabase } from "@/lib/routeHandlerSupabase";

/**
 * Proxies Paystack bank resolve / list_banks to the Supabase Edge Function from the server.
 * Avoids browser-level `FunctionsFetchError` (ad blockers, extensions, flaky client fetch to *.supabase.co).
 */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json(
      { success: false, message: "Supabase URL or anon key is not configured on the server." },
      { status: 503 },
    );
  }

  const supabase = await createRouteHandlerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    return NextResponse.json({ success: false, message: "Sign in to use payout tools." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const fnUrl = `${url}/functions/v1/paystack-account-resolve`;
  let fnRes: Response;
  try {
    fnRes = await fetch(fnUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        apikey: anon,
      },
      body: JSON.stringify(body ?? {}),
      cache: "no-store",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Network error";
    return NextResponse.json(
      {
        success: false,
        message: `Could not reach Paystack verification (${msg}). Check server env and that the edge function is deployed.`,
      },
      { status: 502 },
    );
  }

  const text = await fnRes.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { success: false, message: text || "Unexpected response from verification service." };
  }

  return NextResponse.json(json, { status: fnRes.ok ? 200 : fnRes.status });
}
