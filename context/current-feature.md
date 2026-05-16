# Current Feature: Codebase Audit Fixes

## Status

In Progress

## Goals

Resolve all issues surfaced in the 2026-05-16 code-scanner audit, in priority order. Authentication is not yet implemented and is excluded from scope.

### HIGH — Fix immediately

1. **Broken sidebar item-type URLs** (`src/components/layout/sidebar.tsx:73`)
   - Remove capitalization of `type.name` in `getSidebarItemTypes()` (`src/lib/db/items.ts`)
   - Apply `className="capitalize"` in the sidebar JSX for display only
   - Ensure hrefs are built from the raw lowercase DB value (e.g. `/items/snippets`)
   - Also fix the Pro badge condition on line 86 that depends on capitalized names

2. **`DATABASE_URL` coerced to string `"undefined"`** (`src/lib/prisma.ts:5`)
   - Replace the template literal with a direct assignment
   - Add an explicit guard: `if (!connectionString) throw new Error("DATABASE_URL is not set")`

### MEDIUM — Fix after HIGH issues

3. **No error handling on DB functions** (`src/lib/db/collections.ts`, `src/lib/db/items.ts`)
   - Wrap all Prisma calls in `try/catch`
   - Return typed error states or re-throw with descriptive messages

4. **`getDemoUser` called twice per dashboard page load** (`src/app/(dashboard)/layout.tsx:10`, `src/app/(dashboard)/dashboard/page.tsx:34`)
   - Fetch user once in the layout, pass `userId` or user object as a prop to child pages

5. **`any` type on icon map** (`src/app/(dashboard)/dashboard/page.tsx:42`)
   - Replace `any` with `LucideIcon` from `lucide-react`

6. **Over-fetching in collections queries** (`src/lib/db/collections.ts:25–93`)
   - Use Prisma `_count` for item counts instead of fetching full item payloads
   - Use `take: 1` + targeted `select` to retrieve the primary item type color

7. **`dotenv/config` side-effect import in Prisma singleton** (`src/lib/prisma.ts:1`)
   - Remove `import "dotenv/config"` — Next.js handles `.env` loading automatically

### LOW — Address as time allows

8. **N+1 `findFirst` loop in seed script** (`prisma/seed.ts:34–42`)
   - Replace per-type `findFirst` calls with a single `findMany`, then build an ID map

9. **`iconMap` duplicated in two files** (`src/app/(dashboard)/dashboard/page.tsx:21–29`, `src/components/layout/sidebar.tsx:26–34`)
    - Extract to `src/lib/constants/item-types.ts` and import from both files

## Notes

- All issues come from the automated code-scanner audit run on 2026-05-16.
- Items 1 and 2 (HIGH) should be fixed before any new item-type routes are added — item 1 in particular is a guaranteed regression the moment those routes land.
- Item 4 (duplicate `getDemoUser`) will naturally resolve once real auth is in place — the fix here is a temporary consolidation to avoid double queries with the demo user.

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
