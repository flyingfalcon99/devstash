import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const RESET_PREFIX = "reset:"

export async function POST(req: NextRequest) {
  const { token, password, confirmPassword } = await req.json()

  if (!token || !password || !confirmPassword) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } })

  if (!record || !record.identifier.startsWith(RESET_PREFIX)) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 })
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } })
    return NextResponse.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 })
  }

  const email = record.identifier.slice(RESET_PREFIX.length)
  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, passwordChangedAt: new Date() },
  })

  await prisma.verificationToken.delete({ where: { token } })

  return NextResponse.json({ success: true }, { status: 200 })
}
