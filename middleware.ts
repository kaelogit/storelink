import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

  const { data: { session } } = await supabase.auth.getSession();
  const path = request.nextUrl.pathname;

  // 1. ADMIN LOCK (Godmode)
  const ADMIN_EMAIL = "ksqkareem@gmail.com";
  if (path.startsWith('/admin')) {
    if (!session || session.user.email !== ADMIN_EMAIL) {
      const url = request.nextUrl.clone();
      url.pathname = session ? '/dashboard' : '/login';
      return NextResponse.redirect(url);
    }
  }

  // 2. VENDOR PROTECTION (Dashboard & Onboarding)
  // If no session and trying to access private pages, redirect to login
  if (path.startsWith('/dashboard') || path.startsWith('/onboarding')) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // 3. AUTH AUTH PAGE PROTECTION (Login/Signup)
  // If user is ALREADY logged in, don't let them see login/signup pages
  if (path === '/login' || path === '/signup') {
    if (session) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}