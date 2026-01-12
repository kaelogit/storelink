import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: queue, error } = await supabase
    .from('merchant_welcome_queue')
    .select('*');

  if (error || !queue) return NextResponse.json({ error: error?.message });

  const results = await Promise.all(queue.map(async (merchant) => {
    // Inside the queue.map function in your cron route:
    let type = '';
    switch (merchant.days_since_signup) {
    case 1: type = 'WELCOME_DAY_1'; break;
    case 3: type = 'WELCOME_DAY_3'; break;
    case 5: type = 'WELCOME_DAY_5'; break;
    case 7: type = 'WELCOME_DAY_7'; break;
    case 10: type = 'WELCOME_DAY_10'; break;
    case 13: type = 'WELCOME_DAY_13'; break;
    }

if (type) {
  // ... existing fetch to send-email ...
}

    if (type) {
      await fetch(`${new URL(request.url).origin}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: merchant.owner_email,
          type: type,
          data: { storeName: merchant.store_name }
        }),
      });
      return true;
    }
    return false;
  }));

  return NextResponse.json({ processed: results.length });
}