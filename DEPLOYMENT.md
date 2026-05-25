# Kejalux Interiors - Deployment Guide

## Vercel Deployment

### 1. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for auto-deploys.

### 2. Required Environment Variables (Vercel)

In your Vercel project settings, add these **Environment Variables**:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.com` | Your backend API URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `your-google-client-id.apps.googleusercontent.com` | Google OAuth Client ID |

### 3. Google OAuth Setup for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select your project
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Select **Web application**
6. Add these **Authorized JavaScript origins**:
   - `http://localhost:3000` (for local dev)
   - `https://your-vercel-app.vercel.app` (your production URL)
   - `https://www.yourdomain.com` (if using custom domain)
7. Copy the **Client ID** and add to Vercel env vars as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### 4. Backend Deployment (Railway/Render/Heroku)

Your backend needs these environment variables:

```bash
# Database
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASS=your-db-password
DB_NAME=urban_interiors

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS - Add your Vercel URL here
CORS_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000

# Server
PORT=5000
```

Update `NEXT_PUBLIC_API_URL` in Vercel to point to your deployed backend.

### 5. Database Migrations on Production

After deploying the backend, run migrations:

```bash
npx knex migrate:latest
```

## Local Development Setup

### 1. Backend `.env` file

Create `server/.env`:

```env
JWT_SECRET=your-local-dev-secret
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_NAME=urban_interiors
PORT=5000
```

### 2. Frontend `.env.local` file

Create `.env.local` in project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Start both servers

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

## Apple Sign-In (Optional)

Apple Sign-In requires:
1. Apple Developer account ($99/year)
2. Configure in [Apple Developer Portal](https://developer.apple.com/)
3. Add domain verification
4. Backend update to handle Apple ID tokens

The Apple button currently shows a placeholder message. Contact a developer to fully configure.
