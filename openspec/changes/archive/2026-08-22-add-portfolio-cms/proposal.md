## Why

The portfolio is currently a static React/Vite site with all content (profile, Voyager project, skills, experience, certifications) hard-coded in `src/data/*.ts`. Every content update requires a code change, a rebuild, and a redeploy. `PORTFOLIO_CMS_PLAN.md` calls for converting it into a full-stack Portfolio CMS so the owner can manage this content through an authenticated `/admin` dashboard backed by a real API and database, without touching the React source or redeploying the frontend for content changes.

## What Changes

- Add a Node.js/Express + MongoDB (Mongoose) backend under `server/` exposing:
  - Public, read-only REST endpoints for profile, projects, skills, experience, certifications, and a health check.
  - Admin REST endpoints (CRUD) for the same content types, protected by authentication.
  - Email/password admin authentication using bcrypt password hashing, JWT, and an HTTP-only cookie (no public registration; single admin account provisioned via seed script).
  - Centralized request validation, a consistent success/error response envelope, centralized error handling, request logging (method/route/status/duration, no secrets), and login rate limiting.
  - A development-safe seed/migration script that upserts the admin user, profile, and existing content (including Voyager) sourced from the current `src/data/*.ts` files — no invented data.
- Add an authenticated admin dashboard to the existing React app (`/admin/login`, `/admin`, `/admin/projects`, `/admin/skills`, `/admin/experience`, `/admin/certifications`, `/admin/profile`) with list/create/edit/delete, visibility and featured/published toggles, and display-order control for each content type, plus profile editing. Dashboard counts and quick actions are derived from live API data.
- Convert the public portfolio's data source from the static `src/data/*.ts` modules to the new public API, one section at a time (Projects → Skills → Experience → Certifications → Profile), adding loading/empty/error states for each section. Existing visual design, styling, components, and responsiveness are preserved. Hard-coded data is removed only after each section is verified against the live API.
- **BREAKING**: `src/data/*.ts` static content modules are removed once every consuming section has been migrated to the API; anything still importing them directly must be updated.

### Out of scope (per plan, future enhancements)

Image upload, rich text editing, drag-and-drop reordering, multiple admin users, blog CMS, analytics, GitHub sync, AI-generated content, email notifications.

## Capabilities

### New Capabilities

- `portfolio-cms-api`: Node.js/Express + MongoDB backend — Mongoose models/collections (users, profile, projects, skills, experiences, certifications), public read-only endpoints, admin CRUD endpoints, admin authentication (bcrypt + JWT + HTTP-only cookie), validation, error-response envelope, health endpoint, CORS, logging, login rate limiting, and the seed/migration script.
- `portfolio-admin-dashboard`: Authenticated `/admin` React UI — login, dashboard with live counts and quick actions, and CRUD/visibility/ordering management pages for projects, skills, experience, certifications, and profile.
- `portfolio-dynamic-content`: The public portfolio's sections (profile, projects, skills, experience, certifications) fetching from the new public API through a centralized frontend API layer, with loading/empty/error states, replacing the static `src/data/*.ts` modules.

### Modified Capabilities

None. The prior static-site build (`build-developer-portfolio`) was never archived into `openspec/specs/`, so there is no canonical baseline spec to delta against; this change's new capabilities preserve that build's existing UI/UX behavior as an explicit constraint instead of a formal delta.

## Impact

- **New code**: `server/` (Express app, config, routes, controllers, services, Mongoose models, validators, middleware, seed script); `src/admin/` (or `src/pages/Admin/`) React admin UI; `src/services/api.*` centralized API layer (`authApi`, `projectsApi`, `skillsApi`, `experienceApi`, `certificationsApi`, `profileApi`).
- **Modified code**: `src/App.tsx` (new `/admin/*` routes), public section components (`Hero`, `About`, `Projects`, `Skills`, `Experience`, `Certifications`) switch from static imports to API-backed data with loading/empty/error handling.
- **Removed code**: `src/data/*.ts` (after migration is verified per section) and any direct imports of them.
- **New dependencies**: backend — `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cookie-parser`, a validation library (Zod), `cors`, a rate-limiter (`express-rate-limit`); frontend — none required beyond existing `react-router-dom`.
- **New infrastructure**: MongoDB Atlas cluster; new environment variables for both `server/` and the existing Vite client (`.env.example` in each); CORS allow-list; production deployment target for the API (e.g. Render) alongside the existing static frontend host.
- **Data migration**: one-time seed of the admin user, profile, and existing Voyager/skills/experience/certifications content into MongoDB, sourced only from current `src/data/*.ts` values.
