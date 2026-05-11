import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isStorefrontAdminEmail } from "@/lib/storefrontAdmin";
import { STOREFRONT_BASE_PATH } from "@/lib/storefrontPublicUrl";

/** Path as seen by app routes (without `/sell` prefix). */
function toLogicalPath(pathname: string): string {
  if (pathname === STOREFRONT_BASE_PATH || pathname === `${STOREFRONT_BASE_PATH}/`) return "/";
  if (pathname.startsWith(`${STOREFRONT_BASE_PATH}/`)) {
    return pathname.slice(STOREFRONT_BASE_PATH.length) || "/";
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
  const path = toLogicalPath(request.nextUrl.pathname);

  if (path.startsWith("/admin")) {
    if (!user || !isStorefrontAdminEmail(user.email)) {
      const url = request.nextUrl.clone();
      url.pathname = `${STOREFRONT_BASE_PATH}${user ? "/post-login" : "/login"}`;
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/dashboard") || path.startsWith("/onboarding") || path.startsWith("/account") || path.startsWith("/post-login")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = `${STOREFRONT_BASE_PATH}/login`;
      /** `next` is consumed by `router.push` — must be logical path (basePath is applied by Next). */
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  if (path === "/login" || path === "/signup") {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = `${STOREFRONT_BASE_PATH}/post-login`;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
