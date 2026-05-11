import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cookie-bound anon client for Route Handlers (read session / `getUser`). */
export async function createRouteHandlerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          /* read-only for admin guard */
        },
      },
    },
  );
}
