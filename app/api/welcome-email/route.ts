import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Grabbing the data Supabase sends when a new store is inserted
    const { name, slug, owner_email, owner_name, subscription_plan } = body.record;

    const { data, error } = await resend.emails.send({
      from: 'StoreLink <founder@storelink.ng>',
      to: [owner_email],
      subject: `🏰 Welcome to the Empire, ${name}!`,
      html: `
        <div style="font-family: sans-serif; background-color: #0a0a0a; color: white; padding: 40px; border-radius: 24px; max-width: 600px; margin: auto; border: 1px solid #333;">
          <h3 style="color: #10b981; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-bottom: 10px;">Welcome to the Empire</h3>
          <h1 style="margin-top: 0; font-size: 28px;">${name} is Live.</h1>
          
          <p style="color: #ccc; line-height: 1.6;">Hello ${owner_name || 'Founder'}, your digital territory is claimed. Your store is now active and ready to scale at <strong>storelink.ng/${slug}</strong>.</p>
          
          <h3 style="color: #666; margin-top: 30px; text-transform: uppercase; font-size: 12px;">Your First 3 Steps to Success</h3>

          <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981; margin: 15px 0;">
            <strong style="display: block; margin-bottom: 5px;">1. Ignite the Empire Loyalty Engine ⚡</strong>
            <span style="font-size: 14px; color: #aaa; line-height: 1.5;">
              As a <strong>${subscription_plan}</strong> member, you have access to the Empire Loyalty Engine. Setting your reward percentage (we recommend 5% to start) is the fastest way to turn one-time buyers into lifetime loyalists.
            </span>
          </div>

          <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981; margin: 15px 0;">
            <strong style="display: block; margin-bottom: 5px;">2. Verify Your Identity 🛡️</strong>
            <span style="font-size: 14px; color: #aaa; line-height: 1.5;">
              Trust is the currency of the marketplace. Complete your profile and request your <strong>Blue Verification Badge</strong> to show customers you are a legitimate, high-quality vendor.
            </span>
          </div>

          <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981; margin: 15px 0;">
            <strong style="display: block; margin-bottom: 5px;">3. Share Your Zap Link 🔗</strong>
            <span style="font-size: 14px; color: #aaa; line-height: 1.5;">
              Copy your unique StoreLink URL and add it to your Instagram/WhatsApp bio. Our mobile-optimized checkout ensures you never lose a sale due to a slow website again.
            </span>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://storelink.ng/login" style="background: #10b981; color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">ENTER GODMODE DASHBOARD</a>
          </div>

          <p style="text-align: center; color: #444; font-size: 10px; margin-top: 40px; text-transform: uppercase; letter-spacing: 1px;">Administered by StoreLink Nigeria • Founder Access Only</p>
        </div>
      `,
    });

    if (error) {
        console.error("Resend Error:", error);
        return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: 'Empire Welcome Email Sent', data });
  } catch (err) {
    console.error("System Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}