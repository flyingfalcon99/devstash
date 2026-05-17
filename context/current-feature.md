# Current Feature: Auth Setup - NextAuth + GitHub Provider

## Status

In Progress

## Goals

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Set up split auth config pattern for edge compatibility
- Add GitHub OAuth provider
- Protect `/dashboard/*` routes using Next.js 16 proxy
- Redirect unauthenticated users to sign-in

## Notes

**Files to create:**
- `src/auth.config.ts` — Edge-compatible config (providers only, no adapter)
- `src/auth.ts` — Full config with Prisma adapter and JWT strategy
- `src/app/api/auth/[...nextauth]/route.ts` — Export handlers from auth.ts
- `src/proxy.ts` — Route protection with redirect logic (must be at `src/proxy.ts`)
- `src/types/next-auth.d.ts` — Extend Session type with user.id

**Key gotchas:**
- Use `next-auth@beta`, not `@latest` (that installs v4)
- Use named export `export const proxy = auth(...)` in proxy.ts, not default export
- Use `session: { strategy: 'jwt' }` with split config pattern
- Don't set custom `pages.signIn` — use NextAuth's default page

**Env vars needed:** `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

**Use Context7 to verify latest NextAuth v5 conventions before implementing.**

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
