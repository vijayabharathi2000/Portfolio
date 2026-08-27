## Purpose

Present featured projects from a single data-driven source, seeded with only the real Voyager project, and provide a details page per project, so future projects can be added without restructuring the UI.

## ADDED Requirements

### Requirement: Data-Driven Project Model
The system SHALL define a single project data source containing, for each project, at minimum: id, title, short description, technologies, slug, and optional fields for a full description, GitHub URL, live URL, and featured flag.

#### Scenario: Adding a project requires only a data entry
- **WHEN** a new project object is added to the project data source
- **THEN** it becomes available for rendering in the Featured Projects list and at its own details route without modifying the Projects or ProjectCard components

### Requirement: Featured Projects List Shows Only Real Projects
The system SHALL render the Featured Projects section using only entries present in the project data source, and SHALL contain exactly one entry — Voyager — until additional real projects are added to that data source.

#### Scenario: Only Voyager appears initially
- **WHEN** the Featured Projects section is rendered against the initial project data source
- **THEN** only the Voyager project card is displayed and no placeholder or example project is shown

### Requirement: Project Card Summary
The system SHALL render each featured project as a card showing its title, short description, technology list, and links to its details page and (when supplied) its GitHub repository and live demo.

#### Scenario: Project card without a live demo
- **WHEN** a project entry has no `liveUrl` supplied
- **THEN** the project card omits the live-demo link rather than showing a broken or placeholder link

### Requirement: Project Details Page
The system SHALL provide a project details page at `/projects/:slug` presenting Overview, Problem, Solution, Architecture, Technology Stack, Key Features, Challenges, Technical Decisions, and What I Learned sections, along with links to GitHub and any live demo, using placeholder text for any section whose real content has not yet been supplied.

#### Scenario: Voyager details page renders known sections
- **WHEN** a visitor navigates to `/projects/voyager`
- **THEN** the page renders the Voyager project's title and every details section, using placeholders for sections whose content is not yet supplied

#### Scenario: Unknown project slug
- **WHEN** a visitor navigates to `/projects/does-not-exist`
- **THEN** the system displays a clear "project not found" state rather than an error or blank page
