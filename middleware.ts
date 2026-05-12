import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isStorefrontAdminEmail } from "@/lib/storefrontAdmin";
import { resolveStorefrontHost } from "@/lib/storefrontHosts";

/** Strip legacy `/sell` prefix (bookmarks / old proxy paths). */
function stripLegacySellPrefix(pathname: string): string {
  if (pathname === "/sell" || pathname === "/sell/") return "/";
  if (pathname.startsWith("/sell/")) return pathname.slice(5) || "/";
  return pathname;
}

/** Path used for auth + routing after host-based tenant rewrite. */
function logicalPathname(request: NextRequest): string {
  const pathname = stripLegacySellPrefix(request.nextUrl.pathname);
  const hostKind = resolveStorefrontHost(request.headers.get("host"));
  if (hostKind.kind === "seller" && (pathname === "/" || pathname === "")) {
    return `/${hostKind.slug}`;
  }
  return pathname;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = logicalPathname(request);

  if (path.startsWith("/admin")) {
    if (!user || !isStorefrontAdminEmail(user.email)) {
      const url = request.nextUrl.clone();
      url.pathname = user ? "/post-login" : "/login";
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/dashboard") || path.startsWith("/onboarding") || path.startsWith("/account") || path.startsWith("/post-login")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      /** `next` is consumed by `router.push` — logical path on the same host. */
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  if (path === "/login" || path === "/signup") {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/post-login";
      return NextResponse.redirect(url);
    }
  }

  const hostKind = resolveStorefrontHost(request.headers.get("host"));
  const rawPath = stripLegacySellPrefix(request.nextUrl.pathname);
  if (hostKind.kind === "seller" && (rawPath === "/" || rawPath === "")) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/${hostKind.slug}`;
    const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
      request: { headers: request.headers },
    });
    const refreshed = response.headers.getSetCookie?.() ?? [];
    for (const cookie of refreshed) {
      rewriteResponse.headers.append("Set-Cookie", cookie);
    }
    return rewriteResponse;
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
