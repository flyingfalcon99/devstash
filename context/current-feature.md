# Current Feature

Stats & Sidebar

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Show the stats in the main dashboard area from the database.
- Display system item types in the sidebar with their icons, linking to `/items/[typename]`.
- Display actual collection data from the database in the sidebar.
- Add a "View all collections" link under the collections list that goes to `/collections`.
- Keep star icons for favorite collections.
- For recent collections in the sidebar, show a colored circle based on the most-used item type in that collection.

## Notes

<!-- Any extra notes -->

- Keep the current design/layout.
- Update/add database functions in `src/lib/db/items.ts` and use `src/lib/db/collections.ts` for reference.

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
