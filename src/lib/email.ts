import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl =
    process.env.AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`

  const { error } = await resend.emails.send({
    from: "DevNest <onboarding@resend.dev>",
    to: email,
    subject: "Verify your DevNest email",
    html: `
      <p>Thanks for signing up for DevNest!</p>
      <p>Click the link below to verify your email address. This link expires in 24 hours.</p>
      <p><a href="${verifyUrl}">Verify my email</a></p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
  })

  if (error) throw new Error(`Failed to send verification email: ${error.message}`)
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl =
    process.env.AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  const resetUrl = `${baseUrl}/reset-password?token=${token}`

  const { error } = await resend.emails.send({
    from: "DevNest <onboarding@resend.dev>",
    to: email,
    subject: "Reset your DevNest password",
    html: `
      <p>You requested a password reset for your DevNest account.</p>
      <p>Click the link below to set a new password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">Reset my password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  })

  if (error) throw new Error(`Failed to send password reset email: ${error.message}`)
}
