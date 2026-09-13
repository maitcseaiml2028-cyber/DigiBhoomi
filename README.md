# DigiBhoomi — Real-Time National Land Acquisition & Management System

Full-stack build for SIH problem statement 26016 (Ministry of Rural Development · Dept. of Land Resources).

## Structure
```
DigiBhoomi-full/
├── backend/     Express + SQLite API, JWT auth, all business logic
├── frontend/    React (CDN + in-browser Babel, no build step) UI, served by the backend
└── render.yaml  One-click Render deployment config
```

## Run locally
```bash
cd backend
npm install
cp .env.example .env
npm run seed      # populates SQLite with demo data (39 projects, 3,240 parcels, 1,850 households)
npm start
```
Open **http://localhost:4000** — the backend serves the frontend too, one process, one URL.

## Demo accounts
Password for all seeded accounts: `digibhoomi@2026`

| Role | Email |
|---|---|
| Ministry Administrator | a.verma@gov.in |
| State Administrator | r.sharma@rj.gov.in |
| District Administrator | p.nair@rj.gov.in |
| Land Acquisition Officer | v.singh@rj.gov.in |
| Field Officer | d.iyer@rj.gov.in |
| Legal Officer | a.mehta@rj.gov.in |
| Revenue Officer | n.kapoor@rj.gov.in |
| R&R Officer | s.rao@rj.gov.in |

On the login page, the **Demo** tab lets you pick any of these roles from a dropdown — email/password auto-fill, no typing needed. The **Sign In** tab is for real accounts, and **Register** lets anyone create a new account for any role.

## Deploy to Render
1. Push this whole folder to a GitHub repo.
2. In Render, "New +" → "Blueprint" → connect the repo. Render reads `render.yaml` automatically and configures everything (build command, start command, env vars).
3. First deploy takes a couple of minutes. You'll get a public URL like `https://digibhoomi.onrender.com`.

**Note on the database:** it's SQLite (a file on disk). Render's free tier has an ephemeral filesystem, so the database resets to fresh demo data on every restart/redeploy — convenient for a hackathon demo (always clean data), but not permanent storage. For a persistent production deployment, either add a Render persistent disk (paid) or migrate to Postgres.

## What's real vs. mocked
- **Real:** authentication (bcrypt + JWT), the SQLite database, all CRUD endpoints, task/workflow state, audit log — every write actually persists.
- **Mocked (by design, for the demo):** the "AI" risk score and delay predictions are a deterministic formula, not a trained ML model — swap `backend/server.js`'s `/api/predictions/*` routes for a real model endpoint when ready.

## Bugs fixed in this build
- **Blank white page on Compensation tab / Create Project page** — the mock data port to the backend was missing two fields (`COMP_SUMMARY`, `PROJECT_TYPES`) that those pages required. Fixed in `backend/seed.js` / `backend/server.js`, and verified via API tests.
- Added a React error boundary app-wide, so any future bug shows a recoverable error screen instead of a blank page.

## Why it wasn't working (this round)
Your uploaded ZIP included `backend/node_modules`, which contains `better-sqlite3` — a native binary compiled for a specific OS/CPU architecture. When extracted and run in a different environment, Node fails immediately with `invalid ELF header`, the server never starts, and every request shows "Couldn't reach the server / Request failed (500)". **Never zip or commit `node_modules`** — always run `npm install` fresh in the target environment. This ZIP excludes it; `.gitignore` already excludes it from git too.

## Data fixes in this round
- `/api/kpis` (and the Ministry dashboard) previously summed each project's rough **display-estimate** fields (`totalParcels`, `households`) instead of counting real rows in the `parcels`/`households` tables — inflating national totals by ~3x (12,304 shown vs. 4,380 real parcels). Now uses real `COUNT(*)` queries, scoped to the same projects the user has access to.
- Ministry dashboard's "State Performance Comparison" chart was fully hardcoded (unchanging regardless of real data) — now computed live from real per-project acquisition/compensation/R&R ratios grouped by state.
- Compensation Pending figure used an arbitrary formula unrelated to actual rupee amounts — now a real sum of each project's compensation gap.
- Field Officer dashboard was the only one of the 6 without an embedded live GIS map (Ministry, State, District, Project Agency, and Landowner all already had one) — added, showing that officer's assigned parcels.

## Run
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm start
```
Open http://localhost:4000. Demo password for all seeded accounts: `digibhoomi@2026` (emails like `ministry.demo@gov.in`, `state.demo@delhi.gov.in`, etc. — see the login page's Demo tab).
