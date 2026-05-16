import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isStorefrontAdminEmail } from "@/lib/storefrontAdmin";
import { resolveStorefrontHost, storefrontRootDomain } from "@/lib/storefrontHosts";
import {
  getDashboardOnboardingGatePath,
  type ProfileOnboardingRow,
} from "@/lib/onboardingState";

const PROFILE_ONBOARDING_GATE_SELECT =
  "id, onboarding_completed, is_seller, onboarding_step, full_name, display_name, phone_number, slug, bio, gender, location_state, location_city, location, discovery_latitude, discovery_longitude, shop_address, service_latitude, service_longitude, logo_url, cover_image_url, buyer_interested_categories";

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
  const host = request.nextUrl.hostname.toLowerCase();
  const isLocalDevHost = host === "localhost" || host === "127.0.0.1";
  const bypassAuthGuards =
    process.env.NODE_ENV === "development" &&
    isLocalDevHost &&
    process.env.STOREFRONT_BYPASS_AUTH_GUARDS === "1";

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
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const tenantHost = resolveStorefrontHost(request.headers.get("host"));
  if (tenantHost.kind === "seller") {
    try {
      const { data: redir } = await supabase
        .from("storefront_slug_redirects")
        .select("new_slug")
        .eq("old_slug", tenantHost.slug)
        .maybeSingle();
      const nextSlug = (redir as { new_slug?: string } | null)?.new_slug;
      if (nextSlug && nextSlug !== tenantHost.slug) {
        const root = storefrontRootDomain();
        const dest = request.nextUrl.clone();
        dest.hostname = `${nextSlug}.${root}`;
        return NextResponse.redirect(dest, 308);
      }
    } catch {
      // Fail open when upstream auth/db is flaky during local dev.
    }
  }

  let user: { id: string; email?: string | null } | null = null;
  let authFetchFailed = bypassAuthGuards;
  if (!bypassAuthGuards) {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      user = authUser;
    } catch {
      user = null;
      authFetchFailed = true;
    }
  }
  const path = logicalPathname(request);

  if (!authFetchFailed && path.startsWith("/admin")) {
    if (!user || !isStorefrontAdminEmail(user.email)) {
      const url = request.nextUrl.clone();
      url.pathname = user ? "/post-login" : "/login";
      return NextResponse.redirect(url);
    }
  }

  if (!authFetchFailed && (path.startsWith("/dashboard") || path.startsWith("/onboarding") || path.startsWith("/account") || path.startsWith("/post-login"))) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      /** `next` is consumed by `router.push` — logical path on the same host. */
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  if (!authFetchFailed && user && path.startsWith("/verify")) {
    try {
      const { data: verificationRow } = await supabase
        .from("profiles")
        .select("is_verified")
        .eq("id", user.id)
        .maybeSingle();
      if ((verificationRow as { is_verified?: boolean | null } | null)?.is_verified === true) {
        const url = request.nextUrl.clone();
        const requestedNext = url.searchParams.get("next") || "";
        const safeNext =
          requestedNext.startsWith("/") &&
          !requestedNext.startsWith("//") &&
          requestedNext !== "/login" &&
          requestedNext !== "/signup" &&
          requestedNext !== "/verify"
            ? requestedNext
            : "/dashboard";
        url.pathname = safeNext;
        url.search = "";
        return NextResponse.redirect(url);
      }
    } catch {
      // allow verify page if profile read fails
    }
  }

  const needsVerifiedEmail =
    path.startsWith("/dashboard") || path.startsWith("/onboarding") || path.startsWith("/account") || path.startsWith("/post-login");
  if (!authFetchFailed && user && needsVerifiedEmail && !path.startsWith("/verify")) {
    try {
      const { data: verificationRow } = await supabase
        .from("profiles")
        .select("is_verified")
        .eq("id", user.id)
        .maybeSingle();
      const isVerified = Boolean((verificationRow as { is_verified?: boolean | null } | null)?.is_verified);
      if (!isVerified) {
        const url = request.nextUrl.clone();
        url.pathname = "/verify";
        url.searchParams.set("type", "signup");
        if (user.email) url.searchParams.set("email", user.email);
        url.searchParams.set("next", path);
        return NextResponse.redirect(url);
      }
    } catch {
      // Fail open on connectivity errors to avoid dead-ends.
    }
  }

  const isHubPath = path.startsWith("/dashboard") || path.startsWith("/account");
  if (!authFetchFailed && user && isHubPath) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select(PROFILE_ONBOARDING_GATE_SELECT)
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        // Fail open when profile row is temporarily unavailable.
        // This avoids bouncing signed-in users into /onboarding/role -> /login loops.
        return response;
      }

      const gate = getDashboardOnboardingGatePath({
        profile: profile as ProfileOnboardingRow | null,
      });

      if (gate && gate !== path) {
        const url = request.nextUrl.clone();
        url.pathname = gate;
        return NextResponse.redirect(url);
      }
    } catch {
      // Fail open to avoid "network error"/route dead-ends when auth API is unreachable.
    }
  }

  if (!authFetchFailed && (path === "/login" || path === "/signup")) {
    if (user) {
      const url = request.nextUrl.clone();
      const requestedNext = url.searchParams.get("next") || "";
      const safeNext =
        requestedNext.startsWith("/") &&
        !requestedNext.startsWith("//") &&
        requestedNext !== "/login" &&
        requestedNext !== "/signup"
          ? requestedNext
          : null;
      url.pathname = safeNext || "/post-login";
      url.search = "";
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
