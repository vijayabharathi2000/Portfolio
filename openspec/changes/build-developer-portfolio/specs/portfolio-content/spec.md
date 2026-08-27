## Purpose

Present the developer's real introduction, background, skills, experience, certifications, and contact options as data-driven sections on the home page, without ever fabricating content.

## ADDED Requirements

### Requirement: Hero Introduction
The system SHALL display a Hero section identifying the developer by name, a short professional tagline, a brief introduction, a "View My Work" call-to-action, a "Download Resume" call-to-action, and links to GitHub, LinkedIn, and email.

#### Scenario: Hero call-to-action navigates to projects
- **WHEN** a visitor clicks "View My Work" in the Hero section
- **THEN** the page scrolls to the Featured Projects section

#### Scenario: Hero does not state fabricated experience
- **WHEN** the Hero content is rendered
- **THEN** it does not display a specific years-of-experience figure unless that figure was explicitly supplied as real content

### Requirement: About Section
The system SHALL display an About section with a concise professional introduction covering the developer's actual focus areas (e.g. .NET development, ASP.NET Core, REST APIs, microservices, Azure, cloud-native development).

#### Scenario: About renders supplied content
- **WHEN** the About section is rendered
- **THEN** it displays the professional introduction text without exaggerated or fabricated claims

### Requirement: Categorized Skills Display
The system SHALL display skills grouped into categories (e.g. Backend, Frontend, Cloud & Infrastructure, Databases & Caching, Observability & Tools) sourced from a single data source, rather than as one undifferentiated list.

#### Scenario: Skills grouped by category
- **WHEN** the Skills section is rendered
- **THEN** each skill appears under its assigned category heading

#### Scenario: Adding a skill requires only a data change
- **WHEN** a new skill entry is added to the skills data source
- **THEN** it appears in the rendered Skills section under its category without any change to the Skills component code

### Requirement: Data-Driven Experience Timeline
The system SHALL display a professional experience timeline sourced from a single data source, supporting one or more entries (title, company, dates, responsibilities), and SHALL NOT display any company name, date, responsibility, or achievement that was not supplied as real content.

#### Scenario: Multiple experience entries render as a timeline
- **WHEN** the experience data source contains two or more entries
- **THEN** the Experience section renders each entry in its timeline without requiring component changes

#### Scenario: Missing experience details show a placeholder
- **WHEN** an experience field (e.g. company name) has not yet been supplied
- **THEN** the section displays a clearly marked placeholder instead of an invented value

### Requirement: Certifications Display
The system SHALL display a Certifications section sourced from a single data source, listing only certifications actually completed, and SHALL hide the section or show a clean placeholder when no certifications are supplied.

#### Scenario: No certifications supplied
- **WHEN** the certifications data source is empty
- **THEN** the Certifications section is hidden or shows a placeholder, and no fabricated certification is displayed

#### Scenario: Certifications supplied
- **WHEN** the certifications data source contains one or more entries
- **THEN** each entry's name, issuer, and year are displayed

### Requirement: Contact Options Without a Backend
The system SHALL display a Contact section offering an email contact via a `mailto:` link, a GitHub profile link, and a LinkedIn profile link, without requiring a backend service or contact-form submission endpoint.

#### Scenario: Email contact opens mail client
- **WHEN** a visitor clicks the email contact option
- **THEN** the visitor's default mail client opens a new message addressed to the developer's contact email

#### Scenario: GitHub and LinkedIn links open external profiles
- **WHEN** a visitor clicks the GitHub or LinkedIn link in the Contact section
- **THEN** the corresponding external profile opens in a new tab
