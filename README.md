# Kick Radar

Full-stack web app for discovering and joining local football watch events. Users can browse events on a map, host gatherings, and send join requests with real-time host notifications.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router 6, TanStack Query |
| Backend | Node.js, Express 4, Mongoose 8 |
| Data | MongoDB Atlas |
| Storage | AWS S3 (uploads) |
| Real-time | WebSocket (`ws`) |

## Project structure

```
kick-radar/
├── backend/          # REST API + WebSocket
│   ├── controllers/  # HTTP handlers
│   ├── services/     # Business logic
│   ├── models/
│   └── routes/
└── frontend/         # Vite React SPA
    ├── src/api/      # API client
    └── src/queries/  # TanStack Query hooks
```

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB Atlas (or local MongoDB with connection string change in `app.js`)
- AWS S3 bucket (optional, for profile images)
- Google Maps API key (for map view)
- Google OAuth 2.0 Web client ID (for Sign in with Google)

### Install

```bash
npm run install:all
```

### Environment

**Backend** — copy `backend/nodemon.example.json` to `backend/nodemon.json` (or use a `.env` loader) and fill in values. See `backend/.env.example` for variable names.

**Frontend** — copy `frontend/.env.example` to `frontend/.env.local` for development.

### Run (API + UI)

From the repo root:

```bash
npm run dev
```

- Frontend: http://localhost:3000 (proxies `/api` → http://localhost:5000)
- API: http://localhost:5000/api/health

### Tests

```bash
npm test
```

## Authentication (hybrid)

Kick Radar uses a **hybrid auth** model:

1. **Email/password** — bcrypt-hashed passwords, JWT issued by the API (`POST /api/users/login`, `/signup`).
2. **Google Sign-In** — the frontend receives a Google `id_token`, the backend verifies it with `google-auth-library`, then **creates or links** a user in MongoDB and returns **the same app JWT** used for all protected routes.

Authorization (who can delete an event, accept a join request, etc.) always runs in your Express services using `req.userData` from `check-auth` — not on the client.

### Google Cloud setup

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Create an **OAuth 2.0 Client ID** (type: **Web application**).
3. **Authorized JavaScript origins**: `http://localhost:3000` (and your production URL).
4. Copy the Client ID into:
   - `GOOGLE_CLIENT_ID` in backend `nodemon.json`
   - `VITE_GOOGLE_CLIENT_ID` in `frontend/.env.local`

`VITE_GOOGLE_API_KEY` (Maps) and `VITE_GOOGLE_CLIENT_ID` (OAuth) are **different** keys.

## Main features

- Hybrid JWT + Google OAuth sign-in with account linking by email
- Client-side session persistence (token expiry + auto logout)
- Create events with map coordinates and geocoded address
- Join requests with host accept/decline flow
- WebSocket broadcasts to refresh notifications and event lists

## Deployment

- Build frontend: `npm run build --prefix frontend` → deploy `frontend/dist` (e.g. Firebase Hosting)
- Run backend on any Node host (e.g. Railway, Render, Fly.io) with environment variables set
