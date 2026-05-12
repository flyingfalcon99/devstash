# Claude Project Manager for DevStash

## 1. Project Overview
- **Project Name**: DevStash
- **Description**: A modern SaaS dashboard for developers to organize code snippets, URLs, notes, and files. Uses Next.js, Tailwind, and Supabase.
- **Architecture**: Modular, feature-based with ShadCN UI components and a focus on UX design.


## 2. Project Structure Reference

```
dev-stash/
├── app/                      # Next.js pages and routes
│   ├── dashboard/            # Dashboard pages
│   ├── items/                # Items and item-type specific routes
│   ├── collections/          # Collections routes
│   ├── auth/                 # Authentication pages
│   ├── api/                  # API routes
│   └── layout.tsx            # Main layout
│
├── components/               # UI Components
│   ├── common/               # Reusable components (Sidebar, TopBar)
│   ├── ui/                   # ShadCN components
│   └── features/             # Feature-specific components
│
├── context/                  # Shared contexts and state
│   ├── project-overview.md   # Project mission and vision (The "Source of Truth")
│   ├── features/             # Feature specifications
│   │   ├── dashboard-phase-1-spec.md
│   │   ├── dashboard-phase-2-spec.md
│   │   ├── dashboard-phase-3-spec.md
│   │   ├── item-types-spec.md
│   │   ├── items-spec.md
│   │   └── collections-spec.md
│   ├── current-feature.md    # Tracks current feature in development
│   └── mock-data.ts          # Mock data for development
│
├── db/                       # Database schemas and migrations
├── lib/                      # Utility functions and helpers
├── styles/                   # Global styles
└── types/                    # TypeScript types
```

## 3. Feature Workflow (How We Work)

1. **Read Specs**: Always read the `.md` files in `context/features/` for specifications.
2. **Check Current**: Check `context/current-feature.md` to see what's being worked on.
3. **Update Status**: Use `context/current-feature.md` to mark features as "Planned", "In Progress", or "Completed".
4. **Create Branches**: Use `git branch <feature-name>` before starting work.
5. **Implement**: Implement features based on specs.
6. **Test & Validate**: Ensure the feature works as expected.
7. **Commit & Push**: Use `git commit`, `git merge`, and `git push` to update the remote.
8. **Update Specs**: Update `.md` files with any changes or improvements.
9. **Cleanup**: Mark feature as "Completed" in `context/current-feature.md`.

## 4. Key Files (The Source of Truth)

- **`context/project-overview.md`** - The project mission, vision, and core requirements (read this first!)
- **`context/current-feature.md`** - Tracks current work status and next steps
- **`context/features/*.md`** - Feature specifications and requirements
- **`CLAUDE.md`** - This file (your instruction set)

## 5. Getting Started Steps

1. Read `context/project-overview.md` to understand the project vision.
2. Review the current feature in `context/current-feature.md`.
3. Check `context/features/` for available features to work on.
4. Create a feature branch: `git branch <feature-name>`.
5. Start implementation.
6. Follow the workflow in section 3 to commit and push.

## 6. Daily Operating Instructions

1. **Always start by checking `context/current-feature.md`** to see what needs to be done.
2. **Read the feature specification** in `context/features/*.md` before implementing.
3. **Update `context/current-feature.md`** to reflect your progress.
4. **Commit frequently** with descriptive messages.
5. **Ask for clarification** if any specification is unclear or ambiguous.
6. **Suggest improvements** to specs if you identify better approaches.
7. **Validate your work** against the requirements before completing a feature.

## 7. Important Notes
- The UI Designer role is for demonstration purposes only - you are the primary developer.
- The project uses ShadCN UI components - use them instead of custom styling where possible.
- Always validate that changes don't break existing functionality.
- Feature specs are the single source of truth for implementation details.

Let me know when you're ready to start working on a feature. I'll update `context/current-feature.md` accordingly.
```
