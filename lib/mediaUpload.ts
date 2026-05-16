"use client";

import { supabase } from "@/lib/supabase";

export type MediaBucket =
  | "product-images"
  | "service-images"
  | "reels"
  | "stories"
  | "chat-attachments"
  | "profiles"
  | "merchant-assets"
  | "kyc-documents";

const REQUEST_TIMEOUT_MS = 25000;

function ensureContentType(file: File): string {
  const type = String(file.type || "").trim();
  if (type) return type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".gif")) return "image/gif";
  if (name.endsWith(".pdf")) return "application/pdf";
  return "image/jpeg";
}

export function buildR2Key(bucket: MediaBucket, keyTail: string): string {
  const tail = keyTail.replace(/^\/+/, "");
  return `${bucket}/${tail}`;
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err || "");
    if (msg.toLowerCase().includes("abort")) {
      throw new Error("Upload request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function isNetworkLikeError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  const msg = err instanceof Error ? err.message : String(err || "");
  return /networkerror|failed to fetch|fetch failed|network request failed|timed out|timeout/i.test(msg);
}

export async function uploadFileToR2(options: {
  bucket: MediaBucket;
  key: string;
  file: File;
}): Promise<string> {
  const { bucket, key, file } = options;
  if (!key.startsWith(`${bucket}/`)) {
    throw new Error(`Upload key must start with "${bucket}/".`);
  }

  const contentType = ensureContentType(file);
  const invokePromise = supabase.functions.invoke<{
    uploadUrl?: string;
    publicUrl?: string;
    error?: string;
  }>("get-upload-url", {
    body: { key, contentType },
  });
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Could not get upload URL. Please retry.")), REQUEST_TIMEOUT_MS);
  });
  const { data, error } = (await Promise.race([invokePromise, timeoutPromise])) as Awaited<typeof invokePromise>;

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  if (!data?.uploadUrl || !data?.publicUrl) {
    throw new Error("R2 upload URL generation failed.");
  }

  try {
    const uploadRes = await fetchWithTimeout(
      data.uploadUrl,
      {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
      },
      REQUEST_TIMEOUT_MS,
    );
    if (!uploadRes.ok) {
      throw new Error(`R2 upload failed (HTTP ${uploadRes.status}).`);
    }
    if (!/^https?:\/\//i.test(data.publicUrl)) {
      throw new Error("R2 public URL is invalid.");
    }
    return data.publicUrl;
  } catch (err) {
    // Browser PUT to R2 can fail from CORS/network policies. Fallback to server-side relay.
    if (!isNetworkLikeError(err)) throw err;
    const form = new FormData();
    form.append("bucket", bucket);
    form.append("key", key);
    form.append("contentType", contentType);
    form.append("file", file);

    const fallbackRes = await fetchWithTimeout(
      "/api/uploads/r2",
      {
        method: "POST",
        body: form,
      },
      REQUEST_TIMEOUT_MS,
    );
    const fallbackJson = (await fallbackRes.json().catch(() => ({}))) as { publicUrl?: string; error?: string };
    if (!fallbackRes.ok || !fallbackJson.publicUrl) {
      throw new Error(fallbackJson.error || "Upload failed on fallback route.");
    }
    return fallbackJson.publicUrl;
  }
}

