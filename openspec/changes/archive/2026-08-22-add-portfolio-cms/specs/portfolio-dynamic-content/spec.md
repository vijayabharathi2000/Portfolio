## Purpose

Defines how the existing public portfolio sections switch from static, hard-coded data to the new CMS API as their source of truth, incrementally and without ever showing a blank section, while preserving the site's current design and behavior.

## ADDED Requirements

### Requirement: Centralized Frontend API Layer
The frontend SHALL access all backend data through a centralized API layer organized by domain (`authApi`, `projectsApi`, `skillsApi`, `experienceApi`, `certificationsApi`, `profileApi`) rather than issuing `fetch`/Axios calls directly inside individual components.

#### Scenario: Component uses the API layer
- **WHEN** the Projects component needs project data
- **THEN** it obtains that data by calling `projectsApi` rather than calling `fetch`/Axios directly or importing static data

### Requirement: Dynamic Public Sections
The Profile, Projects, Skills, Experience, and Certifications sections of the public site SHALL render data retrieved from their corresponding public API endpoints instead of the static `src/data/*.ts` modules, preserving the existing visual design, layout, and responsiveness of each section.

#### Scenario: Home page shows Voyager from the API
- **WHEN** the public home page loads after Projects has been migrated
- **THEN** the Projects section displays Voyager using the content returned by `GET /api/projects`

#### Scenario: Project details page reads from the API
- **WHEN** a visitor opens `/projects/voyager` after Projects has been migrated
- **THEN** the Overview/Problem/Solution/Architecture/Technology Stack/Key Features/Challenges/Technical Decisions/What I Learned content is sourced from `GET /api/projects/:slug`

### Requirement: Loading, Empty, and Error States
Each API-driven public section SHALL present a distinct loading indicator while its request is pending, an explicit empty-state message when the API returns no items, and an explicit error message if the request fails. No section SHALL render blank in any of these cases.

#### Scenario: Loading indicator shown
- **WHEN** the request to `GET /api/skills` is pending
- **THEN** the Skills section shows a loading indicator rather than an empty section

#### Scenario: Empty state shown
- **WHEN** `GET /api/certifications` succeeds with an empty list
- **THEN** the Certifications section shows an explicit message such as "No certifications available" rather than rendering nothing

#### Scenario: Error state shown
- **WHEN** `GET /api/experience` fails (network or server error)
- **THEN** the Experience section shows an explicit message such as "Unable to load experience" rather than being left blank

### Requirement: Incremental Migration Without Data Loss
Sections SHALL be switched from static data to the API one at a time, each only after its backend endpoint and response have been verified; a section not yet migrated SHALL continue to render from its existing static data module.

#### Scenario: Partially migrated state remains correct
- **WHEN** Projects has been migrated to the API but Skills has not yet been migrated
- **THEN** the Skills section still renders correctly from `src/data/skills.ts`

### Requirement: Static Data Removal After Verification
A static data module SHALL be removed from the codebase only after every public section that consumed it has been migrated to the API and verified to render correctly.

#### Scenario: Cleanup after full migration
- **WHEN** Projects, Skills, Experience, Certifications, and Profile have all been confirmed working against the live API
- **THEN** `src/data/*.ts` files and any remaining imports of them no longer exist in the codebase
