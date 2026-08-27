## Purpose

Ensure the portfolio is downloadable/discoverable (resume, SEO), accessible, and deployable as a fully static site on Netlify with no backend, database, or secrets.

## ADDED Requirements

### Requirement: Resume Download
The system SHALL provide a downloadable resume file at a static path and expose "Download Resume" actions from the Navbar and Hero that link directly to it.

#### Scenario: Downloading the resume
- **WHEN** a visitor clicks "Download Resume" in the Navbar or Hero
- **THEN** the browser downloads or opens `resume.pdf` from the site's static assets

### Requirement: SEO Metadata
The system SHALL include a descriptive page title, meta description, Open Graph metadata, and a favicon, using accurate (non-exaggerated) copy describing the developer's actual focus.

#### Scenario: Page metadata present
- **WHEN** the home page is loaded
- **THEN** the document head contains a title, meta description, Open Graph tags, and a favicon reference

### Requirement: Accessibility Baseline
The system SHALL use semantic HTML with a correct heading hierarchy, keyboard-operable navigation with visible focus states, descriptive alt text on meaningful images, native `<button>` elements for actions, and native `<a>` elements for navigation links (no clickable `<div>` elements).

#### Scenario: Full keyboard navigation
- **WHEN** a visitor navigates the site using only the keyboard (Tab/Shift+Tab/Enter)
- **THEN** every interactive control (navbar links, theme toggle, mobile menu toggle, buttons, project links) is reachable and operable, with a visible focus indicator at each step

#### Scenario: Images have alt text
- **WHEN** a meaningful image is rendered anywhere on the site
- **THEN** it has descriptive, non-empty alt text

### Requirement: Static Deployment With No Backend or Secrets
The system SHALL build as a static site via `npm run build` producing a `dist` directory suitable for Netlify hosting, and SHALL NOT require a backend service, database, authentication system, or any private API key/secret to function.

#### Scenario: Production build succeeds standalone
- **WHEN** `npm run build` is run
- **THEN** it completes successfully and produces a `dist` directory that serves the full site with no server-side dependency

#### Scenario: No secrets present in client code
- **WHEN** the built output or source code is inspected
- **THEN** it contains no API keys, private tokens, passwords, or database credentials

### Requirement: SPA Routing Fallback on Netlify
The system SHALL configure a Netlify redirect rule so that directly requesting a nested route (e.g. `/projects/voyager`) serves the single-page app rather than a 404.

#### Scenario: Direct load of a nested route in production
- **WHEN** a visitor requests `/projects/voyager` directly from the deployed Netlify site (e.g. via a bookmark or shared link)
- **THEN** the site loads and renders the Voyager project details page rather than a Netlify 404 page
