## Purpose

Provides the authenticated `/admin` React dashboard through which the portfolio owner manages projects, skills, experience, certifications, and profile content, so that content changes no longer require editing source code.

## ADDED Requirements

### Requirement: Admin Login Page
`/admin/login` SHALL present a responsive email/password form that submits to the login API, and SHALL handle client-side validation, a loading state while the request is in flight, and a generic authentication-error message on failure.

#### Scenario: Successful login redirects to dashboard
- **WHEN** the admin submits correct credentials on `/admin/login`
- **THEN** they are redirected to the `/admin` dashboard

#### Scenario: Failed login shows generic error
- **WHEN** the admin submits incorrect credentials
- **THEN** the form displays "Invalid email or password" without indicating which field was wrong

#### Scenario: Loading state during submission
- **WHEN** the login form is submitted
- **THEN** the submit control is disabled and a loading indicator is shown until the request resolves

### Requirement: Session Restoration and Logout
On load, the admin app SHALL attempt to restore an existing session via the auth API; a Logout action SHALL invalidate the session and return the admin to `/admin/login`.

#### Scenario: Reload preserves session
- **WHEN** the admin reloads `/admin/projects` while holding a valid session cookie
- **THEN** they remain authenticated without being asked to log in again

#### Scenario: Logout ends session
- **WHEN** the admin clicks Logout
- **THEN** the session is invalidated and navigating to any `/admin/*` route afterward redirects to `/admin/login`

### Requirement: Protected Admin Routes
Every `/admin/*` route other than `/admin/login` SHALL require an authenticated session on the frontend, redirecting unauthenticated visitors to `/admin/login`. This client-side check is a UX convenience only; the corresponding backend authorization is defined in `portfolio-cms-api`.

#### Scenario: Unauthenticated direct navigation redirected
- **WHEN** an unauthenticated visitor navigates directly to `/admin/projects`
- **THEN** they are redirected to `/admin/login`

### Requirement: Dashboard Overview
`/admin` SHALL display counts of projects, skills, experience entries, and certifications fetched from their respective APIs, and SHALL provide quick-action links to add a new project, skill, experience entry, or certification. Counts SHALL NOT be hard-coded.

#### Scenario: Count reflects live data
- **WHEN** a new project is added via Project Management
- **THEN** the dashboard's project count reflects the addition on next load

### Requirement: Project Management
`/admin/projects` SHALL list all projects with title, featured, and published status, and support add, edit, delete-with-confirmation, and toggling featured/published. The project form SHALL include title, slug, short description, description, technologies, GitHub URL, live demo URL, image URL, featured, published, and display order, requiring title, slug, and description, validating supplied URLs, and enforcing slug uniqueness. It SHALL also include the project detail page's content fields (problem, solution, architecture, key features, challenges, technical decisions, what I learned) so a project's `/projects/:slug` page (per `portfolio-dynamic-content`) is fully manageable from the admin without editing source code.

#### Scenario: Delete requires confirmation
- **WHEN** the admin clicks Delete on a project
- **THEN** a confirmation step is required before the deletion request is sent

#### Scenario: Required field enforced
- **WHEN** the admin submits the project form without a title
- **THEN** a validation error is shown and the form is not submitted

### Requirement: Skills Management
`/admin/skills` SHALL support add, edit, delete, show/hide, and reorder actions, with fields name, category, icon, display order, and visible.

#### Scenario: Hiding a skill
- **WHEN** the admin toggles a skill to hidden
- **THEN** the skill's `visible` field is set to false and it remains editable in the admin list

### Requirement: Experience Management
`/admin/experience` SHALL support add, edit, delete, show/hide, and reorder actions, with fields company, role, location, start date, end date, current, description, responsibilities, technologies, display order, and visible. When "current" is enabled, the End Date field SHALL be disabled or hidden in the form.

#### Scenario: Current role hides end date
- **WHEN** the admin checks "Current" in the experience form
- **THEN** the End Date input is disabled or hidden

### Requirement: Certification Management
`/admin/certifications` SHALL support add, edit, delete, show/hide, and reorder actions, with fields name, issuer, issue date, credential ID, credential URL, description, display order, and visible.

#### Scenario: Deleting a certification requires confirmation
- **WHEN** the admin clicks Delete on a certification
- **THEN** a confirmation step is required before the deletion request is sent

### Requirement: Profile Management
`/admin/profile` SHALL allow editing name, headline, summary, email, location, GitHub URL, LinkedIn URL, resume URL, and profile image URL, and persist changes through the profile update API.

#### Scenario: Profile update persists
- **WHEN** the admin edits the headline and saves
- **THEN** the updated headline is persisted and shown on subsequent loads of `/admin/profile`
