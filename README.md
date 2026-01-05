Empleabilidad Platform (API + Frontend)
=======================================

Overview
--------
REST API and React/Next.js frontend for managing job vacancies and coder applications. The backend is Express + TypeScript + Sequelize over PostgreSQL with JWT + API Key security. Swagger docs live at `/docs`. A minimal dashboard front is included in `frontend/` to test login, listings, applications, and vacancy creation.

Stack
-----
- Backend: Node 18+, Express, Sequelize (PostgreSQL), JWT, API Key, Swagger UI
- Frontend: Next.js 14 (React 18), TypeScript
- DevOps: Docker Compose (API + DB), nodemon for hot-reload

Prerequisites
-------------
- Node.js 18+ and npm
- Docker Desktop with `docker compose` (recommended)
- Ports free: `3000` (API), `3001` (frontend), `5433` (Postgres on host)

Environment variables
---------------------
Copy `.env.example` to `.env` for local runs (Docker already sets defaults).
Key values:
- `API_KEY=super-api-key` (must be sent as header `x-api-key`)
- `PORT=3000`
- `DB_HOST=localhost`
- `DB_PORT=5433` (host) / `5432` inside container
- `DB_NAME=sportsline`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres`
- JWT secrets and expirations as in `.env.example`

Seed credentials
----------------
- Admin: `admin@riwi.com / admin123`
- Gestor: `gestor@riwi.com / gestor123`
- Coder: `coder@riwi.com / coder123`
- API Key header: `x-api-key: super-api-key`

Run backend with Docker (recommended)
-------------------------------------
1) From the repo root: `docker compose up -d`
2) Wait for services. API: `http://localhost:3000`, DB: `localhost:5433`
3) Swagger: `http://localhost:3000/docs`
4) Logs: `docker compose logs -f api`

Run backend locally (without Docker)
------------------------------------
1) Install deps: `npm install`
2) Ensure Postgres is up and matches `.env` (host `localhost`, port `5433`)
3) Sync DB: `npm run db:sync`
4) Seed data: `npm run seed`
5) Start dev: `npm run dev` (hot reload on `http://localhost:3000`)

Backend scripts
---------------
- `npm run dev` — start API in dev mode
- `npm run build` — compile to `dist/`
- `npm start` — run compiled server
- `npm run db:sync` — sync models to DB
- `npm run seed` — create seed users and demo vacancies/products

Swagger documentation
---------------------
- URL: `http://localhost:3000/docs`
- Secured endpoints require: `Authorization: Bearer <token>` and `x-api-key: super-api-key`
- Examples included: register, login, create vacancy, apply to vacancy

Frontend (Next.js)
------------------
1) `cd frontend`
2) `npm install`
3) `npm run dev` (serves on `http://localhost:3001`)
4) In the UI, set:
   - API URL: `http://localhost:3000`
   - x-api-key: `super-api-key`
5) Login with any seed user; dashboard will show vacancies, allow apply, and (for admin/gestor) create vacancies.

Troubleshooting
---------------
- Port 5433 in use → stop other Postgres or change the mapping in `docker-compose.yml`.
- API 401 with message “API Key inválida o ausente” → add header `x-api-key: super-api-key`.
- Swagger not loading → ensure API is running on port 3000 and no firewall blocks it.
