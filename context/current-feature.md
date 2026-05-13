# Current Feature

Prisma + Neon PostgreSQL Setup

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

<!-- Goals & requirements -->

- Set up Prisma ORM (Version 7) with Neon PostgreSQL database (serverless).
- Create initial schema based on data models in `@context/project-overview.md`.
- Include NextAuth models (Account, Session, VerificationToken).
- Add appropriate indexes and cascade deletes.

## Notes

<!-- Any extra notes -->

- Development branch connection string in `DATABASE_URL`; separate production branch. ALWAYS create migrations, never push directly unless specified.
- Use **Prisma 7** (has breaking changes, review upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7).
- Setup guide reference: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres

## History

<!-- Keep this updated. Earliest to latest -->

- Initial Next.js setup
- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: ShadCN init, dark mode, /dashboard route, top bar, sidebar/main placeholders
- Dashboard UI Phase 2: Collapsible sidebar, types/collections links, mobile drawer, user avatar area, UI polish
- Dashboard UI Phase 3: Main dashboard area with stats, recent collections, pinned items, and recent items grids
