# Task Manager

A task management app with three stages: Todo, In Progress, Done.

## Live Links

- **Frontend:** [Vercel](https://task-manager-rouge-two-24.vercel.app)
- **Backend:** [Render](https://task-manager-s8c3.onrender.com)

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** FastAPI, MongoDB (Motor), JWT auth (python-jose + pwdlib)
- **Deploy:** Vercel (frontend), Render (backend)

## Running Locally

### Backend

```bash
cd backend
uv venv && uv pip install -r requirements.txt
cp .env.example .env  # add MongoDB URL and JWT secret
.venv/bin/uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env  # set VITE_API_URL
npm run dev
```

## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| GET | /api/tasks/ | Yes |
| POST | /api/tasks/ | Yes |
| PUT | /api/tasks/:id | Yes |
| DELETE | /api/tasks/:id | Yes |

## Assumptions & Tradeoffs

- Single JWT with 24h expiry (no refresh tokens — keeps it simple)
- No email verification on register
- No drag-and-drop — dropdown to change stage is simpler and accessible
- CORS allows all origins (fine for demo)
- Render free tier has ~30s cold starts after inactivity
- Tasks capped at 100 per user (no pagination needed for this scale)

## Decisions

- FastAPI for async + auto OpenAPI docs
- pwdlib (bcrypt) over passlib — passlib is unmaintained
- Motor for async MongoDB — natural fit with FastAPI
- Tailwind v4 with Vite plugin — no config file needed
- Kanban columns on desktop, stacked cards on mobile
