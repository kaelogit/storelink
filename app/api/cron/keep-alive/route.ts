import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 1. Get the secret from the request headers
  const authHeader = request.headers.get('authorization');

  // 2. Check if the secret matches our environment variable
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('stores').select('id').limit(1)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ 
    success: true, 
    message: "Empire is Awake and Secure!", 
    timestamp: new Date().toISOString() 
  })
}