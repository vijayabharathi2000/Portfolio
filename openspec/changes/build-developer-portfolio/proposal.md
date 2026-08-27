## Why

There is no portfolio website yet. A live, professional portfolio is needed to showcase .NET/backend/cloud experience (and growing React/AI interest) to recruiters, engineering managers, and technical interviewers, with a resume download and links to GitHub/LinkedIn. `PORTFOLIO_PLAN.md` already captures the full requirements; this change turns the P0 (must-have) and P1 (important) scope of that plan into a buildable spec, deferring P2 items (GitHub API integration, additional projects, blog, analytics, custom domain).

## What Changes

- Scaffold a React + TypeScript + Vite app with Tailwind CSS, ESLint, and Prettier.
- Build a responsive layout shell: sticky Navbar (with mobile hamburger menu), Footer, and React Router-based routing.
- Implement dark/light/system theme switching, persisted in `localStorage`, via a centralized theme mechanism.
- Implement data-driven content sections: Hero, About, Skills (categorized), Experience (timeline), Certifications, Contact (mailto-based, no backend).
- Implement a data-driven Projects system: `src/data/projects.ts` model, `ProjectCard` component, and a `/projects/:slug` details page, initially populated with only the Voyager project (placeholders where real details are not yet supplied).
- Add resume download support via `public/resume.pdf` and a `/resume.pdf` link from Navbar and Hero.
- Add SEO metadata (title, description, Open Graph, favicon) and baseline accessibility (semantic HTML, heading hierarchy, keyboard navigation, focus states, alt text).
- Add subtle Framer Motion animations (hero fade/slide-up, section fade-in-on-scroll, card hover) that degrade gracefully if disabled.
- Configure the app for static deployment on Netlify, including a `public/_redirects` SPA fallback (`/* /index.html 200`).
- Explicitly out of scope for this change (P2, deferred): GitHub API integration, additional project entries beyond Voyager, blog, analytics, custom domain.

## Capabilities

### New Capabilities
- `portfolio-shell`: Responsive app shell — Navbar, Footer, routing, and dark/light/system theme switching with persistence.
- `portfolio-content`: Data-driven informational sections — Hero, About, Skills, Experience, Certifications, Contact.
- `portfolio-projects`: Data-driven project model, project card, and project details page, seeded with only the Voyager project.
- `portfolio-deployment`: Resume download, SEO metadata, accessibility baseline, and static Netlify deployment (build, SPA redirects, no backend/secrets).

### Modified Capabilities
None — this is the first change in this repository; no existing specs exist yet.

## Impact

- New codebase under a Vite React+TS project (structure per `PORTFOLIO_PLAN.md` section 20): `src/components/`, `src/pages/`, `src/data/`, `src/types/`, `public/`.
- New dependencies: `react-router-dom`, `framer-motion`, `lucide-react`, Tailwind CSS and its build tooling.
- New static assets: `public/resume.pdf`, `public/favicon.svg`, `public/_redirects`.
- No backend, database, authentication, or secrets are introduced (version 1 is a fully static site).
- Deployment target: Netlify free tier, build command `npm run build`, publish directory `dist`.
