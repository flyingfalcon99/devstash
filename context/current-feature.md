# Current Feature: Profile Page

## Status

In Progress

## Goals

- Create `/profile` route — protected, server-fetched user data + stats
- Display user info: name, email, avatar (GitHub image or initials), account creation date
- Show usage stats: total items, total collections, breakdown by item type (snippets, prompts, notes, commands, links, files, images)
- Change password section — visible only for credentials users (those with `password` field set, i.e. not GitHub-only OAuth)
- Delete account with confirmation dialog — cascades all user data

## Notes

- Avatar logic same as sidebar: `user.image` → GitHub photo, else initials from name/email
- Change password: reuse `POST /api/auth/reset-password` pattern (hash + update), no token needed since user is already authenticated — create a separate `POST /api/profile/change-password` route
- Delete account: `DELETE /api/profile` — deletes user record, cascades all data, then signs out and redirects to `/sign-in`
- Confirmation dialog for delete: no ShadCN dialog installed yet — use a simple inline confirmation state
- Fetch stats server-side using existing `getDashboardStats` and a new query for item type breakdown
- Route protection via `auth()` in the page (same pattern as dashboard layout)

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
- Forgot Password - reset token (1h, reset: prefix), /forgot-password and /reset-password pages, Resend email
