## 1. Backend Foundation

- [x] 1.1 Scaffold `server/` (package.json, tsconfig, `npm run dev`/`build`/`start` scripts) as a sibling of the existing client app
- [x] 1.2 Create the Express app with JSON body parsing, `cookie-parser`, and CORS restricted to `CLIENT_URL`
- [x] 1.3 Add environment config loading and `server/.env.example` (`NODE_ENV`, `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `COOKIE_SECURE`)
- [x] 1.4 Add request logging middleware (method, route, status, duration; never logs secrets/cookies/passwords)
- [x] 1.5 Add centralized error-handling middleware and `{ success, data | message, errors }` response helpers
- [x] 1.6 Implement `GET /api/health` and verify the server starts and responds

## 2. MongoDB & Models

- [x] 2.1 Add Mongoose connection setup with startup failure handling
- [x] 2.2 Create `User` model (email, passwordHash, role, createdAt, updatedAt, lastLoginAt)
- [x] 2.3 Create `Profile` model (single-document collection)
- [x] 2.4 Create `Project` model (title, slug, shortDescription, description, technologies[], githubUrl, liveUrl, imageUrl, featured, displayOrder, published, timestamps)
- [x] 2.5 Create `Skill` model (name, category, icon, proficiency, displayOrder, visible, timestamps)
- [x] 2.6 Create `Experience` model (company, role, location, startDate, endDate, current, description, responsibilities[], technologies[], displayOrder, visible, timestamps)
- [x] 2.7 Create `Certification` model (name, issuer, issueDate, credentialId, credentialUrl, description, displayOrder, visible, timestamps)

## 3. Validation

- [x] 3.1 Add Zod and define request schemas for login and for each admin write endpoint (required fields, string lengths, URL format, date format, category enum, ObjectId params, slug format)
- [x] 3.2 Add validation middleware that returns the standard validation-error envelope with per-field messages

## 4. Authentication

- [x] 4.1 Add bcrypt password hashing/comparison utilities
- [x] 4.2 Add JWT sign/verify utilities with configured expiration
- [x] 4.3 Implement `POST /api/auth/login` (bcrypt compare, generic "Invalid email or password" on failure, HTTP-only cookie with `secure`/`sameSite` from config on success)
- [x] 4.4 Implement `POST /api/auth/logout` (clears the session cookie)
- [x] 4.5 Implement `GET /api/auth/me` (returns current admin or 401)
- [x] 4.6 Implement auth middleware that verifies the JWT server-side and rejects missing/expired/invalid tokens with 401
- [x] 4.7 Add rate limiting to `POST /api/auth/login`

## 5. Public API

- [x] 5.1 Implement `GET /api/profile`
- [x] 5.2 Implement `GET /api/projects` (published only, sorted by `displayOrder`)
- [x] 5.3 Implement `GET /api/projects/:slug` (404 for missing/unpublished)
- [x] 5.4 Implement `GET /api/skills` (visible only, sorted)
- [x] 5.5 Implement `GET /api/experience` (visible only, sorted)
- [x] 5.6 Implement `GET /api/certifications` (visible only, sorted)

## 6. Admin API

- [x] 6.1 Implement authenticated `POST/PUT/DELETE /api/admin/projects[/:id]` following Route → Controller → Service → Model layering
- [x] 6.2 Implement authenticated `POST/PUT/DELETE /api/admin/skills[/:id]`
- [x] 6.3 Implement authenticated `POST/PUT/DELETE /api/admin/experience[/:id]`
- [x] 6.4 Implement authenticated `POST/PUT/DELETE /api/admin/certifications[/:id]`
- [x] 6.5 Implement authenticated `PUT /api/admin/profile`
- [x] 6.6 Verify every admin route rejects unauthenticated requests with 401 before any mutation
- [x] 6.7 Implement authenticated `GET /api/admin/projects`, `GET /api/admin/skills`, `GET /api/admin/experience`, `GET /api/admin/certifications`, and `GET /api/admin/profile`, each returning the full unfiltered record set (including unpublished/hidden entries) for dashboard counts and admin list views

## 7. Seed / Migration Script

- [x] 7.1 Write `server/scripts/seed.ts` that upserts the admin user (from env-supplied credentials), profile, Voyager project, skills, experience, and certifications using the exact values currently in `src/data/*.ts`
- [x] 7.2 Verify the script is idempotent (running it twice produces no duplicate admin user or Voyager project) — automated in `server/tests/seed.test.ts`
- [x] 7.3 Run the seed against a database and confirm every collection matches the existing static content exactly (including placeholder text) — automated against an in-memory MongoDB in `server/tests/seed.test.ts`; run it again against your real MongoDB Atlas instance with `npm run seed` before relying on it in production

## 8. Backend Verification

- [x] 8.1 Verify every scenario in `specs/portfolio-cms-api/spec.md` (automated, via the tests in group 9, against a real in-memory MongoDB — see server/tests/api.test.ts)
- [x] 8.2 Run the server build/typecheck and fix all errors

## 9. Automated Backend Tests

- [x] 9.1 Add a lightweight backend test setup (test runner + `supertest` + `mongodb-memory-server`) as dev-only dependencies, per `PORTFOLIO_CMS_PLAN.md` §38's minimum backend test list
- [x] 9.2 Test login success (correct admin credentials) and login failure (incorrect credentials returns the generic error)
- [x] 9.3 Test that an unauthenticated request to an admin endpoint is rejected (401) and an authenticated request succeeds
- [x] 9.4 Test creating, updating, and deleting a project through the admin API
- [x] 9.5 Test that `GET /api/projects` returns only published projects and excludes unpublished ones

## 10. Frontend API Layer

- [x] 10.1 Create `src/services/api.ts` (base fetch wrapper reading `VITE_API_BASE_URL`, always sends credentials for cookie auth, parses the `{ success, data|message }` envelope)
- [x] 10.2 Create `authApi`, `projectsApi`, `skillsApi`, `experienceApi`, `certificationsApi`, `profileApi` modules (each exposing the admin read/write functions alongside the public ones)
- [x] 10.3 Add `VITE_API_BASE_URL` to the client's `.env.example`

## 11. Admin UI — Auth & Shell

- [x] 11.1 Build `/admin/login` (email/password form, client-side validation, loading state, generic error message)
- [x] 11.2 Build an auth context/hook that restores session via `authApi.me()` on load and exposes login/logout
- [x] 11.3 Build a protected-route wrapper redirecting unauthenticated visitors to `/admin/login`
- [x] 11.4 Build the admin shell layout (navigation to Projects/Skills/Experience/Certifications/Profile, Logout action)
- [x] 11.5 Register `/admin/login`, `/admin`, `/admin/projects`, `/admin/skills`, `/admin/experience`, `/admin/certifications`, `/admin/profile` routes in `App.tsx`

## 12. Admin UI — Dashboard

- [x] 12.1 Build `/admin` showing live counts of projects/skills/experience/certifications from their admin APIs
- [x] 12.2 Add quick-action links (Add Project, Add Skill, Add Experience, Add Certification)

## 13. Admin UI — Project Management

- [x] 13.1 Build `/admin/projects` list (title, featured, published, actions) with featured/published toggles
- [x] 13.2 Build the project form (title, slug, short description, description, technologies, GitHub URL, live URL, image URL, featured, published, display order) with required-field, URL, and slug-uniqueness validation
- [x] 13.3 Wire add/edit/delete-with-confirmation actions to `projectsApi`

## 14. Admin UI — Skills Management

- [x] 14.1 Build `/admin/skills` list with show/hide and display-order editing
- [x] 14.2 Build the skill form (name, category, icon, display order, visible)
- [x] 14.3 Wire add/edit/delete-with-confirmation actions to `skillsApi`

## 15. Admin UI — Experience Management

- [x] 15.1 Build `/admin/experience` list with show/hide and display-order editing
- [x] 15.2 Build the experience form (company, role, location, start date, end date, current, description, responsibilities, technologies, display order, visible), disabling/hiding End Date when Current is checked
- [x] 15.3 Wire add/edit/delete-with-confirmation actions to `experienceApi`

## 16. Admin UI — Certification Management

- [x] 16.1 Build `/admin/certifications` list with show/hide and display-order editing
- [x] 16.2 Build the certification form (name, issuer, issue date, credential ID, credential URL, description, display order, visible)
- [x] 16.3 Wire add/edit/delete-with-confirmation actions to `certificationsApi`

## 17. Admin UI — Profile Management

- [x] 17.1 Build `/admin/profile` form (name, headline, summary, email, location, GitHub, LinkedIn, resume URL, profile image URL) wired to `profileApi.update()`

## 18. Admin UI Verification

- [ ] 18.1 Manually verify every scenario in `specs/portfolio-admin-dashboard/spec.md`
- [x] 18.2 Run the client build/typecheck and fix all errors

## 19. Public Site — Projects Migration

- [x] 19.1 Add a small loading/empty/error-aware data-fetching hook for public sections
- [x] 19.2 Switch `Projects.tsx` and `pages/ProjectDetails.tsx` to `projectsApi`, adding loading/empty/error states
- [x] 19.3 Verify Voyager renders identically to the current static rendering (verified via live server), remove `src/data/projects.ts` and its now-unused imports (done)

## 20. Public Site — Skills Migration

- [x] 20.1 Switch `Skills.tsx` to `skillsApi` with loading/empty/error states
- [x] 20.2 Verify rendering, then remove `src/data/skills.ts` and its now-unused imports (done)

## 21. Public Site — Experience Migration

- [x] 21.1 Switch `Experience.tsx` to `experienceApi` with loading/empty/error states
- [x] 21.2 Verify rendering, then remove `src/data/experience.ts` and its now-unused imports (done)

## 22. Public Site — Certifications Migration

- [x] 22.1 Switch `Certifications.tsx` to `certificationsApi` with loading/empty/error states (including the existing "hidden when empty" behavior expressed as an explicit empty-state)
- [x] 22.2 Verify rendering, then remove `src/data/certifications.ts` and its now-unused imports (done)

## 23. Public Site — Profile Migration

- [x] 23.1 Switch the components reading profile data (`Hero.tsx`, `About.tsx`, `Contact.tsx`, `Footer.tsx`, `Navbar.tsx`) to `profileApi` with loading/error states
- [x] 23.2 Verify rendering, then remove `src/data/profile.ts` and unused profile-related types from `src/types/portfolio.ts` (done)

## 24. Cleanup

- [x] 24.1 Search the codebase for any remaining imports of `src/data/*` — none found
- [x] 24.2 Remove the now-empty `src/data/` directory and `src/types/portfolio.ts`

## 25. Security Review

- [ ] 25.1 Review CORS configuration for dev and prod origins (no wildcard on authenticated routes)
- [ ] 25.2 Confirm cookie `secure`/`SameSite` behavior is correct for production
- [ ] 25.3 Confirm no secrets, passwords, JWTs, or connection strings appear in logs, source, or git history for this change
- [ ] 25.4 Confirm `.env`, `.env.local`, `node_modules/`, `dist/`, `build/`, `coverage/` are gitignored for both `client` and `server`

## 26. Production Build & Deployment Prep

- [x] 26.1 Run production builds for both the client and `server`; fix all errors
- [ ] 26.2 Verify SPA fallback routing still covers `/admin/*` and `/projects/:slug` on the chosen static host
- [x] 26.3 Document local dev commands, environment variables, seed instructions, admin login setup, and deployment steps in `README.md`

## 27. End-to-End Verification

- [ ] 27.1 Walk the full scenario for Projects: public site loads Voyager from MongoDB → admin login → add a project → appears publicly → edit → public updates → delete → disappears
- [ ] 27.2 Repeat the same end-to-end walk for Skills, Experience, Certifications, and Profile
