import { Resend } from 'resend';
import { NextResponse } from 'next/server';

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

    // --- TEMPLATE LOGIC: THE EMPIRE ENGINE ---
    
    if (type === 'VERIFY_SIGNUP') {
      subject = `🏰 ${code} is your Storelink verification code`;
      previewText = 'Verify your identity to launch your empire.';
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
            This ensures your empire's communication line remains open.
          </p>
        </div>
      `;
    }
    
    else if (type === 'PASSWORD_RESET') {
      subject = `🔒 ${code} is your password reset code`;
      previewText = 'Secure your empire with a new password.';
      title = 'PASSWORD RESET';
      description = 'Security is the foundation of every empire. Use the secure code below to update your access credentials.';
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
      description = `Your storefront <strong>${data.storeName}</strong> is now a part of the StoreLink Empire. 
      <br/><br/>
      <strong>The Philosophy:</strong> You share the link, we handle the manifest, and you close the deal on WhatsApp. Simple. Professional. Scalable.`;
      
      customContent = `
        <div style="text-align:center; margin-bottom: 30px;">
          <a href="https://storelink.ng/dashboard" style="display: inline-block; background:#10b981; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:bold; text-transform:uppercase; font-size:12px;">Enter My Dashboard</a>
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
          <a href="https://storelink.ng/dashboard" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">Upload Products</a>
        </div>
      `;
    }

    else if (type === 'EXPIRY_REMINDER') {
      const isUrgent = data?.daysLeft <= 3;
      subject = `${isUrgent ? '⚠️ FINAL NOTICE' : '📅 EMPIRE STATUS'}: Subscription expiring`;
      previewText = `Keep your storefront alive. Only ${data?.daysLeft} days remaining.`;
      title = isUrgent ? 'ACTION REQUIRED: RENEWAL' : 'SUBSCRIPTION STATUS';
      description = `Your access for <strong>${data?.storeName}</strong> expires in ${data?.daysLeft} days. To prevent your link from breaking and losing customers, please go to <strong>Dashboard > Subscription</strong> to renew your plan.`;
      mainColor = isUrgent ? '#ef4444' : '#f59e0b';
      customContent = `
        <div style="text-align: center;">
          <a href="https://storelink.ng/dashboard/subscription" style="display: inline-block; background-color: ${mainColor}; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;">Renew My Access</a>
        </div>
      `;
    }

    else if (type === 'WELCOME_DAY_1') {
      subject = `🏰 Welcome to the Inner Circle, Founder!`;
      title = "YOU ARE LIVE";
      description = `Your storefront <strong>${data.storeName}</strong> is now a part of the StoreLink Empire. 
      <br/><br/>
      <strong>The Philosophy:</strong> You share the link, we handle the manifest, and you close the deal on WhatsApp. Simple. Professional. Scalable.`;
      
      customContent = `
        <div style="text-align:center; margin-bottom: 30px;">
          <a href="https://storelink.ng/dashboard" style="display: inline-block; background:#10b981; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:bold; text-transform:uppercase; font-size:12px;">Enter My Dashboard</a>
        </div>
        
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 20px; padding: 24px; text-align: left;">
          <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.1em;">🛡️ SECURE YOUR SALE ALERTS</p>
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5; font-weight: 500;">
            To ensure you receive your <strong>Sale Manifests</strong> and <strong>Growth Tips</strong>, please mark this email as <strong>"Not Spam"</strong> or drag it to your <strong>Primary Inbox</strong>. This tells your email provider that you are a serious Founder.
          </p>
        </div>
      `;
    }

    else if (type === 'WELCOME_DAY_5') {
      subject = "⚡ The Power of the Flash Drop";
      title = "CREATE A SURGE";
      description = `Ever want to clear stock in minutes? The <strong>Flash Drop</strong> feature creates an automated countdown on your store. It forces customers to act NOW. Use it for weekend sales or limited arrivals.`;
      customContent = `<div style="text-align:center;"><a href="https://storelink.ng/dashboard" style="display: inline-block; background:#ef4444; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Setup My First Drop using the flash icon in dashboard</a></div>`;
    }

    else if (type === 'WELCOME_DAY_7') {
      subject = "🪙 The Empire Coin Advantage";
      title = "REWARD YOUR LOYALS";
      description = `StoreLink isn't just a link; it's an ecosystem. Every time customers buy from the marketplace, they earn <strong>Empire Coins</strong>. They can spend these in YOUR store. This keeps them coming back to you instead of a random social media seller.`;
      customContent = `<div style="text-align:center;"><a href="https://storelink.ng/dashboard/loyalty" style="display: inline-block; background:#f59e0b; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Check Loyalty Settings</a></div>`;
    }

    else if (type === 'WELCOME_DAY_10') {
      subject = "💎 Why the Greats go Diamond";
      title = "SCALE YOUR EMPIRE";
      description = `The <strong>Diamond Plan</strong> is designed for the top 1% of vendors. You get priority placement in the Marketplace, access to <strong>AI Background Removal</strong>, and the ability to verify your store with the <strong>"Diamond Badge."</strong> Don't just sell—dominate.`;
      customContent = `<div style="text-align:center;"><a href="https://storelink.ng/dashboard/subscription" style="display: inline-block; background:#111827; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">See Diamond Benefits</a></div>`;
    }

    else if (type === 'WELCOME_DAY_13') {
      subject = "⚠️ 24 Hours Remaining: Keep the Empire Alive";
      title = "TRIAL ENDING";
      description = `Your 14-day trial for <strong>${data.storeName}</strong> ends tomorrow. You have items in your warehouse and a professional setup. Don't let your link expire and lose your hard work. Subscribe now to stay live.`;
      customContent = `<div style="text-align:center;"><a href="https://storelink.ng/dashboard/subscription" style="display: inline-block; background:#ef4444; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Keep My Store Live</a></div>`;
    }

    else if (type === 'RESCUE_DAY_14') {
      subject = "📢 Where is your link? Let's get your first sale!";
      title = "THE VISIBILITY GAP";
      description = `Your store is ready, but your customers might not know where to find it. 
      <br/><br/>
      <strong>The Founder's Checklist:</strong><br/>
      • <strong>Instagram:</strong> Put your link in your Bio.<br/>
      • <strong>WhatsApp:</strong> Share your link on your Status every morning at 9 AM.<br/>
      • <strong>TikTok:</strong> Add your link to your profile and mention it in every video.<br/>
      Don't let your empire sit in silence. Share the link now.`;
      customContent = `<div style="text-align:center;"><a href="https://storelink.ng/dashboard" style="display: inline-block; background:#111827; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Copy My Link</a></div>`;
    }

    else if (type === 'SUBSCRIBER_PULSE') {
      const tips = [
        { 
          t: "The Power of Content", 
          d: "Record a 'Pack an order with me' video for TikTok or IG Reels. Seeing the human side of your empire builds 10x more trust than a static photo." 
        },
        { 
          t: "Flash Drop Urgency", 
          d: "Running a weekend sale? Use the <strong>Flash Drop</strong> feature to add a live countdown. Urgency is the fastest way to turn 'lookers' into 'buyers'." 
        },
        { 
          t: "The Review Loop", 
          d: "When you mark an order as complete, ask your customer for a shoutout on their WhatsApp Status. It’s free, high-trust marketing that scales your link." 
        },
        { 
          t: "Empire Coin Retention", 
          d: "Make sure your Loyalty Settings are active. When customers earn <strong>Empire Coins</strong> in your store, they are financially incentivized to never shop anywhere else." 
        }
      ];
      
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      subject = `💎 Empire Growth: ${randomTip.t}`;
      title = "SCALING YOUR STORE";
      description = randomTip.d;
      customContent = `
        <div style="text-align:center;">
          <a href="https://storelink.ng/dashboard" style="display: inline-block; background:#111827; color:#fff; padding:18px 36px; border-radius:16px; text-decoration:none; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Open My Dashboard</a>
        </div>
      `;
    }

    else if (type === 'CHECKOUT_ALERT') {
      const products = Array.isArray(data?.productName) ? data.productName : [data?.productName];
      const isMultiple = products.length > 1;

      subject = `💰 NEW SALE INTENT: ${isMultiple ? products.length + ' Items' : products[0]}!`;
      previewText = 'A customer is heading to your WhatsApp right now.';
      title = 'YOU HAVE A LEAD! 🚀';
      description = `A customer has just initiated a checkout for <strong>${isMultiple ? products.length + ' items' : products[0]}</strong>. 
      <br/><br/>
      <strong style="color: #111827;">✅ NEXT STEPS:</strong><br/>
      1. Close the deal on WhatsApp.<br/>
      2. Once they pay, go to <strong>Dashboard > Orders</strong>.<br/>
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
           <a href="https://storelink.ng/dashboard/orders" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Manage Orders</a>
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
                        STORELINK <span style="color: ${mainColor};">EMPIRE</span>
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