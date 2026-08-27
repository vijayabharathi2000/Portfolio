## 1. Project Setup

- [x] 1.1 Scaffold the app with `npm create vite@latest portfolio -- --template react-ts`
- [x] 1.2 Install `react-router-dom`, `framer-motion`, `lucide-react`
- [x] 1.3 Install and configure Tailwind CSS using its current Vite setup instructions (verify current install steps before configuring)
- [x] 1.4 Configure ESLint and Prettier
- [x] 1.5 Verify `npm run dev` and `npm run build` both succeed on the empty scaffold

## 2. Design System & Theming

- [x] 2.1 Define centralized design tokens (typography, colors, spacing, border radius, shadows, breakpoints) in Tailwind config / CSS variables
- [x] 2.2 Implement `ThemeProvider` (System/Light/Dark) with `localStorage` persistence and `prefers-color-scheme` resolution for "System"
- [x] 2.3 Wire Tailwind `darkMode: "class"` strategy to the theme provider's resolved theme
- [x] 2.4 Add a theme toggle control accessible from the shell

## 3. Types & Data Layer

- [x] 3.1 Define shared types in `src/types/portfolio.ts` (Project, SkillCategory, ExperienceEntry, Certification)
- [x] 3.2 Create `src/data/projects.ts` with the `Project` interface and a single seeded Voyager entry (placeholder description/tech list marked for later real content)
- [x] 3.3 Create `src/data/skills.ts` with categorized skill data (Backend, Frontend, Cloud & Infrastructure, Databases & Caching, Observability & Tools)
- [x] 3.4 Create `src/data/experience.ts` supporting one or more entries, using placeholders for unsupplied fields
- [x] 3.5 Create `src/data/certifications.ts`, empty or placeholder-marked if no real certifications are supplied yet

## 4. App Shell & Routing

- [x] 4.1 Build `App.tsx` composing Navbar, routed `Main` content, and Footer
- [x] 4.2 Configure `react-router-dom` routes: `/` (Home) and `/projects/:slug` (ProjectDetails)
- [x] 4.3 Implement `Navbar.tsx`: sticky positioning, section links with smooth scroll, Resume button, mobile hamburger menu with accessible panel
- [x] 4.4 Implement `IntersectionObserver`-based active-section highlighting in the navbar
- [x] 4.5 Implement `Footer.tsx` (copyright, "Built with React + TypeScript", GitHub/LinkedIn links)
- [x] 4.6 Verify responsive shell behavior at 375px, 768px, 1024px, 1440px with no horizontal overflow (verified in group 12; found and fixed a navbar overlap at 768px by moving the mobile/desktop nav breakpoint from `md` to `lg`)

## 5. Hero & About Sections

- [x] 5.1 Implement `Hero.tsx` (name, tagline, intro, View My Work CTA, Download Resume CTA, GitHub/LinkedIn/email links) with fade/slide-up animation
- [x] 5.2 Implement `About.tsx` with the supplied professional introduction copy

## 6. Skills & Experience Sections

- [x] 6.1 Implement `Skills.tsx` rendering categorized cards from `skills.ts`
- [x] 6.2 Implement `Experience.tsx` rendering a timeline/card layout from `experience.ts`, supporting multiple entries and placeholder fields

## 7. Projects (Voyager)

- [x] 7.1 Implement `ProjectCard.tsx` (title, short description, technology list, GitHub/live links shown only when supplied)
- [x] 7.2 Implement `Projects.tsx` rendering only entries from `projects.ts` (Voyager only, no fake projects)
- [x] 7.3 Implement `pages/ProjectDetails.tsx` for `/projects/:slug`: Overview, Problem, Solution, Architecture, Technology Stack, Key Features, Challenges, Technical Decisions, What I Learned, GitHub, Live Demo — with placeholders where content is unsupplied
- [x] 7.4 Implement a "project not found" state for unmatched slugs

## 8. Certifications & Contact

- [x] 8.1 Implement `Certifications.tsx` (hidden or placeholder when `certifications.ts` is empty; otherwise lists name/issuer/year)
- [x] 8.2 Implement `Contact.tsx` with `mailto:` email link, GitHub link, LinkedIn link (no backend/contact form)

## 9. Resume, SEO & Accessibility

- [x] 9.1 Add `public/resume.pdf` and wire `/resume.pdf` links from Navbar and Hero (placeholder PDF generated pending the user's real resume — see note in 12.5)
- [x] 9.2 Add `favicon.svg`, page title, meta description, and Open Graph metadata
- [x] 9.3 Audit semantic HTML, heading hierarchy, `<button>`/`<a>` usage (no clickable `<div>`), alt text on meaningful images
- [x] 9.4 Verify full keyboard navigation with visible focus states across navbar, mobile menu, theme toggle, and all links/buttons (verified in group 12)

## 10. Animations Pass

- [x] 10.1 Apply Framer Motion: Hero fade+slide-up, section fade-into-viewport, card hover, navbar transition
- [x] 10.2 Confirm the site remains fully usable and visually coherent with animations disabled/reduced (`MotionConfig reducedMotion="user"` honors `prefers-reduced-motion`)

## 11. Netlify Deployment Configuration

- [x] 11.1 Add `public/_redirects` containing `/* /index.html 200`
- [x] 11.2 Confirm `npm run build` produces a working `dist` directory with no backend/runtime dependency
- [x] 11.3 Document/set Netlify build command (`npm run build`) and publish directory (`dist`) (via `netlify.toml`)
- [x] 11.4 Verify no API keys, tokens, or credentials exist anywhere in source or built output

## 12. Verification Pass

- [x] 12.1 Run `npm run build` and fix all TypeScript/build errors
- [x] 12.2 Manually verify every scenario in `specs/portfolio-shell/spec.md`, `specs/portfolio-content/spec.md`, `specs/portfolio-projects/spec.md`, and `specs/portfolio-deployment/spec.md` (verified with a headless-browser pass: sticky navbar, mobile menu open/close, active-section highlighting, all three theme modes + persistence, home/project-details/not-found routing, View My Work scroll, mailto/GitHub/LinkedIn links, keyboard tab order and focus rings)
- [x] 12.3 Test responsive layout at 375px, 768px, 1024px, 1440px on the fully-built site (found and fixed a navbar overlap at 768px; all four widths now render with no horizontal overflow or overlap)
- [x] 12.4 Run a Lighthouse pass and address any major Performance/Accessibility/Best Practices/SEO regressions (Performance 99, Accessibility 100, Best Practices 100, SEO 100 — fixed a non-`<li>` child in the Experience `<ol>` and added `public/robots.txt`)
- [x] 12.5 Confirm all placeholder content is clearly marked (not fabricated) and note remaining placeholders for the user to fill in before public launch (see summary below)
