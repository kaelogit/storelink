import type { SupabaseClient, User } from "@supabase/supabase-js";

function isNetworkLikeError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  const msg = err instanceof Error ? err.message : String(err || "");
  return /networkerror|failed to fetch|fetch failed|network request failed|timeout/i.test(msg);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Session-first user lookup for client pages.
 * Falls back to network getUser() only when local session is unavailable.
 */
export async function getClientUserSafe(supabase: SupabaseClient): Promise<User | null> {
  for (let i = 0; i < 2; i += 1) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) return session.user;
    } catch {
      // continue to network fallback
    }
    if (i < 1) await sleep(120);
  }

  for (let i = 0; i < 3; i += 1) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) return user;
      // no user object means likely signed out; stop retrying
      return null;
    } catch (err) {
      if (!isNetworkLikeError(err) || i === 2) return null;
      await sleep(180 * (i + 1));
    }
  }
  return null;
}
