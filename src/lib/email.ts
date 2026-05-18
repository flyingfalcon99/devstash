import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl =
    process.env.AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`

  const { error } = await resend.emails.send({
    from: "DevStash <onboarding@resend.dev>",
    to: email,
    subject: "Verify your DevStash email",
    html: `
      <p>Thanks for signing up for DevStash!</p>
      <p>Click the link below to verify your email address. This link expires in 24 hours.</p>
      <p><a href="${verifyUrl}">Verify my email</a></p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
  })

  if (error) throw new Error(`Failed to send verification email: ${error.message}`)
}
