import { NextResponse } from "next/server";

const FUNCTION_TIMEOUT_MS = 20000;

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form payload." }, { status: 400 });
  }

  const bucket = String(form.get("bucket") || "").trim();
  const key = String(form.get("key") || "").trim();
  const contentType = String(form.get("contentType") || "application/octet-stream").trim();
  const file = form.get("file");

  if (!bucket || !key || !file || !(file instanceof File)) {
    return NextResponse.json({ error: "bucket, key and file are required." }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ error: "Supabase env is not configured." }, { status: 500 });
  }

  // Uses the same Supabase edge function as mobile, but from server-side to avoid browser CORS issues.
  const fnRes = await withTimeout(
    fetch(`${url}/functions/v1/get-upload-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anon}`,
      },
      body: JSON.stringify({ key, contentType }),
    }),
    FUNCTION_TIMEOUT_MS,
    "Timed out requesting upload URL.",
  ).catch((err) => err as Error);

  if (fnRes instanceof Error) {
    return NextResponse.json({ error: fnRes.message }, { status: 502 });
  }

  const fnJson = (await fnRes.json().catch(() => ({}))) as {
    uploadUrl?: string;
    publicUrl?: string;
    error?: string;
  };

  if (!fnRes.ok || fnJson.error || !fnJson.uploadUrl || !fnJson.publicUrl) {
    return NextResponse.json(
      { error: fnJson.error || "Could not create upload URL." },
      { status: 502 },
    );
  }

  const buffer = await file.arrayBuffer();
  const putRes = await withTimeout(
    fetch(fnJson.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType || file.type || "application/octet-stream" },
      body: buffer,
    }),
    FUNCTION_TIMEOUT_MS,
    "Timed out uploading file.",
  ).catch((err) => err as Error);

  if (putRes instanceof Error) {
    return NextResponse.json({ error: putRes.message }, { status: 502 });
  }
  if (!putRes.ok) {
    return NextResponse.json({ error: `R2 upload failed (HTTP ${putRes.status}).` }, { status: 502 });
  }

  return NextResponse.json({ publicUrl: fnJson.publicUrl }, { status: 200 });
}

