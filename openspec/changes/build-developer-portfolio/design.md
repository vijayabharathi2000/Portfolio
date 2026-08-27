## Context

No portfolio code exists yet (repo currently contains only `PORTFOLIO_PLAN.md` and OpenSpec scaffolding). `PORTFOLIO_PLAN.md` is the source plan this change formalizes; see `proposal.md` - Why for motivation and scope (P0+P1 only). The four capability specs (`portfolio-shell`, `portfolio-content`, `portfolio-projects`, `portfolio-deployment`) define required behavior; this document covers the technical approach to satisfy all four together, since they share one codebase and one build.

## Goals / Non-Goals

**Goals:**
- One coherent Vite + React + TypeScript + Tailwind codebase satisfying all four capability specs.
- Project and content data fully separated from UI components so Voyager can be followed by future projects (and future experience/cert entries) without rewriting components.
- Ship as a static site with zero backend/runtime dependencies, deployable to Netlify's free tier.

**Non-Goals:**
- GitHub API integration, analytics, blog, additional projects beyond Voyager, and custom domain setup (explicitly deferred to future changes per `PORTFOLIO_PLAN.md` P2).
- A backend contact form or any server-side code — contact is `mailto:` only for v1.
- Pixel-perfect design system tokens — a workable, centralized theme is required; final visual polish can iterate after this change.

## Decisions

### Project scaffold: Vite `react-ts` template + Tailwind CSS
Chosen because it's the plan's explicit stack and gives fast local dev/build with minimal config. Alternative considered: Next.js — rejected, since there's no need for SSR/API routes for a static portfolio, and it would add unneeded complexity and a Node server dependency.

### Data-driven content via typed modules in `src/data/`
Each content area (`projects.ts`, `skills.ts`, `experience.ts`, `certifications.ts`) exports a typed array/object (types in `src/types/portfolio.ts`). Components import data and map over it; they contain no hardcoded content. This directly satisfies the "adding a project/skill/experience entry requires only a data change" requirements in `portfolio-content` and `portfolio-projects`. Alternative considered: a headless CMS or MDX content files — rejected as unnecessary complexity for a single-maintainer static site with no non-technical content editors.

### Routing: `react-router-dom` with two routes (`/`, `/projects/:slug`)
Matches `portfolio-shell`'s routing requirement directly. `ProjectDetails.tsx` looks up the project by `slug` from `projects.ts`; an unmatched slug renders a "not found" state (satisfies the `portfolio-projects` unknown-slug scenario) rather than a router-level catch-all page, since there is only one non-home route family for now.

### Theme: React Context + `localStorage`, resolved against `prefers-color-scheme` for "System"
A `ThemeProvider` stores `"system" | "light" | "dark"` in `localStorage`, applies a `dark` class on `<html>`, and Tailwind's `darkMode: "class"` strategy drives styling. "System" resolves live via a `matchMedia` listener. This is the standard low-dependency approach for Tailwind dark mode and satisfies persistence + OS-follow requirements in `portfolio-shell` without adding a state-management library.

### Active-section highlighting via `IntersectionObserver`
Each home-page section is observed; the navbar highlights whichever section crosses a mid-viewport threshold. Chosen over scroll-position math for simpler, more reliable behavior across viewport sizes.

### Animation: Framer Motion, applied only at section/card/navbar granularity
Used sparingly per `PORTFOLIO_PLAN.md` §26 (hero fade+slide-up, section fade-on-scroll-into-view, card hover, navbar transition) rather than element-by-element, so the site "still looks good when animations are disabled" and stays lightweight.

### Deployment: static `dist` output + `public/_redirects`
`public/_redirects` containing `/* /index.html 200` is copied verbatim into `dist` by Vite, giving Netlify the SPA fallback needed for direct loads of `/projects/voyager` (the `portfolio-deployment` SPA-fallback requirement). No `netlify.toml` is required for this alone, but one may be added later for build settings if needed.

### Placeholder content policy
Real experience/Voyager/certification content is not yet available (per user decision when this change was proposed). `src/data/*` ships with clearly-marked placeholder strings (e.g. `"[Add project description]"`) exactly as `PORTFOLIO_PLAN.md` §38 prescribes, rather than inventing plausible-sounding content. This keeps the spec's "no fabricated content" requirements satisfiable at build time and leaves real-content entry as a simple data-file edit later.

## Risks / Trade-offs

- [Placeholder content ships to production if not replaced before deploy] → Mitigate by making placeholders visually obvious (bracketed instructional text) and calling this out explicitly in `tasks.md` as a pre-launch checklist item.
- [`IntersectionObserver`-based active-section tracking can be finicky with fast scrolling/short sections] → Acceptable per spec wording ("if practical"); keep the implementation simple and treat mis-highlighting as a minor visual issue, not a blocking bug.
- [Tailwind + Framer Motion + lucide-react add build/runtime weight] → Mitigate by avoiding additional UI libraries, checking bundle size and Lighthouse scores in the Performance step (`tasks.md`), and keeping animation usage sparse per the design decision above.
- [No contact form now, mailto-only] → Accepted trade-off per proposal scope; revisit only if a future change explicitly adds a backend/serverless contact endpoint.

## Migration Plan

This is a net-new project with no existing users or deployed version, so there is no in-place migration or rollback concern. Rollout is: build locally → push to GitHub → connect Netlify → verify the deployed site → iterate. If a deploy misbehaves, the mitigation is simply not promoting that deploy (Netlify keeps prior deploys addressable), not a data migration rollback.
