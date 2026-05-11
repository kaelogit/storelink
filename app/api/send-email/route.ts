import { Resend } from "resend";
import { NextResponse } from "next/server";
import { storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, type, code, data } = body;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let subject = '';
    let previewText = '';
    let mainColor = '#10b981'; 
    let title = '';
    let description = '';
    let customContent = '';

    // --- Email templates ---
    
    if (type === 'VERIFY_SIGNUP') {
      subject = `🏰 ${code} is your Storelink verification code`;
      previewText = 'Verify your identity to launch your storefront.';
      title = 'VERIFY YOUR IDENTITY';
      description = `Welcome to the inner circle. Use the secure code below to activate your storefront and begin your journey.`;
      
      customContent = `
        <div style="background-color: #f9fafb; border-radius: 24px; padding: 32px; border: 2px dashed #e5e7eb; margin-bottom: 24px; text-align: center;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #111827;">${code}</span>
        </div>
        <p style="margin: 0 0 32px 0; font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; text-align: center;">Expires in 15 minutes</p>

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 20px; padding: 24px; text-align: left;">
          <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.1em;">🛡️ IMPORTANT: DON'T MISS SALES</p>
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5; font-weight: 500;">
            To ensure you receive <strong>Instant Sale Alerts</strong> and <strong>Customer Manifests</strong>, please mark this email as <strong>"Not Spam"</strong> or move it to your <strong>Primary Inbox</strong> right now. 
            <br/><br/>
            This ensures important StoreLink emails reach your inbox.
          </p>
        </div>
      `;
    }
    
    else if (type === 'PASSWORD_RESET') {
      subject = `🔒 ${code} is your password reset code`;
      previewText = 'Secure your account with a new password.';
      title = 'PASSWORD RESET';
      description = 'Security matters. Use the secure code below to update your access credentials.';
      mainColor = '#f59e0b';
      customContent = `
        <div style="background-color: #f9fafb; border-radius: 24px; padding: 32px; border: 2px dashed #e5e7eb; margin-bottom: 32px; text-align: center;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #111827;">${code}</span>
        </div>
      `;
    } 

    else if (type === 'WELCOME_DAY_1') {
      subject = `🏰 Welcome to the Inner Circle, Founder!`;
      title = "YOU ARE LIVE";
      description = `Your storefront <strong>${data.storeName}</strong> is live on StoreLink. 
      <br/><br/>
      <strong>The workflow:</strong> You share your link, buyers checkout in-app, and you fulfill with a clean order record. Simple. Professional. Scalable.`;
      
      customContent = `
        <div style="text-align:center; margin-bottom: 30px;">
          <a href="${storefrontAbsolutePath("/dashboard")}" style="display: inline-block; background:#10b981; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:bold; text-transform:uppercase; font-size:12px;">Enter My Dashboard</a>
        </div>
        
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 20px; padding: 24px; text-align: left;">
          <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.1em;">🛡️ ACTION REQUIRED: SECURE YOUR SALE ALERTS</p>
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5; font-weight: 500;">
            To ensure you never miss an <strong>Order Manifest</strong> or <strong>Payment Notification</strong>, please do this now:
            <br/><br/>
            1. <strong>Move to Primary:</strong> If this is in your 'Promotions' tab, drag it to 'Primary'.<br/>
            2. <strong>Mark as Safe:</strong> Click the three dots (⋮) and select <strong>'Not Spam'</strong> or <strong>'Add to Contacts'</strong>.
            <br/><br/>
            This ensures the StoreLink Engine can reach you the moment a customer wants to pay.
          </p>
        </div>
      `;
    }

    else if (type === 'PRODUCT_NUDGE' || type === 'WELCOME_DAY_3') {
      subject = `🚀 Expand your warehouse, ${data?.storeName || 'Founder'}!`;
      previewText = 'Don’t leave money on the table. Upload more products.';
      title = 'THE 15-PRODUCT SECRET';
      description = `Your warehouse currently has ${data?.count || 0} products. Data shows that founders with <strong>15+ products</strong> generate 3x more revenue. A full store builds instant trust. Stock up today to dominate your niche.`;
      customContent = `
        <div style="text-align: center;">
          <a href="${storefrontAbsolutePath("/dashboard")}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">Upload Products</a>
        </div>
      `;
    }

    else if (type === 'EXPIRY_REMINDER') {
      const isUrgent = data?.daysLeft <= 3;
      subject = `${isUrgent ? '⚠️ FINAL NOTICE' : '📅 SUBSCRIPTION STATUS'}: Plan expiring`;
      previewText = `Keep your storefront alive. Only ${data?.daysLeft} days remaining.`;
      title = isUrgent ? 'ACTION REQUIRED: RENEWAL' : 'SUBSCRIPTION STATUS';
      description = `Your access for <strong>${data?.storeName}</strong> expires in ${data?.daysLeft} days. To prevent your link from breaking and losing customers, please go to <strong>Dashboard > Subscription</strong> to renew your plan.`;
      mainColor = isUrgent ? '#ef4444' : '#f59e0b';
      customContent = `
        <div style="text-align: center;">
          <a href="${storefrontAbsolutePath("/dashboard/subscription")}" style="display: inline-block; background-color: ${mainColor}; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">Renew My Access</a>
        </div>
      `;
    }

    else if (type === 'WELCOME_DAY_5') {
      subject = "⚡ The Power of the Flash Drop";
      title = "CREATE A SURGE";
      description = `Ever want to clear stock in minutes? The <strong>Flash Drop</strong> feature creates an automated countdown on your store. It forces customers to act NOW. Use it for weekend sales or limited arrivals.`;
      customContent = `<div style="text-align:center;"><a href="${storefrontAbsolutePath("/dashboard")}" style="display: inline-block; background:#ef4444; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Setup My First Drop using the flash icon in dashboard</a></div>`;
    }

    else if (type === 'WELCOME_DAY_7') {
      subject = "🪙 The Store Coin advantage";
      title = "REWARD YOUR LOYALS";
      description = `StoreLink isn't just a link; it's an ecosystem. When customers buy from the marketplace, they earn <strong>Store Coins</strong>. They can spend those coins as discounts in YOUR store—bringing repeat buyers back to you.`;
      customContent = `<div style="text-align:center;"><a href="${storefrontAbsolutePath("/dashboard/loyalty")}" style="display: inline-block; background:#f59e0b; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Check Loyalty Settings</a></div>`;
    }

    else if (type === 'WELCOME_DAY_10') {
      subject = "💎 Why the Greats go Diamond";
      title = "SCALE YOUR STOREFRONT";
      description = `The <strong>Diamond Plan</strong> is designed for the top 1% of vendors. You get priority placement in the Marketplace, access to <strong>AI Background Removal</strong>, and the ability to verify your store with the <strong>"Diamond Badge."</strong> Don't just sell—dominate.`;
      customContent = `<div style="text-align:center;"><a href="${storefrontAbsolutePath("/dashboard/subscription")}" style="display: inline-block; background:#111827; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">See Diamond Benefits</a></div>`;
    }

    else if (type === 'WELCOME_DAY_13') {
      subject = "💎 Ready to scale visibility for your storefront?";
      title = "STANDARD IS FREE — DIAMOND BOOSTS YOU";
      description = `Your storefront <strong>${data.storeName}</strong> stays online on Standard at no cost. If you want higher marketplace visibility and Diamond-only tools, you can upgrade anytime—no trial countdown, no forced expiry on your link.`;
      customContent = `<div style="text-align:center;"><a href="${storefrontAbsolutePath("/dashboard/subscription")}" style="display: inline-block; background:#ef4444; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">See Diamond benefits</a></div>`;
    }

    else if (type === 'RESCUE_DAY_14') {
      subject = "📢 Where is your link? Let's get your first sale!";
      title = "THE VISIBILITY GAP";
      description = `Your store is ready, but your customers might not know where to find it. 
      <br/><br/>
      <strong>The Founder's Checklist:</strong><br/>
      • <strong>Instagram:</strong> Put your link in your Bio.<br/>
      • <strong>Status &amp; Stories:</strong> Share your storefront link where your buyers already scroll.<br/>
      • <strong>TikTok:</strong> Add your link to your profile and mention it in every video.<br/>
      Don't let your storefront sit invisible. Share the link now.`;
      customContent = `<div style="text-align:center;"><a href="${storefrontAbsolutePath("/dashboard")}" style="display: inline-block; background:#111827; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Copy My Link</a></div>`;
    }

    else if (type === 'SUBSCRIBER_PULSE') {
      const tips = [
        { 
          t: "The Power of Content", 
          d: "Record a 'Pack an order with me' video for TikTok or IG Reels. Seeing the human side of your brand builds 10x more trust than a static photo." 
        },
        { 
          t: "Flash Drop Urgency", 
          d: "Running a weekend sale? Use the <strong>Flash Drop</strong> feature to add a live countdown. Urgency is the fastest way to turn 'lookers' into 'buyers'." 
        },
        { 
          t: "The Review Loop", 
          d: "When you mark an order as complete, ask your customer for a public shoutout or review. It’s free, high-trust marketing that scales your link." 
        },
        { 
          t: "Store Coin retention", 
          d: "Make sure your Loyalty Settings are active. When customers earn <strong>Store Coins</strong> in your store, they are financially incentivized to come back to you." 
        }
      ];
      
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      subject = `💎 Growth tip: ${randomTip.t}`;
      title = "SCALING YOUR STORE";
      description = randomTip.d;
      customContent = `
        <div style="text-align:center;">
          <a href="${storefrontAbsolutePath("/dashboard")}" style="display: inline-block; background:#111827; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Open My Dashboard</a>
        </div>
      `;
    }

    else if (type === 'CHECKOUT_ALERT') {
      const products = Array.isArray(data?.productName) ? data.productName : [data?.productName];
      const isMultiple = products.length > 1;

      subject = `💰 NEW SALE INTENT: ${isMultiple ? products.length + ' Items' : products[0]}!`;
      previewText = 'A customer just moved forward on an order.';
      title = 'YOU HAVE A LEAD! 🚀';
      description = `A customer has just initiated a checkout for <strong>${isMultiple ? products.length + ' items' : products[0]}</strong>. 
      <br/><br/>
      <strong style="color: #111827;">✅ NEXT STEPS:</strong><br/>
      1. Confirm payment and availability in <strong>Dashboard &gt; Orders</strong>.<br/>
      2. Fulfill and update status so your buyer sees progress in-app.<br/>
      3. Mark the order as <strong>"Complete"</strong>. This generates a professional digital receipt for your buyer automatically.`;
      
      const productList = products.map((p: string) => `
        <div style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 700; text-align: left;">
          • ${p}
        </div>
      `).join('');

      customContent = `
        <div style="background-color: #f9fafb; border-radius: 24px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 32px;">
          <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; text-align: left;">Items in Cart:</p>
          ${productList}
        </div>
        <div style="text-align: center;">
           <a href="${storefrontAbsolutePath("/dashboard/orders")}" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Manage Orders</a>
        </div>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
                  <tr>
                    <td align="center" style="padding: 40px 40px 20px 40px;">
                      <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #111827; letter-spacing: -0.05em; text-transform: uppercase;">
                        STORELINK
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 40px 40px 40px; text-align: center;">
                      <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 30px;"></div>
                      <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.1em;">${title}</h2>
                      <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.6; color: #6b7280; font-weight: 500;">${description}</p>
                      ${customContent}
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #111827; padding: 24px; text-align: center;">
                      <p style="margin: 0; font-size: 10px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 0.2em;">&copy; 2026 Storelink Engine • Lagos, Nigeria</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const { data: resendData, error } = await resend.emails.send({
      from: 'Storelink <hello@storelink.ng>',
      to: email,
      subject: subject,
      html: html,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true, id: resendData?.id });

  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}