## Context

The client is an existing Vite + React 19 + TypeScript SPA (`react-router-dom`, Tailwind v4, Framer Motion) with all content in `src/data/*.ts` (see `src/types/portfolio.ts` for current shapes) and no backend. `PORTFOLIO_CMS_PLAN.md` (repo root) is the source requirement document; see `proposal.md` for why this change exists. There is currently no archived baseline under `openspec/specs/` — the prior static-site change (`build-developer-portfolio`) completed but was never archived — so this design treats the current committed UI/UX as a fixed constraint rather than a formally specced baseline to diff against.

Current content is placeholder-heavy (e.g. `experience.ts` has no real company name, `certifications.ts` is empty, several Voyager detail fields are bracketed placeholders). Per the plan, none of this may be invented — the seed script carries these placeholders over verbatim, and the admin UI is how the owner fills them in later.

## Goals / Non-Goals

**Goals:**
- Stand up `server/` as an independently runnable Express + MongoDB API, additive to the existing `client` app, without altering its build tooling.
- Give the existing React app an authenticated admin area and a typed API layer, reusing existing components/styling wherever a public section already renders the right UI.
- Make content changes (add/edit/delete/reorder/publish) take effect on the public site without a frontend rebuild.
- Preserve every current public behavior (design, copy, responsiveness, routing) during and after the migration.

**Non-Goals:**
- Image upload, rich text editing, drag-and-drop reordering UI (display order is a numeric field edited directly), multiple admin accounts, blog/CMS-beyond-portfolio features, analytics, GitHub sync, AI content generation — all explicitly deferred by the plan.
- Choosing or provisioning actual hosting (Render/Vercel/Atlas accounts) — environment variables and CORS are designed to support it, but account setup is an operational step outside this change's artifacts.
- Rewriting the public visual design system; the admin UI may use simpler, utilitarian styling (it can reuse Tailwind tokens but doesn't need the marketing-site polish).

## Decisions

### Repository layout: `client/` + `server/` split vs. co-located `src/`
The plan's recommended structure moves the existing app into `client/`. Moving the whole existing `src/` tree is high-risk for a "preserve everything" constraint and provides no functional benefit over keeping the current app in place and adding a sibling `server/` directory at the repo root. **Decision:** keep the existing Vite app exactly where it is (repo root `src/`, `index.html`, `vite.config.ts`, etc.) and add `server/` as a new sibling directory with its own `package.json`, matching the plan's internal `server/` structure (`src/{config,controllers,middleware,models,routes,services,utils,validators}`, `scripts/seed.*`, `.env.example`). This satisfies "do not move files unnecessarily" while still giving the backend the plan's recommended internal organization.

### Language: TypeScript on the server
The existing app is TypeScript. The plan says "prefer TypeScript if the existing project already uses TypeScript." **Decision:** `server/` is TypeScript, run via `tsx`/`ts-node` in dev and compiled for production, mirroring the client's strictness where reasonable.

### Validation library: Zod
Three options were allowed (Zod, Joi, express-validator). **Decision:** Zod — schemas double as inferred TypeScript types for controller/service inputs, giving the server the same type-safety ergonomic the client already has, and it has no heavier runtime footprint than the alternatives.

### Auth: JWT in an HTTP-only cookie, single hard-coded-free admin account
Session state lives in a JWT so the server stays stateless; the JWT is never exposed to JS (HTTP-only cookie) to reduce XSS blast radius. `secure` is environment-driven (`COOKIE_SECURE`) and `sameSite` defaults to `lax` for same-site admin usage. **Decision:** exactly one admin user, created only by the seed script from environment-supplied credentials (never hard-coded in source, never invented). No `/api/auth/register` endpoint exists at all — not just unauthenticated, but absent — closing off account enumeration entirely.

### API layer shape on the frontend
**Decision:** a thin `src/services/api.ts` (base fetch wrapper reading `VITE_API_BASE_URL`, always sending credentials for cookie auth) plus one file per domain (`projectsApi.ts`, `skillsApi.ts`, etc.) exporting typed functions (`list`, `getBySlug`, `create`, `update`, `remove`). Components call these functions; no component calls `fetch` directly. This satisfies the plan's "avoid fetch in every component" requirement with minimal ceremony — no React Query/SWR dependency is introduced since the plan asks to avoid unnecessary dependencies and the data volume/update frequency here doesn't need cache invalidation machinery.

### Migration order and cutover mechanics
**Decision:** migrate Projects → Skills → Experience → Certifications → Profile, exactly as the plan orders it, because Projects is the most structurally complex (detail page, slug routing) and validates the end-to-end pattern (loading/empty/error + API layer + admin CRUD) earliest; the remaining sections are then repeats of the same pattern with decreasing complexity. Each section's static `src/data/X.ts` module is deleted only in the same task group that verifies its replacement against a running API — never batched at the end — so a partially-completed migration never leaves a section unable to render.

### Reusing vs. rewriting public components
**Decision:** existing components (`Projects.tsx`, `Skills.tsx`, `Experience.tsx`, `Certifications.tsx`, `About.tsx`/`Hero.tsx` for profile) are edited in place to source data from the API layer via a small data-fetching hook (e.g. `useApiResource`) instead of a static import, keeping JSX/styling untouched. No component is rewritten from scratch.

### Admin UI placement
**Decision:** `src/admin/` (components, pages, services are colocated under `src/admin/pages/*` per resource) rather than nesting under `src/pages/Admin/`, matching the plan's alternate suggested layout that separates admin concerns from the public `pages/`/`components/` tree while still living inside the existing `src` app (no separate build).

## Risks / Trade-offs

- **[Risk] JWT cookie auth requires the API and the client to agree on cookie domain/SameSite in production**, which is easy to misconfigure across two different hosting providers (e.g. Vercel + Render) → Mitigation: `CLIENT_URL`/CORS origin and `COOKIE_SECURE`/`SameSite` are explicit environment variables validated at server startup; local dev defaults (`http://localhost:5173` / `COOKIE_SECURE=false`) are documented in `.env.example`.
- **[Risk] Deleting `src/data/*.ts` too early would blank out a still-dependent section** → Mitigation: the design's per-section cutover order plus the `portfolio-dynamic-content` spec's "Incremental Migration Without Data Loss" requirement make this an explicit task-level gate, not a judgment call at implementation time.
- **[Risk] A single admin account with no recovery flow means a lost password locks out content management** → Mitigation: out of scope for v1 per the plan (no email notifications); recovery is a documented manual re-seed (rotate `ADMIN_PASSWORD` env var and re-run the seed script's upsert), which is acceptable for a single-owner portfolio.
- **[Trade-off] No optimistic UI / cache layer in the frontend API layer** means every admin action refetches lists → acceptable given expected data volumes (a handful of projects/skills/experience/certifications) and keeps the dependency list small.
- **[Risk] MongoDB Atlas free-tier limits or Render free-tier cold starts could affect the public site's perceived load time**, since Projects/Skills/etc. now depend on a live API instead of a bundled static import → Mitigation: loading states (required by `portfolio-dynamic-content`) absorb this, and the plan already flags verifying current free-tier limits before deployment as a deployment-phase task, not a design-time blocker.

## Migration Plan

1. Stand up `server/` locally against a MongoDB Atlas (or local MongoDB) instance; verify `/api/health`.
2. Run the seed script against a scratch database; verify the admin user, profile, and Voyager/skills/experience/certifications documents match current static content exactly.
3. Build and manually verify the admin UI end-to-end (login → CRUD → logout) against the seeded data before touching any public component.
4. Cut the public site over section by section (Projects → Skills → Experience → Certifications → Profile), each step: point the section at its `*Api` module, verify rendering + loading/empty/error states, then delete that section's static data module and its now-unused type if fully superseded.
5. Rollback strategy: since each cutover step is an isolated commit that only touches one section, reverting the last commit restores that section's static import with zero effect on already-migrated sections. Because static data files aren't deleted until their section's cutover is verified, no step is irreversible until the final cleanup commit.

## Open Questions

None — the plan fixes the technology choices, data model, endpoint shapes, and rollout order tightly enough that no deferrable unknown remains that would change the specs or task breakdown.
