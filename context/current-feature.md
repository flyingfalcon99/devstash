# Current Feature

Dashboard Collections

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Replace dummy collection data in the main dashboard area with actual data from the database using Prisma.
- Create `src/lib/db/collections.ts` with data fetching functions.
- Fetch collections directly in the server component.
- Collection card border color derived from most-used content type in that collection.
- Show small icons of all types in that collection.
- Update collection stats display.
- Keep the current design.

## Notes

<!-- Any extra notes -->

- Do not add the items underneath yet.
- Reference `@context/screenshots/dashboard-ui-main.png` if needed, but layout and design is already there.

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
