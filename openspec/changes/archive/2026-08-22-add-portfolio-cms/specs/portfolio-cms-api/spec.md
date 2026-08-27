## Purpose

Provides the authenticated Node.js/Express/MongoDB backend that stores portfolio content (profile, projects, skills, experience, certifications) and exposes it through a public read-only REST API and an authenticated admin CRUD REST API, replacing the current static, code-embedded content.

## ADDED Requirements

### Requirement: Content Data Model
The system SHALL persist `users`, `profile`, `projects`, `skills`, `experiences`, and `certifications` as distinct MongoDB collections via Mongoose models, each recording `createdAt`/`updatedAt` timestamps, matching the field sets defined in `PORTFOLIO_CMS_PLAN.md` (e.g. a project has title, slug, shortDescription, description, technologies, githubUrl, liveUrl, imageUrl, featured, displayOrder, published).

#### Scenario: Creating a project persists all supplied fields
- **WHEN** an admin creates a project with title, slug, description, technologies, and displayOrder
- **THEN** the stored document includes all supplied fields plus `createdAt` and `updatedAt` timestamps

### Requirement: Public Content Endpoints
The system SHALL expose `GET /api/profile`, `GET /api/projects`, `GET /api/projects/:slug`, `GET /api/skills`, `GET /api/experience`, `GET /api/certifications`, and `GET /api/health` without requiring authentication, and these routes SHALL be read-only.

#### Scenario: Anonymous request succeeds
- **WHEN** a request with no authentication cookie or token is made to `GET /api/projects`
- **THEN** the request succeeds and returns project data

#### Scenario: Public routes accept no mutations
- **WHEN** a client sends a write request (POST/PUT/DELETE) to a public content path such as `/api/projects`
- **THEN** the server does not perform any mutation (the route is not defined for writes)

### Requirement: Published/Visible Filtering and Ordering
Public endpoints SHALL return only `published` projects, `visible` skills, `visible` experience entries, and `visible` certifications, sorted ascending by `displayOrder`.

#### Scenario: Unpublished project excluded from list
- **WHEN** a project has `published: false`
- **THEN** it is omitted from the response of `GET /api/projects`

#### Scenario: Unpublished project detail not found
- **WHEN** `GET /api/projects/:slug` is called for a project with `published: false`
- **THEN** the response is a 404 not-found error

#### Scenario: Results ordered by displayOrder
- **WHEN** multiple visible skills exist with different `displayOrder` values
- **THEN** `GET /api/skills` returns them sorted ascending by `displayOrder`

### Requirement: Admin Authentication
The system SHALL authenticate the admin via email and password, comparing against a bcrypt password hash, and on success SHALL issue a JWT delivered as an HTTP-only cookie (secure in production, with an appropriate SameSite setting and an expiration). No public registration endpoint SHALL exist.

#### Scenario: Successful login
- **WHEN** `POST /api/auth/login` is called with the correct admin email and password
- **THEN** the response is successful and an HTTP-only session cookie containing the JWT is set

#### Scenario: Failed login gives a generic error
- **WHEN** `POST /api/auth/login` is called with an incorrect email or password
- **THEN** the response is a 401 with the message "Invalid email or password", without indicating whether the email exists

#### Scenario: Session lookup
- **WHEN** `GET /api/auth/me` is called with a valid session cookie
- **THEN** it returns the authenticated admin's identity; without a valid cookie it returns 401

#### Scenario: Logout clears session
- **WHEN** `POST /api/auth/logout` is called
- **THEN** the session cookie is cleared and subsequent authenticated requests using the old cookie fail

### Requirement: Admin Content Management API
The system SHALL expose authenticated create/update/delete endpoints under `/api/admin/*` for projects, skills, experience, and certifications, and an update endpoint for the single profile document. It SHALL also expose authenticated read endpoints under `/api/admin/*` returning the full, unfiltered record set (including unpublished projects and hidden skills/experience/certifications) so the admin dashboard and list pages can manage and count everything, not just what the public API exposes.

#### Scenario: Authenticated read returns unfiltered data
- **WHEN** an authenticated admin calls `GET /api/admin/projects`
- **THEN** the response includes both published and unpublished projects

#### Scenario: Authenticated create
- **WHEN** an authenticated admin sends `POST /api/admin/projects` with valid project data
- **THEN** the project is persisted and returned with a 201-level success response

#### Scenario: Authenticated update is reflected publicly
- **WHEN** an authenticated admin updates a skill's `visible` field to `false`
- **THEN** the skill no longer appears in `GET /api/skills`

#### Scenario: Authenticated delete
- **WHEN** an authenticated admin sends `DELETE /api/admin/certifications/:id`
- **THEN** the certification is removed and no longer returned by any endpoint

#### Scenario: Unauthenticated write rejected
- **WHEN** a request without a valid session is sent to any `/api/admin/*` endpoint
- **THEN** the response is 401 and no data is mutated

### Requirement: Backend-Enforced Authorization
Every `/api/admin/*` endpoint SHALL independently verify a valid, unexpired JWT server-side before executing controller logic, regardless of what the frontend allows.

#### Scenario: Tampered or expired token rejected
- **WHEN** a request to an `/api/admin/*` endpoint carries a missing, expired, or invalid JWT
- **THEN** authentication middleware rejects it with 401 before any controller or service logic runs

### Requirement: Input Validation
The system SHALL validate all admin write requests using one validation library applied consistently, checking required fields, string lengths, URL format, date format, enum/category values, and MongoDB ObjectId format, and SHALL enforce slug uniqueness for projects.

#### Scenario: Missing required field rejected
- **WHEN** `POST /api/admin/projects` is called without a `title`
- **THEN** the response is 400 with `success: false`, message "Validation failed", and an `errors` entry naming the `title` field

#### Scenario: Duplicate slug rejected
- **WHEN** `POST /api/admin/projects` is called with a `slug` that already exists on another project
- **THEN** the request is rejected with a validation error

#### Scenario: Malformed URL rejected
- **WHEN** a project's `githubUrl` is supplied but is not a valid URL
- **THEN** the request is rejected with a validation error

### Requirement: Consistent Response Envelope and Error Handling
All API responses SHALL use `{ success: true, data }` on success and `{ success: false, message }` (optionally with an `errors` array for validation failures) on failure. Stack traces and internal error details SHALL NOT be exposed when `NODE_ENV=production`.

#### Scenario: Successful response shape
- **WHEN** any successful request completes
- **THEN** the JSON body has `success: true` and a `data` field

#### Scenario: Production error hides internals
- **WHEN** an unhandled server error occurs with `NODE_ENV=production`
- **THEN** the client receives a generic error message with `success: false` and no stack trace or internal details

### Requirement: Health Check
`GET /api/health` SHALL return a 200 response indicating the service is healthy without exposing database credentials, connection strings, or other secrets.

#### Scenario: Health check response
- **WHEN** `GET /api/health` is called
- **THEN** it returns a 200 response such as `{ "status": "ok" }` containing no credentials or secrets

### Requirement: CORS Restriction
The server SHALL restrict cross-origin access to an explicit allow-list of configured client origins (development and production) rather than a wildcard, for any endpoint that participates in authentication.

#### Scenario: Disallowed origin blocked
- **WHEN** a browser request to an authenticated endpoint originates from an origin not in the configured allow-list
- **THEN** the CORS policy blocks the response from being read by that origin

### Requirement: Secure Request Logging
The server SHALL log, for each request, the HTTP method, route, status code, and duration, and for errors, enough detail to diagnose them. Logs SHALL NEVER include passwords, JWTs, cookies, secrets, or the MongoDB connection string.

#### Scenario: Login attempt logged safely
- **WHEN** `POST /api/auth/login` is handled, successfully or not
- **THEN** the log entry includes method, route, status code, and duration, and never includes the submitted password or the issued JWT

### Requirement: Login Rate Limiting
The system SHALL rate-limit `POST /api/auth/login` to reduce brute-force credential guessing.

#### Scenario: Excessive login attempts throttled
- **WHEN** login attempts from the same source exceed the configured threshold within the configured window
- **THEN** subsequent attempts are rejected before credential comparison, until the window resets

### Requirement: Seed/Migration Script
A development-safe seed/migration script SHALL upsert the admin user, profile, and existing content (the Voyager project, and the skills, experience, and certifications already present in the static portfolio) using only values already present in the existing `src/data/*.ts` files, without inventing new content, and SHALL be safe to re-run without duplicating records or deleting unrelated data.

#### Scenario: Idempotent re-run
- **WHEN** the seed script is executed twice against the same database
- **THEN** exactly one admin user and one Voyager project exist afterward, not duplicates

#### Scenario: Seed content matches existing static data
- **WHEN** the seed script populates the Voyager project
- **THEN** its title, description, and technologies match the values already present in `src/data/projects.ts` rather than fabricated values
