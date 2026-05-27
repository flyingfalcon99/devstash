# Current Feature

## Status

Not Started

## Goals

## Notes

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
- Collections Pages & Collection Create - /collections listing page; /collections/[id] detail page with ItemsClientWrapper; createCollection server action (Zod, auth-scoped, 6 tests); NewCollectionButton dialog in top bar; toast + router.refresh(); 404 + empty states; ItemDrawer refactored into sub-components
- Item-to-Collection Assignment - CollectionPicker checkbox component; multi-select in New Item dialog and Edit Item drawer; createItem/updateItem/createFileItem accept collectionIds; GET /api/collections route; ItemCollection join rows managed atomically; 39 tests passing
- Collection Management Actions - Edit/Delete/Favorite(UI) on /collections/[id] header; CollectionCard with 3-dot DropdownMenu on listing and dashboard; updateCollection + deleteCollection server actions; delete cascades join rows only; 51 tests passing
- Global Search / Command Palette - Cmd+K / Ctrl+K shortcut; TopBar trigger with ⌘K badge; cmdk Command palette with substring filter; items + collections grouped results with type icons; item select opens layout-level drawer, collection select navigates; getSearchData pre-fetched at layout load; 56 tests passing
- Pagination - PaginationControls (prev/next + page numbers, ellipsis for >7 pages) on /items/[type], /collections, /collections/[id]; ?page search param; server-side skip/take; all limits centralised in lib/constants/pagination.ts; 56 tests passing
- Settings Page - /settings route with Change Password (credentials only) and Danger Zone cards; Settings link added to sidebar user dropdown; gear icon removed from button trigger; profile page refactored to user info + usage stats only with improved layout
- Editor Preferences Settings - editorPreferences Json? column via Prisma migration; updateEditorPreferences server action (Zod, auth-scoped, 8 tests); EditorPreferencesContext at dashboard layout level; Settings page Editor Preferences card with theme/fontSize/tabSize/wordWrap/minimap controls; CodeEditor consumes context; monaco-themes for Monokai and GitHub Dark; 64 tests passing
- Favorites Page - /favorites route (auth-protected); getFavorites db query with isFavorite filter and updatedAt desc sort (5 tests); compact terminal-style list with monospace font, type icon + title + badge + date rows; item click opens ItemDrawer, collection click navigates; empty state; Star icon in TopBar; 69 tests passing
- Favorite Toggle - toggleItemFavorite + toggleCollectionFavorite server actions (10 tests); ItemDrawer Favorite button wired with optimistic state; CollectionDetailActions star button active; CollectionCard dropdown Favorite item wired; router.refresh() + error toast on all surfaces; 79 tests passing
- Favorites Sort - client-side sort controls (Date/Name/Type) on /favorites page; sortItems and sortCollections pure functions; monospace toggle buttons with active state; 79 tests passing
- Pinned Items - toggleItemPin server action (5 tests); Pin button in ItemDrawer wired with optimistic state + blue active styling; pin icon static indicator on ItemCard; pin-first orderBy on /items/[type] and collection item listings; 84 tests passing
- Homepage Mockup - static marketing prototype at prototypes/homepage/; chaos-to-order hero with rAF icon animation + mouse repel; 6 feature cards, AI/Pro section, pricing with yearly toggle, scroll fade-in, responsive layout
- Homepage - production Next.js homepage at /; 12 components in src/components/marketing/ (4 client: HomeNav, ChaosVisual, PricingToggle, FadeIn; 8 server); chaos hero visual, features grid, AI section, pricing with yearly toggle, footer; all CTAs wired to /sign-in and /register; 84 tests passing
- UI Fixes Stage 1 (Critical A11y) - ItemCard outer wrapper changed to div[role=button] to fix nested interactive element HTML violation; copy span gains tabIndex+onKeyDown for keyboard operability; SidebarUserMenu replaced with ShadCN DropdownMenu (Base UI) for full keyboard nav + Escape-to-close + role=menu; ItemDrawerContext created with singleton drawer at layout level, removing duplicate ItemDrawer from DashboardItemsClient, FavoritesList, ItemsClientWrapper, CollectionItemsDisplay
- UI Fixes Stage 2 (High Priority) - HomeNav: hamburger + slide-down panel for Features/Pricing on mobile with aria-label/aria-expanded; FeaturesSection: copy corrected from "Seven" to "Six item types"; sign-in/register: Package icon replaced with branded DevStash SVG; TopBar: NewCollectionButton hidden below lg to prevent search bar crush at tablet widths; CollectionCard: DropdownMenuTrigger opacity-0/group-hover removed, menu always visible
- UI Fixes Stage 3 (Medium Priority) - ChaosVisual: h-[160px] sm:h-[200px] replaces hardcoded 200px style; dashboard stat cards: Favorite Collections uses Bookmark icon instead of duplicate Star; TopBar: DevStash brand name always visible, search collapses to icon-only below sm; ItemCard: copy button tap target increased from p-0.5 to p-1.5 (24px touch area)
