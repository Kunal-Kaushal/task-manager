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

- Single JWT with 24h expiry, no refresh tokens. Simpler for a demo but I'd add them in production
- Registration doesn't verify email since this is just a demo
- Used a dropdown to change task stage instead of drag-and-drop — quicker to implement and works better on mobile
- CORS allows all origins for now, would lock it down in production
- Render free tier spins down after inactivity so the first request takes ~30s
- Capped tasks at 100 per user to skip pagination

## Decisions

- Went with FastAPI because it's async by default and gives me free API docs at `/docs`
- Chose pwdlib over passlib for password hashing — passlib hasn't been updated since 2020
- Motor as the MongoDB driver since it's async and works well with FastAPI
- Tailwind v4 with the Vite plugin so I don't need a config file
- Kanban-style board with 3 columns on desktop, stacks on mobile
