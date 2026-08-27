# QuickStart Guide

## New Project Structure

```
Portfolio/
├── frontend/          ← React SPA + Admin Dashboard
├── server/            ← Node.js Express API
├── openspec/          ← Specs & planning
└── package.json       ← Root scripts
```

## Running the Project

### 1. Install Dependencies
```bash
cd Portfolio
npm run install-all
```

### 2. Configure Environments

**Frontend** (`frontend/.env.local`):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

**Backend** (`server/.env`):
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-user:your-pass@your-cluster.mongodb.net/portfolio
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
```

### 3. Start Both Services

**Terminal 1** (Backend):
```bash
npm run server
# Listens on http://localhost:5000
```

**Terminal 2** (Frontend):
```bash
npm run dev
# Listens on http://localhost:5173
```

### 4. Access the Application

| URL | Purpose |
|-----|---------|
| http://localhost:5173 | Public portfolio site |
| http://localhost:5173/projects/voyager | Project detail page |
| http://localhost:5173/admin/login | Admin login |
| http://localhost:5000/api/health | API health check |

**Admin Credentials**:
- Email: `admin@example.com`
- Password: (from `ADMIN_PASSWORD` env var)

## Root Commands

From `Portfolio/` directory:

```bash
npm run dev            # Start frontend dev server
npm run server         # Start backend dev server
npm run build          # Build both for production
npm run test           # Run backend tests
npm run seed           # Seed database
npm run type-check     # TypeScript check
npm run lint           # Frontend linting
npm run install-all    # Install all dependencies
```

## Frontend Folder Structure

```
frontend/
├── src/
│   ├── admin/         # Auth, login, dashboard, CRUD forms
│   ├── components/     # Projects, Skills, Experience cards
│   ├── pages/         # Home, ProjectDetails
│   ├── services/      # API clients (authApi, projectsApi, etc.)
│   ├── hooks/         # useApiResource, useProfile, useAuth
│   ├── lib/           # Context, providers
│   └── types/         # TypeScript interfaces (cms.ts)
├── public/
├── dist/              # Build output
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Backend Folder Structure

```
server/
├── src/
│   ├── models/        # Mongoose schemas
│   ├── controllers/     # Route handlers
│   ├── services/      # Business logic
│   ├── routes/        # API endpoints
│   ├── validators/     # Zod request schemas
│   ├── middleware/     # Auth, validation, logging
│   ├── config/        # Environment, database config
│   ├── utils/         # Helpers
│   ├── db/            # MongoDB connection
│   ├── app.ts         # Express setup
│   └── server.ts      # Entry point
├── scripts/
│   └── seed.ts        # Database seeding
├── tests/
│   ├── api.test.ts    # API tests
│   └── seed.test.ts   # Seed tests
├── dist/              # Build output
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Common Tasks

### Build for Production
```bash
npm run build
# Creates:
# - frontend/dist/     (static files)
# - server/dist/       (JavaScript)
```

### Deploy Frontend
1. Build: `npm run build`
2. Deploy `frontend/dist/` to Vercel, Netlify, AWS S3+CloudFront, etc.
3. Configure SPA fallback to serve `index.html` for all routes

### Deploy Backend
1. Build: `npm run build`
2. Set environment variables on your host
3. Run: `npm --prefix server start`
4. Host on Heroku, Railway, AWS EC2, etc.

### Run Tests
```bash
npm run test
# Runs 14 tests covering:
# - Login (success/failure)
# - Admin authorization
# - Project CRUD
# - Public filtering
# - Validation
# - Seed idempotency
```

### Seed Database
```bash
npm run seed
# Idempotent: safe to re-run
# Populates: admin user, profile, Voyager project, skills, experience
```

## API Endpoints Quick Reference

### Public
- `GET /api/health` → Server status
- `GET /api/profile` → Portfolio info
- `GET /api/projects` → Published projects
- `GET /api/projects/:slug` → Project detail
- `GET /api/skills` → Skills
- `GET /api/experience` → Work experience
- `GET /api/certifications` → Certifications

### Auth
- `POST /api/auth/login` → Admin login
- `POST /api/auth/logout` → Admin logout
- `GET /api/auth/me` → Current user

### Admin (requires auth)
- `GET /api/admin/projects` → All projects
- `POST /api/admin/projects` → Create project
- `PUT /api/admin/projects/:id` → Update project
- `DELETE /api/admin/projects/:id` → Delete project
- _(same pattern for skills, experience, certifications, profile)_

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5173/5000 in use | Kill the process: `taskkill /PID <PID> /F` |
| MongoDB connection fails | Check `MONGODB_URI` is correct |
| Admin login fails | Verify `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `server/.env` |
| API 404 errors | Ensure backend is running |
| Type errors | Run `npm run type-check` |
| Build fails | Delete `node_modules/` and `dist/` folders, reinstall |

## Documentation

- **README.md** — Full documentation
- **PROJECT_STRUCTURE.md** — Detailed folder structure and design
- **openspec/changes/add-portfolio-cms/** — Development specs and planning
- **PORTFOLIO_CMS_PLAN.md** — Original requirements

## Next Steps

1. Copy environment files to `frontend/.env.local` and `server/.env`
2. Run `npm run install-all`
3. Start backend: `npm run server`
4. Start frontend: `npm run dev`
5. Open http://localhost:5173
6. Login at http://localhost:5173/admin/login
7. Start managing your portfolio!
