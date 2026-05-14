# Current Feature

Dashboard Items

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Replace dummy item data displayed in the main dashboard area with actual data from the database using Prisma.
- Include both pinned and recent items.
- Create `src/lib/db/items.ts` with data fetching functions.
- Fetch items directly in the server component.
- Derive item card icon and border from the item type.
- Display item type tags and maintain current design elements.
- Update collection stats display if necessary.

## Notes

<!-- Any extra notes -->

- If there are no pinned items, the pinned section should not display.
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
- Dashboard Items
