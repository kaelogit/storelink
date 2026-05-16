import { Resend } from "resend";
import { NextResponse } from "next/server";
import { storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

    else if (type === "BUYER_CHECKOUT_RECEIPT") {
      const d = data || {};
      const shortId = String(d.orderShortId || "").replace(/[^\w-]/g, "") || "ORDER";
      const plainStore = String(d.storeName || "Store").slice(0, 48);
      subject = `Order confirmed #${shortId} — ${plainStore}`;
      previewText = "Your payment and order details.";
      title = "ORDER CONFIRMED";
      description = `Thank you for shopping on <strong>${escapeHtml(d.storeName)}</strong>. Your payment was received. Keep this email for your records.`;

      const items = Array.isArray(d.items) ? d.items : [];
      const itemRows = items
        .map((row: { name?: string; quantity?: number; unitPrice?: number }) => {
          const nm = escapeHtml(row.name);
          const qty = Number(row.quantity) || 0;
          const up = Math.floor(Number(row.unitPrice) || 0);
          const line = qty * up;
          return `<tr>
            <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;text-align:left;font-size:13px;color:#111827;">${nm}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;text-align:center;font-size:13px;color:#374151;">${qty}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;text-align:right;font-size:13px;color:#374151;">₦${up.toLocaleString()}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;text-align:right;font-size:13px;font-weight:800;color:#111827;">₦${line.toLocaleString()}</td>
          </tr>`;
        })
        .join("");

      const gross = Math.floor(Number(d.storeTotalGross) || 0);
      const coins = Math.floor(Number(d.coinsApplied) || 0);
      const paid = Math.floor(Number(d.amountPaid) || 0);
      const orderUrl = storefrontAbsolutePath(`/account/orders/${encodeURIComponent(String(d.orderId || ""))}`);

      customContent = `
        <div style="background-color:#f9fafb;border-radius:20px;padding:20px;border:1px solid #e5e7eb;margin-bottom:20px;text-align:left;">
          <p style="margin:0 0 8px 0;font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">Order</p>
          <p style="margin:0;font-size:14px;font-weight:900;color:#111827;">#${escapeHtml(d.orderShortId)}</p>
          <p style="margin:8px 0 0 0;font-size:11px;color:#6b7280;">Full ID: <span style="font-family:monospace;">${escapeHtml(d.orderId)}</span></p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border-collapse:collapse;">
          <thead><tr>
            <th align="left" style="padding:8px;font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;">Item</th>
            <th align="center" style="padding:8px;font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;">Qty</th>
            <th align="right" style="padding:8px;font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;">Each</th>
            <th align="right" style="padding:8px;font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;">Line</th>
          </tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:16px;padding:16px;margin-bottom:20px;text-align:left;">
          <p style="margin:0 0 6px 0;font-size:12px;color:#14532d;"><strong>Subtotal</strong> ₦${gross.toLocaleString()}</p>
          ${coins > 0 ? `<p style="margin:0 0 6px 0;font-size:12px;color:#14532d;"><strong>Store Coins</strong> −₦${coins.toLocaleString()}</p>` : ""}
          <p style="margin:0;font-size:14px;font-weight:900;color:#065f46;"><strong>Amount paid</strong> ₦${paid.toLocaleString()}</p>
        </div>
        <div style="background-color:#f9fafb;border-radius:16px;padding:16px;margin-bottom:24px;text-align:left;">
          <p style="margin:0 0 6px 0;font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;">Delivery</p>
          <p style="margin:0;font-size:13px;color:#374151;white-space:pre-wrap;">${escapeHtml(d.shippingAddress)}</p>
          <p style="margin:12px 0 0 0;font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;">Contact on order</p>
          <p style="margin:4px 0 0 0;font-size:13px;color:#374151;">${escapeHtml(d.customerName)}</p>
        </div>
        <div style="text-align:center;">
          <a href="${orderUrl}" style="display:inline-block;background-color:#10b981;color:#ffffff;padding:16px 28px;border-radius:14px;text-decoration:none;font-weight:900;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">View order in dashboard</a>
        </div>
      `;
    }

    else if (type === "CHECKOUT_ALERT") {
      const paid = Boolean(data?.paymentCompleted);
      const products = Array.isArray(data?.productName) ? data.productName : [data?.productName];
      const safeProducts = products.map((p: string) => escapeHtml(p)).filter(Boolean);
      const head = safeProducts[0] || (paid ? "New paid order" : "New order");
      const isMultiple = safeProducts.length > 1;

      if (paid) {
        subject = `Paid order: ${isMultiple ? `${safeProducts.length} items` : head} — ${escapeHtml(data?.storeName)}`;
        previewText = "Payment confirmed on StoreLink Shop.";
        title = "ORDER PAID";
        description = `Payment has been confirmed for <strong>${isMultiple ? `${safeProducts.length} items` : head}</strong> on <strong>${escapeHtml(data?.storeName)}</strong>. Fulfill from <strong>Dashboard → Orders</strong>.`;
      } else {
        subject = `Checkout started: ${isMultiple ? safeProducts.length + " items" : head}`;
        previewText = "A customer opened Paystack for this order.";
        title = "CHECKOUT IN PROGRESS";
        description = `A customer is paying for <strong>${isMultiple ? `${safeProducts.length} items` : head}</strong> on <strong>${escapeHtml(data?.storeName)}</strong>. Confirm funds in <strong>Dashboard → Orders</strong>.`;
      }

      const productList = safeProducts
        .map(
          (p: string) => `
        <div style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 700; text-align: left;">
          • ${p}
        </div>`,
        )
        .join("");

      const amt = Math.floor(Number(data?.orderAmount) || 0);
      const meta = `
        <div style="margin-bottom:20px;text-align:left;font-size:12px;color:#374151;line-height:1.6;">
          <p style="margin:0 0 4px 0;"><strong>Order ref</strong> #${escapeHtml(data?.orderShortId)}</p>
          <p style="margin:0 0 4px 0;"><strong>Amount (charged)</strong> ₦${amt.toLocaleString()}</p>
          <p style="margin:0 0 4px 0;"><strong>Buyer</strong> ${escapeHtml(data?.customerName)}</p>
          <p style="margin:0 0 4px 0;"><strong>Email</strong> ${escapeHtml(data?.customerEmail)}</p>
          <p style="margin:0;"><strong>Phone</strong> ${escapeHtml(data?.customerPhone)}</p>
        </div>`;

      customContent = `
        ${meta}
        <div style="background-color: #f9fafb; border-radius: 24px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
          <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; text-align: left;">Items</p>
          ${productList}
        </div>
        <div style="text-align: center;">
           <a href="${storefrontAbsolutePath("/dashboard/orders")}" style="display: inline-block; background-color: #111827; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Open orders</a>
        </div>
      `;
    } else {
      return NextResponse.json({ error: "Unsupported email type" }, { status: 400 });
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

    if (error) {
      const errorMessage =
        typeof error?.message === "string" && error.message.length > 0
          ? error.message
          : "Email provider rejected this request.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ success: true, id: resendData?.id });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}