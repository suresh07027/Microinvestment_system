# MicroInvest

MicroInvest is a small micro-investing web application consisting of a Node/Express backend and a React + Vite frontend. It provides user authentication, transaction tracking, round-up investing features, and basic analytics.

Features
- User registration, login, and password reset
- Transaction recording and management
- Round-up settings (save spare change into investment buckets)
- Admin dashboard and analytics

Tech stack
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React, Vite, Zustand, Recharts, Three.js (for visuals)
- Email: Nodemailer (SMTP)

Prerequisites
- Node.js (16+ recommended)
- npm or yarn
- MongoDB connection (Atlas or local)

Environment (.env)
Create a `.env` file in `backend/` with the following variables:

- `MONGO_URI` — MongoDB connection string
- `PORT` — optional API port (default 5000)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — optional SMTP settings for sending emails
- `EMAIL_FROM` — optional From address (defaults to SMTP user)

Quick start

Backend

1. Open a terminal and install dependencies:

```powershell
cd backend
npm install
```

2. Add `backend/.env` with at least `MONGO_URI` set.

3. Run in development (auto-restarts with nodemon):

```powershell
npm run dev
```

The API will be available at `http://localhost:5000` (or the port you set).

Frontend

1. Open a new terminal, install dependencies and start the dev server:

```powershell
cd frontend
npm install
npm run dev
```

2. Open the app in your browser at the URL shown by Vite (usually `http://localhost:5173`).

API overview
- `GET /` — health check
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login
- `POST /api/auth/forgot-password` — request password reset (emails if SMTP configured)
- `GET /api/transactions` — list user transactions (auth required)

Folder layout
- `backend/` — Express API, routes, models, utilities
- `frontend/` — React app built with Vite

Contributing
- Open an issue or submit a PR. Follow existing code style.

License
- MIT

If you'd like, I can also add example `.env` templates, API docs, or update package scripts. Want me to add any of those?
