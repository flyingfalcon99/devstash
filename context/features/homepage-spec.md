# Homepage

## Overview

Build the production marketing homepage at `/` (the root route) from the prototype in `prototypes/homepage/`. Uses the existing Next.js App Router, Tailwind, and ShadCN — no new dependencies.

## Route

- `src/app/page.tsx` — public, no auth required
- If the user is already signed in, the logo/sign-in links still point correctly; no redirect needed on this page

## Component Structure

All sections are static — no DB calls. Split into server and client only where animation or interactivity requires it.

```
src/app/page.tsx                         ← server, composes all sections
src/components/marketing/
  home-nav.tsx                           ← client (scroll opacity class toggle)
  hero-section.tsx                       ← server (text + layout)
  chaos-visual.tsx                       ← client (rAF animation, mouse repel)
  dashboard-preview.tsx                  ← server (static mockup markup)
  features-section.tsx                   ← server
  ai-section.tsx                         ← server
  pricing-section.tsx                    ← server (wraps PricingToggle)
  pricing-toggle.tsx                     ← client (yearly/monthly switch)
  cta-section.tsx                        ← server
  home-footer.tsx                        ← server
```

## Section Details

### HomeNav (client)
- Fixed top bar: DevStash logo (links to `/`), Features / Pricing anchor links, Sign In (`/sign-in`), Get Started (`/register`) buttons
- `useEffect` scroll listener adds a `scrolled` class (increased bg opacity + border) — mirrors prototype behaviour
- Use ShadCN `Button` for Sign In (ghost) and Get Started (default)

### HeroSection (server)
- Eyebrow pill, H1 with gradient span, subheadline, two CTA buttons
- "Get Started Free" → `/register`, "View Demo" → `/dashboard` (or `#features` if demo page doesn't exist yet)
- Gradient text: Tailwind `bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-clip-text text-transparent`
- Renders `<ChaosVisual />` (client island) and `<DashboardPreview />` (server) side-by-side

### ChaosVisual (client)
- Extract the `requestAnimationFrame` chaos animation from `prototypes/homepage/script.js` into a `useEffect`
- 8 emoji icons drift, bounce off container walls, repel from mouse cursor
- Container sized with Tailwind (`relative overflow-hidden`)

### DashboardPreview (server)
- Static mockup: mini top bar, sidebar with nav labels, stat row, "Recent Items" section label, 2-column card grid
- All colours via inline style or Tailwind arbitrary values using the item type hex values from `src/lib/constants/item-types.ts`
- No interactivity needed

### FeaturesSection (server)
- Section label, H2, subheadline, 3-column `grid` of 6 feature cards
- Cards: icon div (coloured bg), title, description — use `Card` from ShadCN or plain `div` with `rounded-xl border bg-card`
- Feature data defined as a const array in the same file

### AiSection (server)
- Two-column layout: left = Pro badge + H2 + checklist, right = code mockup
- Pro badge: `Badge` component or a styled `span`
- Code mockup: dark `pre`-style block — hardcode the Python snippet from the prototype

### PricingSection (server) + PricingToggle (client)
- Server renders both cards; client `PricingToggle` controls the displayed price via `useState`
- Pass the monthly/yearly prices as props to the toggle so the server component stays static
- Free: $0 / forever, 50 items, 3 collections, no AI
- Pro: $8/mo or $6/mo ($72/yr billed annually; "Save 25%" badge); "Most Popular" ring
- Free CTA → `/register`, Pro CTA → `/register` (Stripe not wired yet; update when stripe-phase-1 ships)
- Use ShadCN `Card`, `Badge`, `Button`, `Switch` (for yearly toggle)

### CtaSection (server)
- Full-width centred block, H2, one-liner, "Start Free Today" → `/register`

### HomeFooter (server)
- Logo + tagline, four link columns (Product, Company, Developers, Legal)
- Placeholder `href="#"` for non-existent pages (Changelog, Roadmap, Blog, Docs, API, Status)
- `/sign-in`, `/register`, `/settings`, `/favorites` for pages that exist
- Current year via `new Date().getFullYear()`

## Scroll Animations

- Replicate the prototype's fade-in-on-scroll using a client component wrapper `<FadeIn>` that uses `IntersectionObserver`
- Wrap each major section content block with `<FadeIn>` for the staggered reveal
- Keep it a thin wrapper — just adds `opacity-0 translate-y-4` initially, transitions to `opacity-100 translate-y-0` on intersection

## Tailwind Notes

- Max content width: `max-w-5xl mx-auto px-4 sm:px-6`
- Section padding: `py-24`
- Dark bg assumed (`bg-background` = dark from existing theme)
- Responsive: hero visual stacks on mobile (`flex-col md:flex-row`); features grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; pricing grid `grid-cols-1 sm:grid-cols-2`; footer `grid-cols-2 md:grid-cols-4`

## No Tests Needed

All components are pure presentational UI with no server actions or data-fetching logic.
