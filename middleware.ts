import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isStorefrontAdminEmail } from '@/lib/storefrontAdmin'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 🔥 SECURE AUDIT: Using getUser() instead of getSession()
  // This contacts the Supabase Auth server to verify the user is authentic.
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // 1. ADMIN LOCK (The "Founder" Check — see STOREFRONT_ADMIN_EMAIL)

  if (path.startsWith('/admin')) {
    // If no user or email doesn't match the Founder email
    if (!user || !isStorefrontAdminEmail(user.email)) {
      const url = request.nextUrl.clone();
      // If they are logged in but NOT admin, send to dashboard. Else send to login.
      url.pathname = user ? '/post-login' : '/login';
      return NextResponse.redirect(url);
    }
  }

  // 2. AUTH-GATED AREAS (dashboard, onboarding, account hub)
  if (path.startsWith('/dashboard') || path.startsWith('/onboarding') || path.startsWith('/account') || path.startsWith('/post-login')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', path);
      return NextResponse.redirect(url);
    }
  }

  // 3. AUTH PAGE PROTECTION (Login/Signup)
  if (path === '/login' || path === '/signup') {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = '/post-login';
      return NextResponse.redirect(url);
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - all images (svg, png, jpg, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}