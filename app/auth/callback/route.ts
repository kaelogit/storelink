import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextRaw = searchParams.get('next') ?? '/onboarding'
  const next =
    nextRaw.startsWith('/') && !nextRaw.startsWith('//') && !nextRaw.includes('://') ? nextRaw : '/onboarding'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Safe to ignore if middleware is handling refreshes
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if store exists to decide where to send them
        const { data: store } = await supabase
          .from('stores')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle()

        const forwardTo = store ? '/dashboard' : next
        const target = forwardTo.startsWith('/') ? forwardTo : `/${forwardTo}`
        return NextResponse.redirect(`${origin}${target}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Verification failed.`)
}