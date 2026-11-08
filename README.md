# ContactHub

Full-stack contact manager: React + Redux Toolkit + Tailwind + Express + MongoDB Atlas.
Authentication supports email/password, Google OAuth (also Gmail sign-in), GitHub OAuth, JWT-protected API, and password reset.

## Requirements
Node.js 20+, MongoDB Atlas account, Google OAuth credentials and/or GitHub OAuth credentials.

## Local setup
1. Extract the project.
2. Backend:
   ```bash
   cd backend
   cp .env.example .env
   # Fill values in .env
   npm install
   npm run dev
   ```
3. Frontend (new terminal):
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
4. Open http://localhost:5173

## Environment
Backend `.env`:
- `MONGO_URI`: Atlas connection string (database user/password; allow your IP in Atlas Network Access)
- `JWT_SECRET`: long random secret
- `CLIENT_URL`: frontend URL
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth Web client
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`: GitHub OAuth app
- `FRONTEND_URL`: frontend origin
- `EMAIL_*`: optional SMTP settings for reset email. If absent, reset link is printed to backend console (development only).

Frontend `.env`: `VITE_API_URL=http://localhost:5000/api`

## Google OAuth
1. Google Cloud Console → APIs & Services → OAuth consent screen; configure app and test users if in testing.
2. Credentials → Create credentials → OAuth client ID → Web application.
3. Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
4. For production add `https://YOUR-RENDER-DOMAIN/api/auth/google/callback`.
5. Set client ID/secret in backend `.env`. Google and Gmail use the same Google OAuth provider.

## GitHub OAuth
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
2. Homepage URL: `http://localhost:5173`
3. Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. For production add/use your Render callback URL (OAuth app supports one callback URL; use separate OAuth Apps for dev/prod).
5. Set client ID/secret in backend `.env`.

## Password reset
Configure SMTP variables to email reset links. In development without SMTP, the API logs the link. Reset tokens are hashed and expire after 15 minutes. Do not expose reset links in production logs.

## Deploy
### MongoDB Atlas
Create a cluster/database user, add Render's outbound IPs (or temporarily `0.0.0.0/0` with a strong DB password), and copy the SRV URI to `MONGO_URI`.

### Render backend
- New Web Service → connect repo → Root Directory `backend`
- Build: `npm install`; Start: `npm start`
- Add all backend env vars. Set `CLIENT_URL` and `FRONTEND_URL` to deployed Vercel origin.
- Set OAuth callback URLs to `https://YOUR-RENDER-DOMAIN/api/auth/google/callback` and `/api/auth/github/callback`.

### Vercel frontend
- Import repo → Root Directory `frontend`
- Framework preset Vite; Build `npm run build`; Output `dist`
- Set `VITE_API_URL=https://YOUR-RENDER-DOMAIN/api`
- Redeploy after setting env vars.

## API overview
- `POST /api/auth/register`, `/login`, `/forgot-password`, `/reset-password`
- `GET /api/auth/me` (Bearer JWT)
- `GET /api/auth/google`, `/api/auth/github` (OAuth redirects)
- `GET/POST /api/contacts`, `GET/PUT/DELETE /api/contacts/:id` (Bearer JWT)
- `GET /api/health`

## Notes
- OAuth returns a short-lived JWT in a URL fragment, which is not sent to the server in HTTP requests. Frontend stores it in sessionStorage (tab-scoped); email/password JWT is also stored there.
- For production-grade session hardening, consider an HttpOnly Secure SameSite cookie + CSRF strategy instead of browser-readable JWT storage.
