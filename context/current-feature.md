# Current Feature: Auth Credentials - Email/Password Provider

## Status

In Progress

## Goals

- Add Credentials provider to `auth.config.ts` (placeholder `authorize: () => null`)
- Override Credentials in `auth.ts` with bcrypt validation
- Create `POST /api/auth/register` route (name, email, password, confirmPassword)
- Registration validates passwords match, checks for existing user, hashes with bcryptjs, creates user
- Verify GitHub OAuth still works alongside credentials

## Notes

**Split config pattern for Credentials:**
- `auth.config.ts`: placeholder `authorize: () => null` (edge-safe)
- `auth.ts`: real `authorize` with bcrypt (non-edge, has Prisma access)

**Password field:** Already on User model (`password String?`)

**Register endpoint:** `POST /api/auth/register` — returns JSON success/error response

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
