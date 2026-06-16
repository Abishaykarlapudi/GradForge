const nodemailer = require('nodemailer');

const sendMail = async ({ to, subject, text, html }) => {
  // 1. Try Resend HTTP API (Port 443 HTTPS - Never blocked by Render)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'onboarding@resend.dev',
          to: [to],
          subject: subject,
          html: html,
          text: text
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`[RESEND HTTP EMAIL] Email successfully sent to ${to} (Message ID: ${data.id})`);
        return;
      } else {
        console.error(`[RESEND HTTP EMAIL ERROR] Resend rejected request:`, data);
        if (data.name === 'validation_error' || data.message?.includes('testing emails')) {
          console.warn(`\n================== [RESEND SANDBOX LIMITATION] ==================`);
          console.warn(`WARNING: Resend is in Sandbox mode. You can ONLY send emails to the address you registered with (e.g. gradforge4@gmail.com).`);
          console.warn(`To send emails to other users, verify your domain at: https://resend.com/domains`);
          console.warn(`==================================================================\n`);
        }
      }
    } catch (error) {
      console.error(`[RESEND HTTP EMAIL ERROR] Failed to send via Resend API:`, error.message);
    }
  }

  // 2. Try SendGrid HTTP API (Port 443 HTTPS - Never blocked by Render)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }]
            }
          ],
          from: {
            email: process.env.SMTP_FROM_EMAIL || 'noreply@gradforge.com',
            name: process.env.SMTP_FROM_NAME || 'GradForge'
          },
          subject: subject,
          content: [
            {
              type: 'text/plain',
              value: text
            },
            {
              type: 'text/html',
              value: html
            }
          ]
        })
      });

      if (response.ok) {
        console.log(`[SENDGRID HTTP EMAIL] Email successfully sent to ${to}`);
        return;
      } else {
        const errData = await response.json();
        console.error(`[SENDGRID HTTP EMAIL ERROR] SendGrid rejected request:`, errData);
      }
    } catch (error) {
      console.error(`[SENDGRID HTTP EMAIL ERROR] Failed to send via SendGrid API:`, error.message);
    }
  }

  // 3. Fallback to standard Nodemailer SMTP (Port 587/465 - Blocked on Render by default)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"GradForge" <noreply@gradforge.com>',
        to,
        subject,
        text,
        html
      });
      console.log(`[SMTP EMAIL] Email successfully sent to ${to}`);
    } catch (error) {
      console.error(`[SMTP EMAIL ERROR] Failed to send email via SMTP:`, error.message);
    }
  } else {
    console.log(`\n================== [MOCK EMAIL] ==================`);
    console.log(`TO:      ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CONTENT: ${text}`);
    console.log(`WARNING: No Email API Key (RESEND_API_KEY, SENDGRID_API_KEY) or SMTP credentials (SMTP_HOST) configured. Email was NOT sent!`);
    console.log(`==================================================\n`);
  }
};

module.exports = { sendMail };
