# Current Feature: Email Verification Feature Flag

## Status

In Progress

## Goals

- Create `src/lib/feature-flags.ts` — single place to read `REQUIRE_EMAIL_VERIFICATION` env var (default `false`)
- Update register route — when flag is off, skip token + email, auto-set `emailVerified: new Date()`
- Update `auth.ts` Credentials — when flag is off, skip `emailVerified` check
- Add `REQUIRE_EMAIL_VERIFICATION=false` to `.env.local`

## Notes

- Env var: `REQUIRE_EMAIL_VERIFICATION=true` enables verification, anything else (or unset) disables it
- Centralised in `feature-flags.ts` so toggling is one-line, not scattered across files
- When disabled, newly registered users are immediately verified and can sign in straight away

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
