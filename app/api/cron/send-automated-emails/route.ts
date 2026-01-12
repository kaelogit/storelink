import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 1. Check for a Secret Key (Security)
  // This prevents random people from triggering your emails
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Uses the Service Role for admin access
    );

    // 2. Fetch the targets from your SQL View
    const { data: targets, error: fetchError } = await supabase
      .from('daily_email_targets')
      .select('*')
      .not('email_type', 'is', null);

    if (fetchError) throw fetchError;
    if (!targets || targets.length === 0) {
      return NextResponse.json({ message: "No targets today" });
    }

    // 3. Trigger the emails via your existing send-email logic
    const results = await Promise.all(
      targets.map(async (target) => {
        try {
          const res = await fetch(`${new URL(request.url).origin}/api/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: target.owner_email,
              type: target.email_type,
              data: {
                storeName: target.store_name,
                count: target.p_count,
                daysLeft: target.days_left
              }
            }),
          });
          return res.ok;
        } catch (e) {
          return false;
        }
      })
    );

    return NextResponse.json({ 
      processed: targets.length, 
      successful: results.filter(r => r).length 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}