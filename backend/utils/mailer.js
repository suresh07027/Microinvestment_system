import nodemailer from 'nodemailer'

let cachedTransporter = null
let smtpVerified = false

/**
 * Builds (and caches) a nodemailer transporter from env vars.
 * Returns null if SMTP is not configured, so callers can fall back
 * to logging the email to the console during local development.
 */
function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }

  return cachedTransporter
}

/**
 * Sends the password reset email. If SMTP credentials are not configured
 * in .env, the reset link is logged to the server console instead so
 * local development / testing still works end-to-end.
 */
export async function sendPasswordResetEmail({ to, name, resetUrl, expiresInMinutes }) {
  const transporter = getTransporter()

  const subject = 'Reset your MicroInvest password'
  const text = `Hi ${name || ''},

We received a request to reset your MicroInvest password.

Reset your password using the link below (expires in ${expiresInMinutes} minutes):
${resetUrl}

If you didn't request this, you can safely ignore this email — your password will remain unchanged.

— MicroInvest`

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; background:#0A0C18; padding:32px; color:#F5F6FA;">
      <div style="max-width:480px;margin:0 auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;">
        <h2 style="margin:0 0 12px;color:#F5F6FA;">Reset your password</h2>
        <p style="color:#9CA3C2;font-size:14px;line-height:1.6;">
          Hi ${name || 'there'}, we received a request to reset the password for your MicroInvest account.
          This link will expire in <strong>${expiresInMinutes} minutes</strong>.
        </p>
        <a href="${resetUrl}" style="display:inline-block;margin:20px 0;padding:12px 24px;border-radius:12px;
          background:linear-gradient(135deg,#6366F1,#8B5CF6,#3B82F6);color:#fff;text-decoration:none;font-weight:600;">
          Reset Password
        </a>
        <p style="color:#767E9E;font-size:12px;line-height:1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <span style="word-break:break-all;">${resetUrl}</span>
        </p>
        <p style="color:#767E9E;font-size:12px;margin-top:24px;">
          Didn't request this? You can safely ignore this email — your password won't change.
        </p>
      </div>
    </div>
  `

  if (!transporter) {
    // Dev fallback: no SMTP configured, log the link so the flow is still testable.
    console.log('====================================')
    console.log('📧 [DEV MODE] SMTP not configured — password reset email not actually sent.')
    console.log(`   To: ${to}`)
    console.log(`   Reset URL: ${resetUrl}`)
    console.log(`   Expires in: ${expiresInMinutes} minutes`)
    console.log('   Set SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS in backend/.env to send real emails.')
    console.log('====================================')
    return { delivered: false }
  }

  try {
    if (!smtpVerified) {
      await transporter.verify()
      smtpVerified = true
    }
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"MicroInvest" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    })
    return { delivered: true }
  } catch (err) {
    console.error('❌ Failed to send password reset email:', err.message)
    // Still log the link as a fallback so the account owner isn't locked out
    // just because the SMTP provider had an issue.
    console.log(`   Reset URL (fallback): ${resetUrl}`)
    return { delivered: false, error: err.message }
  }
}
