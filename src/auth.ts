import NextAuth, { CredentialsSignin } from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { emailVerificationEnabled } from "@/lib/feature-flags"
import authConfig from "@/auth.config"

class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified"
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  ...authConfig,
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user?.password) return null

        const match = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!match) return null

        if (emailVerificationEnabled && !user.emailVerified) throw new EmailNotVerifiedError()

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Stamp passwordChangedAt into the token at sign-in
        const u = user as { passwordChangedAt?: Date | null }
        token.passwordChangedAt = u.passwordChangedAt?.getTime() ?? null
      } else if (token.sub) {
        // On every subsequent auth() call, invalidate if password changed since issue
        const fresh = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { passwordChangedAt: true },
        })
        if (!fresh) return null
        const changedAt = fresh.passwordChangedAt?.getTime() ?? null
        if (changedAt !== (token.passwordChangedAt ?? null)) return null
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.sub!
      return session
    },
  },
})
