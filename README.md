# V Five Education — Frontend

Next.js public website and admin CMS. All page content is loaded from the FastAPI backend (PostgreSQL).

---

## Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | 18+ (20+ recommended) |
| npm | Included with Node.js |
| **Backend API** | Must be running — see [../backend/README.md](../backend/README.md) |

---

## Step-by-step: from GitHub clone to running website

### Step 1 — Clone the repository

If you have not cloned yet:

```powershell
git clone <your-github-repo-url>
cd "V Five\frontend"
```

macOS / Linux:

```bash
git clone <your-github-repo-url>
cd "V Five/frontend"
```

---

### Step 2 — Set up the backend first (required)

The frontend **cannot** work without the API and database.

Complete these backend steps before continuing:

1. [Backend README — Steps 1–9](../backend/README.md#step-by-step-from-github-clone-to-running-api)
2. Especially: `.env`, create database `vfive`, **`alembic upgrade head`**, seed admin, start uvicorn on port **8000**

Quick check: open http://localhost:8000/api/health — should show `"database": "connected"`.

---

### Step 3 — Install npm dependencies

From the `frontend` folder:

```powershell
npm install
```

---

### Step 4 — Configure environment variables

**Windows:**

```powershell
copy .env.local.example .env.local
```

**macOS / Linux:**

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL — **no trailing slash** |

For production, set this to your live API URL **before** running `npm run build`.

---

### Step 5 — Start the development server

```powershell
npm run dev
```

Open in your browser:

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Admin login | http://localhost:3000/admin |
| Admin dashboard | http://localhost:3000/admin/dashboard |

---

### Step 6 — Log in to admin

Use the admin account created by the backend seed (`backend/.env`):

- **Email:** value of `ADMIN_EMAIL` (default `admin@vfiveeducation.com`)
- **Password:** value of `ADMIN_PASSWORD` (default `admin123`)

Change these in production.

From admin you can edit Home, Courses, Destinations, Study Abroad, About, Contact, Footer, and Users.

---

## Full local setup (two terminals)

Use this checklist after cloning the whole repo.

**Terminal 1 — Backend** (`V Five/backend`)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edit .env — DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, SECRET_KEY
.\.venv\Scripts\alembic upgrade head
.\.venv\Scripts\python scripts\seed_admin_users.py
.\.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend** (`V Five/frontend`)

```powershell
npm install
copy .env.local.example .env.local
npm run dev
```

---

## After `git pull`

1. **Backend:** if `backend/alembic/versions/` has new files, run:

   ```powershell
   cd ..\backend
   .\.venv\Scripts\alembic upgrade head
   ```

2. **Frontend:** if `package.json` changed:

   ```powershell
   npm install
   ```

3. Restart both dev servers.

---

## npm scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |

---

## Project structure

```
frontend/
├── src/
│   ├── app/                 # Pages (home, courses, admin, …)
│   ├── components/          # Navbar, footer, admin editors
│   ├── lib/api.ts           # HTTP client
│   └── utils/cmsData.ts     # CMS types + API helpers
├── public/                  # Static images (logo, hero photos)
├── .env.local.example
└── package.json
```

---

## How content works

- Content is stored in **PostgreSQL** via the backend (`/api/cms/*`).
- The site fetches fresh data on load (no CMS cache in the browser).
- Static files in `public/` (e.g. `logo.jpeg`) are served by Next.js; CMS images may use Cloudinary URLs from admin.

---

## Production build

```powershell
# Set production API URL first
npm run build
npm run start
```

`NEXT_PUBLIC_*` variables are embedded at **build time**.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Pages stuck loading / empty | Start backend; check `NEXT_PUBLIC_API_URL` |
| `Could not load CMS data` in admin | Backend not running or migrations not applied |
| Admin login fails | Run backend `seed_admin_users.py`; verify `/api/health` |
| CORS error in browser | Add frontend URL to `CORS_ORIGINS` in `backend/.env` |
| Image upload fails in admin | Set `CLOUDINARY_*` in `backend/.env` |
| Wrong API after deploy | Rebuild frontend with correct `NEXT_PUBLIC_API_URL` |

---

## Related docs

- [Backend setup & migrations](../backend/README.md)
- [PostgreSQL / pgAdmin](../backend/DATABASE_SETUP.md)
- [Root project overview](../README.md)
