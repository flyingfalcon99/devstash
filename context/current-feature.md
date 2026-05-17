# Current Feature: Auth UI - Sign In, Register & Sign Out

## Status

In Progress

## Goals

- Build `/sign-in` page: email/password fields, "Sign in with GitHub" button, link to register, error display
- Build `/register` page: name/email/password/confirmPassword fields, validation, POST to `/api/auth/register`, redirect to sign-in on success
- Update `auth.ts` to point custom `pages.signIn` to `/sign-in`
- Update sidebar bottom: user avatar (GitHub image or initials fallback), user name, dropdown with "Sign out" and profile link

## Notes

**Avatar logic:**
- `user.image` set → show GitHub avatar
- No image → generate initials from name (e.g. "Brad Traversy" → "BT")
- Create a reusable `UserAvatar` component covering both cases

**Sidebar dropdown:** clicking avatar opens popover/dropdown with "Sign out" action and link to `/profile`

**Sign-in redirect:** update `auth.ts` with `pages: { signIn: '/sign-in' }` so proxy redirects go to custom page instead of `/api/auth/signin`

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
