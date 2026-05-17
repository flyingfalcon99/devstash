import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

export const proxy = auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const signIn = new URL("/sign-in", req.nextUrl.origin)
    return Response.redirect(signIn)
  }
})

export const config = {
  matcher: ["/dashboard/:path*"],
}
