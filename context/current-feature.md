# Current Feature

## Status

Not Started

## Goals

<!-- Add goals here -->

## Notes

<!-- Add notes here -->

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
- Profile Page - user info, usage stats, change password (credentials only), delete account with confirmation
- Rate Limiting for Auth - sliding-window via Upstash Redis on register, forgot-password, reset-password, and login; 429 + Retry-After header; toast notifications; fail-open on infra errors
- Items List View - dynamic /items/[type] route, two-column ItemCard grid with left border colored by type, 404 for unknown types
- Vitest Setup - unit testing for server actions and utilities; node environment; npm test / test:watch scripts
- Item List View 3-Column Layout - responsive grid updated to 1-col mobile, 2-col md, 3-col lg+
- Item Drawer - right-side Sheet drawer on ItemCard click; fetches full item via GET /api/items/[id]; header, action bar (UI-only), scrollable detail body; works on dashboard and items list pages
- Item Drawer Edit Mode - inline edit mode in drawer; updateItem server action with Zod validation; type-specific fields; tag replace; router.refresh() + re-fetch on save; toast on success/error
- Item Delete - AlertDialog confirmation on trash button; deleteItem server action; close drawer + toast + router.refresh() on success
- Logo Link - DevStash logo/name in top bar links to /dashboard
- Item Create - Dialog modal from top bar; type selector; type-specific fields; createItem server action with Zod + conditional URL validation; 25 tests passing
- Code Editor - Monaco editor (vs-dark, macOS dots, copy + language header) for snippet/command types in drawer and create dialog; NewItemButton accepts defaultType/label; items type page shows Add [Type] button pre-selecting that type
- Markdown Editor - MarkdownEditor with Write/Preview tabs for note/prompt types; react-markdown + remark-gfm; @tailwindcss/typography prose styling; thin-scrollbar utility matching CodeEditor; readonly shows Preview only
- File & Image Upload - Cloudflare R2 storage; drag-and-drop FileUpload with XHR progress; /api/upload with type/size validation; /api/files/[...key] authenticated download proxy; image preview + file download in ItemDrawer; R2 cleanup on delete; 18 tests passing
- Image Gallery View - 3-column thumbnail gallery on /items/images; aspect-video + object-cover; 5% hover zoom with 300ms transition; all other type pages unaffected
- File List View - single-column list on /items/files; extension-based icons; name, size, date columns; download button with stopPropagation; responsive stacked meta on mobile
