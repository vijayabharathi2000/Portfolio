## Purpose

Provide the responsive application shell — navigation, footer, client-side routing, and theme switching — that every page and content section renders within.

## ADDED Requirements

### Requirement: Sticky Navigation Bar
The system SHALL display a sticky navigation bar containing the site logo/name, links to each main section (Home, About, Skills, Experience, Projects, Contact), and a Resume action, visible at the top of the viewport at all scroll positions.

#### Scenario: Navbar remains visible while scrolling
- **WHEN** a visitor scrolls down the home page
- **THEN** the navigation bar remains visible fixed at the top of the viewport

#### Scenario: Section link scrolls to target section
- **WHEN** a visitor clicks a section link (e.g. "Skills") in the navbar while on the home page
- **THEN** the page smoothly scrolls to the corresponding section

### Requirement: Mobile Navigation Menu
On viewports narrower than the desktop breakpoint, the system SHALL collapse the navigation links behind a hamburger menu control that toggles an accessible mobile navigation panel.

#### Scenario: Opening the mobile menu
- **WHEN** a visitor on a mobile-width viewport taps the hamburger icon
- **THEN** a navigation panel opens showing links to every main section and the Resume action

#### Scenario: Selecting a link closes the mobile menu
- **WHEN** a visitor taps a section link inside the open mobile navigation panel
- **THEN** the panel closes and the page navigates/scrolls to the selected section

### Requirement: Active Section Indication
While a visitor scrolls through the home page, the system SHALL visually indicate in the navbar which main section is currently in view.

#### Scenario: Highlight follows scroll position
- **WHEN** a visitor scrolls until the "Experience" section occupies the majority of the viewport
- **THEN** the "Experience" navbar link is visually marked as active and no other link is marked active

### Requirement: Client-Side Routing
The system SHALL provide client-side routing with a home route (`/`) rendering all main sections, and a project details route (`/projects/:slug`) rendering the details page for the project matching `slug`.

#### Scenario: Home route renders sections
- **WHEN** a visitor navigates to `/`
- **THEN** the Navbar, Hero, About, Skills, Experience, Featured Projects, Certifications, Contact, and Footer are rendered in that order

#### Scenario: Project details route renders matching project
- **WHEN** a visitor navigates to `/projects/voyager`
- **THEN** the project details page for the Voyager project is rendered

#### Scenario: Direct navigation to a nested route works
- **WHEN** a visitor loads `/projects/voyager` directly (not via in-app navigation)
- **THEN** the project details page renders correctly rather than a routing error

### Requirement: Theme Switching
The system SHALL allow a visitor to choose between System, Light, and Dark appearance, apply the chosen theme across every page, and persist the choice in `localStorage` so it is restored on the next visit.

#### Scenario: Selecting a theme applies immediately
- **WHEN** a visitor selects "Dark" from the theme control
- **THEN** the entire site immediately renders using the dark color scheme

#### Scenario: Theme choice persists across reloads
- **WHEN** a visitor selects "Light" and then reloads the page
- **THEN** the site renders in the light color scheme without the visitor reselecting it

#### Scenario: System theme follows OS preference
- **WHEN** a visitor selects "System" and their operating system is set to dark mode
- **THEN** the site renders using the dark color scheme

### Requirement: Responsive Layout Without Overflow
The system SHALL render the shell (navbar, main content area, footer) without horizontal scrolling or overlapping elements at viewport widths of 375px, 768px, 1024px, and 1440px.

#### Scenario: No horizontal scroll at mobile width
- **WHEN** the site is viewed at a 375px-wide viewport
- **THEN** no horizontal scrollbar appears and no content is clipped or overlapping
