import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  const origin = req.nextUrl.origin

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid-token", origin))
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } })

  if (!record) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid-token", origin))
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } })
    return NextResponse.redirect(new URL("/sign-in?error=token-expired", origin))
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  })

  await prisma.verificationToken.delete({ where: { token } })

  return NextResponse.redirect(new URL("/sign-in?verified=true", origin))
}
