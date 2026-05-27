# Rebrand: DevStash → DevNest

## Overview

Rename the product from **DevStash** to **DevNest** across all user-facing surfaces. Code internals (variable names, DB schema, file names, package names) are out of scope — only strings and assets visible to users are changed.

---

## 1. Logo / Brand Mark

### Current
Blue rounded rectangle (`rx="7"`, `fill="#3b82f6"`) with three horizontal white lines — a generic document/list icon.

### Proposed — DevNest Icon
Three concentric arcs, narrowest at top and widest at bottom, suggesting the layered structure of a bird's nest. Keeps the same blue rounded rectangle background so the colour identity is preserved.

```svg
<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
  <rect width="28" height="28" rx="7" fill="#3b82f6" />
  <!-- Nest arcs: narrow → medium → wide -->
  <path d="M10 10 Q14 7 18 10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <path d="M7 14 Q14 10 21 14" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <path d="M5 19 Q14 13 23 19" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
</svg>
```

This SVG must be updated in every location the logo appears (see §3).

---

## 2. Demo User Email

> ⚠️ **Possible typo in your request** — you wrote `demo@devnext.io` but the new brand is **DevNest**. This spec assumes `demo@devnest.io`. Please confirm before implementation.

| Location | Old value | New value |
|----------|-----------|-----------|
| `prisma/seed.ts` (×2) | `demo@devstash.io` | `demo@devnest.io` |
| `src/lib/db/collections.ts` | `demo@devstash.io` | `demo@devnest.io` |
| `scripts/purge-non-demo-users.ts` | `demo@devstash.io` | `demo@devnest.io` |

---

## 3. UI Text Changes

### 3a. Page Metadata — `src/app/layout.tsx`

| Field | Old | New |
|-------|-----|-----|
| `title` | `"DevStash"` | `"DevNest"` |
| `description` | `"Your developer knowledge hub"` | `"DevNest — Your developer knowledge hub"` |

### 3b. Top Bar — `src/components/layout/top-bar.tsx`

- Brand text: `DevStash` → `DevNest`
- Logo: replace `<Package className="h-5 w-5 text-primary" />` with the DevNest SVG (inline, `aria-hidden="true"`, sized at 20×20)

### 3c. Marketing Nav — `src/components/marketing/home-nav.tsx`

- Brand text: `DevStash` → `DevNest`
- Logo SVG: replace existing SVG with DevNest arcs design (already has `aria-hidden="true"`)

### 3d. Marketing Footer — `src/components/marketing/home-footer.tsx`

- Brand text: `DevStash` → `DevNest`
- Copyright: `© {year} DevStash. All rights reserved.` → `© {year} DevNest. All rights reserved.`
- Logo SVG: replace existing SVG with DevNest arcs design (already has `aria-hidden="true"`)

### 3e. Hero Section Preview — `src/components/marketing/dashboard-preview.tsx`

- Mini caption: `"...with DevStash"` → `"...with DevNest"`

### 3f. Sign-In Page — `src/app/sign-in/page.tsx`

- Heading: `"Sign in to DevStash"` → `"Sign in to DevNest"`
- Logo SVG: replace existing SVG with DevNest arcs design (already has `aria-hidden="true"`)

### 3g. Register Page — `src/app/register/page.tsx`

- Logo SVG: replace existing SVG with DevNest arcs design (already has `aria-hidden="true"`)

### 3h. Dashboard Page — `src/app/(dashboard)/dashboard/page.tsx`

- Welcome subtext: `"Here's an overview of your DevStash."` → `"Here's an overview of your DevNest."`

### 3i. Profile Page — `src/app/(dashboard)/profile/page.tsx`

- Stats card description: `"Your DevStash at a glance."` → `"Your DevNest at a glance."`

### 3j. Email Templates — `src/lib/email.ts`

All user-facing email content:

| Location | Old | New |
|----------|-----|-----|
| `from` (both emails) | `"DevStash <onboarding@resend.dev>"` | `"DevNest <onboarding@resend.dev>"` |
| Verification subject | `"Verify your DevStash email"` | `"Verify your DevNest email"` |
| Verification body | `"Thanks for signing up for DevStash!"` | `"Thanks for signing up for DevNest!"` |
| Reset subject | `"Reset your DevStash password"` | `"Reset your DevNest password"` |
| Reset body | `"...your DevStash account."` | `"...your DevNest account."` |

### 3k. Demo Seed Data — `src/lib/mock-data.ts`

This data is visible to users in demo mode:

| Field | Old | New |
|-------|-----|-----|
| Note title (line 158) | `"DevStash project context"` | `"DevNest project context"` |
| Note content (line 160) | `"DevStash is a unified hub..."` | `"DevNest is a unified hub..."` |

---

## 4. Additional Suggestions

These are not strictly required by your brief but are worth considering:

### 4a. Marketing copy — hero subtext
The hero paragraph (`"Snippets, prompts, commands, notes, files, and links — all in one place."`) doesn't mention the brand name, so no change needed. However the `FeaturesSection` paragraph now says `"Six item types, one powerful search. Stop copying from Slack..."` — this reads well for DevNest too; no change needed.

### 4b. SEO metadata — `src/app/layout.tsx`
Currently there is no `openGraph` or `twitter` card metadata. Consider adding:
```ts
openGraph: {
  title: "DevNest",
  description: "DevNest — Your developer knowledge hub",
  siteName: "DevNest",
},
```
This improves link previews on social sharing.

### 4c. `<html lang>` and favicon
The favicon is the default Next.js icon. A custom favicon using the DevNest SVG (or a `.ico` derived from it) would complete the rebrand. This requires adding a `src/app/favicon.ico` or `src/app/icon.tsx` (Next.js App Router supports SVG favicons natively via `icon.tsx`).

### 4d. NestJS association
Since NestJS is a well-known Node.js framework, some developers may have a momentary association when they first hear "DevNest". The marketing copy can mitigate this by leaning into the "organized home" angle rather than any framework connection. The tagline `"Your developer knowledge hub"` already does this well.

---

## 5. Out of Scope (per brief)

The following contain `devstash` references but are **not** changed as they don't affect UX/UI:

- `package.json` — `name: "dev-stash"`
- `CLAUDE.md` — internal project instructions
- `context/features/*.md` — internal specs
- `prisma/schema.prisma` — DB schema names
- All TypeScript variable/function/import names
- Git history and branch names

---

## 6. Implementation Order

1. Design final SVG logo (validate at 20px and 28px sizes)
2. Update `src/lib/email.ts` (email templates)
3. Update all logo instances + brand text (§3b–§3g — nav, footer, top-bar, auth pages)
4. Update in-app copy (§3h–§3k — dashboard, profile, seed data)
5. Update `src/app/layout.tsx` metadata
6. Update demo user email (§2)
7. Re-seed the database with the new demo email
8. Optional: add OG metadata and favicon (§4b–§4c)
