import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type SubmitBody = {
  idUrl?: string;
  selfieUrl?: string;
};

export async function POST(request: Request) {
  let body: SubmitBody;
  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const idUrl = String(body.idUrl || "").trim();
  const selfieUrl = String(body.selfieUrl || "").trim();
  if (!idUrl || !selfieUrl) {
    return NextResponse.json({ error: "idUrl and selfieUrl are required." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // no-op in API route
        },
      },
    },
  );

  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Service role key is missing." }, { status: 500 });
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const payload = {
    user_id: user.id,
    id_type: "PASSPORT" as const,
    id_number: "WEB_DASHBOARD",
    id_url: idUrl,
    face_url: selfieUrl,
    status: "pending" as const,
  };

  const { data: existingRow, error: existingErr } = await admin
    .from("merchant_verifications")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existingErr) {
    return NextResponse.json({ error: existingErr.message }, { status: 500 });
  }

  if ((existingRow as { id?: string } | null)?.id) {
    const { error: updateErr } = await admin
      .from("merchant_verifications")
      .update(payload)
      .eq("user_id", user.id);
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }
  } else {
    const { error: insertErr } = await admin.from("merchant_verifications").insert(payload);
    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }
  }

  const { error: profileErr } = await admin
    .from("profiles")
    .update({ verification_status: "pending", verification_note: null })
    .eq("id", user.id);

  if (profileErr) {
    return NextResponse.json({ ok: true, profileUpdated: false, warning: profileErr.message }, { status: 200 });
  }

  return NextResponse.json({ ok: true, profileUpdated: true }, { status: 200 });
}

