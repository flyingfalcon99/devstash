import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"

const RESET_PREFIX = "reset:"

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  // Always return the same response — never reveal if the email exists
  const ok = NextResponse.json(
    { success: true },
    { status: 200 }
  )

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user?.password) return ok // No credentials account for this email

  // Remove any existing reset token for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: `${RESET_PREFIX}${email}` },
  })

  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.verificationToken.create({
    data: { identifier: `${RESET_PREFIX}${email}`, token, expires },
  })

  await sendPasswordResetEmail(email, token)

  return ok
}
