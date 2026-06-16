const nodemailer = require('nodemailer');

const sendMail = async ({ to, subject, text, html }) => {
  // Check if SMTP settings are fully declared
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
    console.log(`WARNING: SMTP_HOST, SMTP_USER, or SMTP_PASS is not configured in your .env. Email was NOT sent via SMTP!`);
    console.log(`==================================================\n`);
  }
};

module.exports = { sendMail };
