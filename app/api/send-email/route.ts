import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, type, code } = await request.json();

    let subject = '';
    let previewText = '';
    let mainColor = '#10b981'; // Emerald for Verify
    let title = '';
    let description = '';

    // Switch Logic for Templates
    if (type === 'VERIFY_SIGNUP') {
      subject = `🏰 ${code} is your Storelink verification code`;
      previewText = 'Verify your account to start building your empire.';
      title = 'VERIFY YOUR IDENTITY';
      description = 'Welcome to Storelink. Use the secure code below to verify your email and launch your storefront.';
      mainColor = '#10b981';
    } else if (type === 'PASSWORD_RESET') {
      subject = `🔒 ${code} is your password reset code`;
      previewText = 'Reset your Storelink password securely.';
      title = 'PASSWORD RESET';
      description = 'We received a request to reset your password. If this was you, use the secure code below to proceed.';
      mainColor = '#f59e0b'; // Amber for Security/Warning
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
                  
                  <tr>
                    <td align="center" style="padding: 40px 40px 20px 40px;">
                      <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #111827; letter-spacing: -0.05em; text-transform: uppercase;">
                        STORELINK <span style="color: ${mainColor}; italic">EMPIRE</span>
                      </h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 40px 40px 40px; text-align: center;">
                      <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 30px;"></div>
                      
                      <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.1em;">
                        ${title}
                      </h2>
                      
                      <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.6; color: #6b7280; font-weight: 500;">
                        ${description}
                      </p>

                      <div style="background-color: #f9fafb; border-radius: 24px; padding: 32px; border: 2px dashed #e5e7eb; margin-bottom: 32px;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #111827;">
                          ${code}
                        </span>
                      </div>

                      <p style="margin: 0; font-size: 11px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">
                        Expires in 15 minutes
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="background-color: #111827; padding: 24px; text-align: center;">
                      <p style="margin: 0; font-size: 10px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 0.2em;">
                        &copy; 2026 Storelink Engine • Lagos, Nigeria
                      </p>
                    </td>
                  </tr>
                </table>

                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; margin-top: 24px;">
                  <tr>
                    <td align="center">
                      <p style="font-size: 12px; color: #9ca3af; font-weight: 500;">
                        Questions? Reply to this email or visit <a href="https://storelink.ng/help" style="color: #111827; text-decoration: none; font-weight: 700;">Support</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Storelink <hello@storelink.ng>',
      to: [email],
      subject: subject,
      html: html,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ success: true, id: data?.id });

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}