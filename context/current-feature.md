# Current Feature: Forgot Password

## Status

In Progress

## Goals

- Add "Forgot password?" link to `/sign-in` page
- Build `/forgot-password` page — email input, submits to `POST /api/auth/forgot-password`
- `POST /api/auth/forgot-password` — generates reset token (stored in `VerificationToken` with `identifier = "reset:{email}"`), sends reset email via Resend. Always returns the same success message (don't reveal if email exists)
- Build `/reset-password?token=xxx` page — new password + confirm password fields, submits to `POST /api/auth/reset-password`
- `POST /api/auth/reset-password` — validates token, hashes new password, updates user, deletes token, returns success

## Notes

- **Token prefix**: use `identifier = "reset:{email}"` to distinguish reset tokens from email verification tokens (which use `identifier = "{email}"`)
- **Token TTL**: 1 hour (shorter than email verification's 24h)
- **Security**: never reveal whether an email is registered — always respond with "If an account exists, a reset link has been sent"
- **Scope**: only applies to credentials users (those with a `password` field). GitHub OAuth users have no password to reset — no need to handle that case explicitly
- **Resend**: reuse `sendVerificationEmail` pattern from `src/lib/email.ts`, add a `sendPasswordResetEmail` helper alongside it

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
- Email Verification - Resend email on register, verify-email endpoint, block unverified credentials sign-in
- Email Verification Feature Flag - REQUIRE_EMAIL_VERIFICATION env var, centralised in feature-flags.ts
