# Current Feature: Email Verification on Register

## Status

In Progress

## Goals

- Install `resend` package
- On registration, generate a verification token, store it in `VerificationToken` table, and send a verification email via Resend
- Create `GET /api/auth/verify-email?token=xxx` endpoint — validates token, sets `user.emailVerified`, deletes token, redirects to sign-in
- Block unverified users from signing in via Credentials (return error "Please verify your email first")
- Update register success toast/message to say "Check your email to verify your account"

## Notes

- **Resend**: `RESEND_API_KEY` already in `.env`. From address: `onboarding@resend.dev`
- **VerificationToken model** already in Prisma schema (`identifier`, `token`, `expires`, `@@unique([identifier, token])`)
- **User.emailVerified** field already on User model (`DateTime?`)
- Token should expire after 24 hours
- GitHub OAuth users skip email verification (no `emailVerified` check for OAuth flow)
- Use `crypto.randomUUID()` for token generation — no extra deps needed

## History

<!-- Keep this updated. Earliest to latest -->

- Initial Next.js setup
- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: ShadCN init, dark mode, /dashboard route, top bar, sidebar/main placeholders
- Dashboard UI Phase 2: Collapsible sidebar, types/collections links, mobile drawer, user avatar area, UI polish
- Dashboard UI Phase 3: Main dashboard area with stats, recent collections, pinned items, and recent items grids
- Prisma + Neon PostgreSQL Setup
- Seed Sample Data
- Dashboard Collections
- Dashboard Items
- Stats & Sidebar
- Add Pro Badge To Sidebar
- Codebase Audit Fixes
- Auth Setup - NextAuth v5 + GitHub OAuth (split config, Prisma adapter, proxy route protection)
- Auth Credentials - Email/Password provider with bcrypt, registration API route
- Auth UI - Custom sign-in/register pages, sidebar user avatar + sign-out dropdown, sonner toasts
