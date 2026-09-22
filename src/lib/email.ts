import nodemailer from "nodemailer";

/**
 * OmniService AI — Email Delivery Service
 * Uses Google App Password SMTP transport for secure transactional OTP and alerts.
 */

export function getEmailTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || "volcanic.digitalsolutions@gmail.com";
  const pass = (process.env.SMTP_PASSWORD || "wyyz jtmv rvkn xote").replace(/\s+/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOtpEmail(
  toEmail: string,
  otpCode: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = getEmailTransporter();
    const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "volcanic.digitalsolutions@gmail.com";

    const mailOptions = {
      from: `"OmniService Security" <${senderEmail}>`,
      to: toEmail.trim(),
      subject: `Your OmniService Login Verification Code: ${otpCode}`,
      text: `Your OmniService AI verification code is: ${otpCode}. This code is valid for 10 minutes. If you did not request this code, please ignore this email.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OmniService AI Verification</title>
        </head>
        <body style="margin:0;padding:0;background-color:#fff7ed;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;">
            <tr>
              <td align="center" style="padding:40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:540px;background-color:#ffffff;border-radius:24px;border:1px solid #fed7aa;box-shadow:0 10px 25px -5px rgba(240,90,40,0.08);overflow:hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="padding:32px 36px;background:linear-gradient(135deg, #fff5eb 0%, #ffffff 100%);border-bottom:1px solid #ffedd5;">
                      <span style="font-size:20px;font-weight:900;color:#c2410c;letter-spacing:-0.5px;">
                        OmniService <span style="color:#f05a28;">AI</span>
                      </span>
                      <p style="margin:4px 0 0 0;font-size:12px;color:#78716c;font-weight:600;">
                        Secure Identity &amp; Portal Authentication
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:36px;">
                      <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:#1c1917;">
                        Your Login Verification Code
                      </h2>
                      <p style="margin:0 0 24px 0;font-size:14px;color:#57534e;line-height:1.6;">
                        Please enter this 6-digit one-time passcode to verify your email and securely access your OmniService account.
                      </p>

                      <!-- OTP Box -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding:24px;background:#fffaf5;border:2px dashed #fdba74;border-radius:16px;">
                            <span style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:900;letter-spacing:8px;color:#ea580c;">
                              ${otpCode}
                            </span>
                            <p style="margin:8px 0 0 0;font-size:12px;color:#a8a29e;font-weight:600;">
                              Valid for 10 minutes • Do not share this code
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:28px 0 0 0;font-size:12px;color:#78716c;line-height:1.5;">
                        This login code was requested for <strong>${toEmail}</strong>. If you did not initiate this request, your account remains secure and no action is needed.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 36px;background-color:#fafaf9;border-top:1px solid #f5f5f4;text-align:center;">
                      <p style="margin:0;font-size:11px;color:#a8a29e;">
                        OmniService AI • Ameerpet, Hyderabad Pilot • Volcanic.World
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("Failed to send OTP email:", err);
    return { success: false, error: err.message || "Failed to dispatch email via SMTP" };
  }
}
