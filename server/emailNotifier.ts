import nodemailer from 'nodemailer';

export interface ContactNotificationPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
  clientIp?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  methodsAttempted: string[];
  successfulMethods: string[];
  error?: string;
  note?: string;
}

const PRIMARY_RECIPIENT = process.env.ADMIN_EMAIL || 'yashgayake900@gmail.com';

/**
 * Dispatches email notifications to Yash Gayake (yashgayake900@gmail.com)
 * Uses a multi-tiered approach:
 * 1. SMTP / Gmail App Password via Nodemailer (if configured in env)
 * 2. FormSubmit Cloud Relay (direct deliverability to yashgayake900@gmail.com)
 * 3. Resend API (if RESEND_API_KEY configured)
 * 4. Webhook Relay (if CONTACT_WEBHOOK_URL configured)
 */
export async function sendContactNotificationEmail(
  payload: ContactNotificationPayload
): Promise<EmailDispatchResult> {
  const result: EmailDispatchResult = {
    success: false,
    methodsAttempted: [],
    successfulMethods: []
  };

  const recipientEmail = PRIMARY_RECIPIENT;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
  const emailSubject = `[Portfolio ${payload.category || 'Message/Feedback'}] ${payload.subject} (from ${payload.name})`;

  const plainTextBody = `
New Contact Message / Feedback Received on Yash Gayake's Portfolio Platform
-------------------------------------------------------------------------
Sender Name: ${payload.name}
Sender Email: ${payload.email}
Category: ${payload.category || 'Feedback / General Message'}
Date & Time: ${timestamp}
IP Address: ${payload.clientIp || 'Undisclosed'}

Subject:
${payload.subject}

Message / Feedback Content:
-------------------------------------------------------------------------
${payload.message}
-------------------------------------------------------------------------

To reply directly to ${payload.name}, simply reply to this email or write to ${payload.email}.
Delivered to: ${recipientEmail}
`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0a; color: #e5e5e5; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #171717; border: 1px solid #262626; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #06b6d4, #3b82f6); padding: 24px 32px; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 32px; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 9999px; background: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3); margin-bottom: 20px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .meta-table td { padding: 8px 0; font-size: 13px; border-bottom: 1px solid #262626; }
    .meta-label { color: #a3a3a3; width: 130px; font-weight: 500; }
    .meta-value { color: #f5f5f5; font-weight: 600; }
    .meta-value a { color: #22d3ee; text-decoration: none; }
    .message-box { background: #0a0a0a; border: 1px solid #262626; border-radius: 12px; padding: 20px; font-size: 14px; line-height: 1.6; color: #fafafa; white-space: pre-wrap; margin-bottom: 28px; }
    .action-btn { display: inline-block; background: #06b6d4; color: #0a0a0a; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 10px; text-decoration: none; }
    .footer { padding: 20px 32px; background: #0f0f0f; border-top: 1px solid #262626; font-size: 11px; color: #737373; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Message / Feedback Received</h1>
      <p>Yash Gayake Portfolio &amp; Engineering Platform</p>
    </div>
    <div class="content">
      <div class="badge">${payload.category || 'FEEDBACK / INQUIRY'}</div>
      
      <table class="meta-table">
        <tr>
          <td class="meta-label">From:</td>
          <td class="meta-value">${escapeHtml(payload.name)}</td>
        </tr>
        <tr>
          <td class="meta-label">Email:</td>
          <td class="meta-value"><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td>
        </tr>
        <tr>
          <td class="meta-label">Subject:</td>
          <td class="meta-value">${escapeHtml(payload.subject)}</td>
        </tr>
        <tr>
          <td class="meta-label">Date &amp; Time:</td>
          <td class="meta-value">${timestamp}</td>
        </tr>
      </table>

      <div style="font-size: 12px; font-weight: 600; color: #a3a3a3; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
        Message Content:
      </div>
      <div class="message-box">${escapeHtml(payload.message)}</div>

      <div style="text-align: center;">
        <a class="action-btn" href="mailto:${escapeHtml(payload.email)}?subject=Re: ${encodeURIComponent(payload.subject)}">
          Reply to ${escapeHtml(payload.name)}
        </a>
      </div>
    </div>
    <div class="footer">
      Sent directly to <strong>${recipientEmail}</strong> from your official portfolio contact channel.
    </div>
  </div>
</body>
</html>
`;

  // ----------------------------------------------------
  // METHOD 1: Nodemailer (SMTP / Gmail App Password)
  // ----------------------------------------------------
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  if (smtpUser && smtpPass) {
    result.methodsAttempted.push('nodemailer-smtp');
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"Portfolio Contact Form" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: payload.email,
        subject: emailSubject,
        text: plainTextBody,
        html: htmlBody
      });

      result.successfulMethods.push('nodemailer-smtp');
      result.success = true;
      console.log(`[EmailNotifier] Successfully sent email to ${recipientEmail} via SMTP`);
    } catch (err: any) {
      console.warn('[EmailNotifier] SMTP sending failed:', err.message);
    }
  }

  // ----------------------------------------------------
  // METHOD 2: FormSubmit Relay (Deliver directly to yashgayake900@gmail.com)
  // ----------------------------------------------------
  result.methodsAttempted.push('formsubmit-relay');
  try {
    const appOrigin = process.env.APP_URL || 'https://yashgayake-portfolio.run.app';
    const formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`;
    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': appOrigin,
        'Referer': `${appOrigin}/contact`,
        'User-Agent': 'Yash-Portfolio-Server/1.0'
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        _replyto: payload.email,
        _subject: emailSubject,
        category: payload.category || 'Feedback / Message',
        message: payload.message,
        receivedAt: timestamp,
        _template: 'table',
        _captcha: 'false'
      })
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok || (data && (data.success === 'true' || data.message?.includes('Activation')))) {
      result.successfulMethods.push('formsubmit-relay');
      result.success = true;
      if (data.message?.includes('Activation')) {
        result.note = 'FormSubmit activation email sent to yashgayake900@gmail.com. Please check your inbox and click "Activate Form" once.';
      }
      console.log(`[EmailNotifier] FormSubmit relayed message to ${recipientEmail}:`, data.message || 'Sent');
    } else {
      console.warn('[EmailNotifier] FormSubmit relay responded with non-ok status:', data);
    }
  } catch (err: any) {
    console.warn('[EmailNotifier] FormSubmit relay failed:', err.message);
  }

  // ----------------------------------------------------
  // METHOD 3: Webhook (Discord / Slack / Make / Zapier)
  // ----------------------------------------------------
  if (process.env.CONTACT_WEBHOOK_URL) {
    result.methodsAttempted.push('webhook');
    try {
      await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `📬 **New Portfolio Message / Feedback**\n**From:** ${payload.name} (${payload.email})\n**Subject:** ${payload.subject}\n**Message:**\n${payload.message}`
        })
      });
      result.successfulMethods.push('webhook');
      result.success = true;
    } catch (err: any) {
      console.warn('[EmailNotifier] Webhook relay failed:', err.message);
    }
  }

  // ----------------------------------------------------
  // METHOD 4: Resend API (if RESEND_API_KEY set)
  // ----------------------------------------------------
  if (process.env.RESEND_API_KEY) {
    result.methodsAttempted.push('resend-api');
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: [recipientEmail],
          reply_to: payload.email,
          subject: emailSubject,
          html: htmlBody,
          text: plainTextBody
        })
      });
      if (resendRes.ok) {
        result.successfulMethods.push('resend-api');
        result.success = true;
      }
    } catch (err: any) {
      console.warn('[EmailNotifier] Resend dispatch failed:', err.message);
    }
  }

  // Fallback: If FormSubmit or SMTP completed, success is true
  if (result.successfulMethods.length > 0) {
    result.success = true;
  }

  return result;
}

function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendOtpNotificationEmail(
  targetEmail: string,
  targetName: string,
  otpCode: string,
  portalType: 'Administrator' | 'Student'
): Promise<EmailDispatchResult> {
  return sendContactNotificationEmail({
    name: 'Security Auth System',
    email: targetEmail,
    category: 'Security OTP Alert',
    subject: `Password Reset Verification Code: ${otpCode}`,
    message: `Hello ${targetName},\n\nA password reset request was initiated for your ${portalType} account on Yash Gayake's platform.\n\nYour 6-Digit One-Time Password (OTP) is:\n\n👉  ${otpCode}  👈\n\nThis OTP is valid for 10 minutes.\nIf you did not initiate this request, please ensure your account credentials are kept safe.\n\nBest regards,\nYash Gayake Platform Security Team`
  });
}

