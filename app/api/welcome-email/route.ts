import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { name, slug, owner_email, subscription_plan } = body.record;

    const { data, error } = await resend.emails.send({
      from: 'StoreLink <founder@storelink.ng>',
      to: [owner_email as string], 
      subject: `🏰 Empire Established: ${name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 40px 20px; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #222; border-radius: 24px; overflow: hidden;">
            
            <div style="background: linear-gradient(180deg, #10b981 0%, #0a0a0a 100%); padding: 50px 40px; text-align: left;">
              <h1 style="font-size: 32px; font-weight: 900; margin: 0; line-height: 1.1; letter-spacing: -1px;">${name} is now Live.</h1>
              <p style="color: rgba(255,255,255,0.7); font-size: 16px; margin-top: 10px;">Your storefront is active at <span style="color: #fff; font-weight: bold;">storelink.ng/${slug}</span></p>
            </div>

            <div style="padding: 40px; text-align: left;">
              <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #10b981; margin-bottom: 25px;">The Founder's Roadmap</h3>

              <div style="margin-bottom: 25px; border-left: 2px solid #222; padding-left: 20px;">
                <p style="margin: 0; font-weight: bold; font-size: 15px;">1. Ignite the Loyalty Engine ⚡</p>
                <p style="margin: 5px 0 0; color: #888; font-size: 13px; line-height: 1.5;">Setup your rewards. Even 5% cashback makes customers 3x more likely to return. Turn buyers into loyalists.</p>
              </div>

              <div style="margin-bottom: 25px; border-left: 2px solid #222; padding-left: 20px;">
                <p style="margin: 0; font-weight: bold; font-size: 15px;">2. Claim Your Blue Badge 🛡️</p>
                <p style="margin: 5px 0 0; color: #888; font-size: 13px; line-height: 1.5;">Trust is the currency of the market. Complete your profile and request your Verification Badge to dominate.</p>
              </div>

              <div style="margin-bottom: 35px; border-left: 2px solid #222; padding-left: 20px;">
                <p style="margin: 0; font-weight: bold; font-size: 15px;">3. Deploy Your Link 🔗</p>
                <p style="margin: 5px 0 0; color: #888; font-size: 13px; line-height: 1.5;">Add your StoreLink to your Instagram/WhatsApp bio. Our checkout is optimized to ensure you never lose a sale.</p>
              </div>

              <a href="https://storelink.ng/dashboard" style="display: block; background: #fff; color: #000; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Open Store Dashboard</a>
            </div>

            <div style="padding: 30px; border-top: 1px solid #1a1a1a; background: #070707;">
              <p style="margin: 0; font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold;">StoreLink Nigeria • Social Commerce Engine</p>
              <p style="margin: 10px 0 0; font-size: 9px; color: #222;">Confidential Founder Access</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ message: 'Empire Ready', data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}