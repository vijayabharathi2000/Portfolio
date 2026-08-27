# Portfolio CMS

A full-stack, API-driven portfolio system. Built with React/TypeScript frontend, Node.js/Express backend, and MongoDB.

## Project Structure

```
Portfolio/
├── frontend/          # React SPA with admin dashboard
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
├── server/            # Node.js/Express API
│   ├── src/
│   ├── scripts/
│   ├── tests/
│   ├── package.json
│   └── .env.example
├── openspec/          # Spec-driven change documentation
└── README.md          # This file
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB instance)

### Setup

1. **Install dependencies** (all at once)
   ```bash
   npm run install-all
   ```
   This installs dependencies for the root, frontend, and server.

2. **Configure environment**
   - Frontend: copy `frontend/.env.example` to `frontend/.env.local`, set `VITE_API_BASE_URL` to your backend URL
   - Server: copy `server/.env.example` to `server/.env`, set:
     ```
     NODE_ENV=development
     PORT=5000
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio
     JWT_SECRET=your-secret-key (generate with: openssl rand -hex 32)
     JWT_EXPIRES_IN=24h
     CLIENT_URL=http://localhost:5173
     COOKIE_SECURE=false (true in production)
     ADMIN_EMAIL=your@email.com
     ADMIN_PASSWORD=your-secure-password
     ```

3. **Seed the database**
   ```bash
   npm run seed
   ```
   This populates the admin user, profile, Voyager project, skills, and experience from the static content.

### Development

**Terminal 1: Backend**
```bash
npm run server
# Listens on http://localhost:5000
```

**Terminal 2: Frontend** (from root)
```bash
npm run dev
# Listens on http://localhost:5173
```

Or use the convenience scripts from root:
```bash
npm run dev        # Start frontend dev server
npm run server     # Start backend dev server
npm run build      # Build both frontend and backend
npm run test       # Run backend tests
npm run seed       # Seed database
```

Open http://localhost:5173 in your browser.

### Admin Dashboard

Navigate to http://localhost:5173/admin/login

**Default Credentials** (change after first login)
- Email: (from ADMIN_EMAIL)
- Password: (from ADMIN_PASSWORD)

Manage projects, skills, experience, certifications, and profile data.

## Production Deployment

### Frontend

Build and serve the `frontend/dist/` directory as static files with SPA fallback:
```bash
npm run build
# Serve frontend/dist/ on your chosen host (Vercel, Netlify, AWS S3+CloudFront, etc.)
```

**SPA Fallback**: Configure your host to serve `index.html` for all non-asset routes (including `/admin/*` and `/projects/:slug`).

### Backend

Build and deploy to a Node.js host (Heroku, Railway, EC2, etc.):
```bash
npm run build
# Deploy server/ to your host and run: npm start
# Set environment variables on the host (see server/.env.example)
```

**Database**: Use MongoDB Atlas or self-hosted MongoDB. The seed script is idempotent — safe to re-run.

**CORS**: In production, set `CLIENT_URL` to your frontend's actual origin. Authentication endpoints use HTTP-only cookies with `Secure` and `SameSite=Strict`.

## Testing

```bash
npm run test
```

Automated tests cover login, admin authorization, project CRUD, public filtering, validation, and seed idempotency against an in-memory MongoDB.

## Architecture

- **Frontend** (`frontend/src/`): React 18 + TypeScript, Vite, TailwindCSS
  - API client layer (`src/services/`)
  - Public pages (home, project detail)
  - Admin dashboard with auth context
  - Custom hooks for loading/error/success state management
  
- **Backend** (`server/src/`): Express + TypeScript, Mongoose, Zod, bcryptjs
  - Route → Controller → Service → Model layering
  - Seed script for reproducible data initialization
  - HTTP-only JWT cookies for admin sessions
  - Public/Admin endpoint separation

- **Database**: MongoDB with Mongoose schemas for Users, Profile, Projects, Skills, Experience, Certifications

## API Endpoints

### Public
- `GET /api/health` — Server health check
- `GET /api/profile` — Portfolio metadata
- `GET /api/projects` — Published projects
- `GET /api/projects/:slug` — Project detail
- `GET /api/skills` — Visible skills
- `GET /api/experience` — Visible experience entries
- `GET /api/certifications` — Visible certifications

### Authentication
- `POST /api/auth/login` — Admin login
- `POST /api/auth/logout` — Admin logout
- `GET /api/auth/me` — Current admin user

### Admin (requires auth)
- `GET /api/admin/*` — Full unfiltered lists
- `POST /api/admin/{resource}` — Create
- `PUT /api/admin/{resource}/:id` — Update (partial)
- `DELETE /api/admin/{resource}/:id` — Delete

## Key Design Decisions

1. **Incremental Migration**: Static data files were migrated to API-backed rendering incrementally, with each section verified against the API before removing the static import.

2. **Partial Updates**: PATCH-like PUT endpoints preserve untouched fields (not replaced by defaults).

3. **Public/Admin Separation**: Public endpoints filter by `published` or `visible`; admin endpoints return all records.

4. **Idempotent Seed**: The seed script uses upsert with natural unique keys (email, slug, company+role) — re-running is safe.

5. **HTTP-Only Cookies**: Admin authentication uses secure, SameSite-strict cookies, not localStorage.

## Troubleshooting

- **"Cannot connect to MongoDB"**: Check `MONGODB_URI` and network connectivity
- **Admin login fails**: Verify `ADMIN_EMAIL`/`ADMIN_PASSWORD` match the seed
- **Seed runs but data doesn't appear**: Re-run `npm run seed` (it's idempotent)
- **API returns 404 for public projects**: Ensure projects are marked `published: true` in the admin dashboard
- **CORS errors**: Set `CLIENT_URL` to the frontend's actual origin in `server/.env`

## License

MIT
