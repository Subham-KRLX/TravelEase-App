# Deployment Instructions for TravelEase

This guide explains how to deploy TravelEase's **frontend** (Vite + React) and **backend** (Node.js + Express) separately.

## Architecture Overview

```
TravelEase
├── Frontend (Vite + React) → Deploy to Vercel
├── Backend (Node.js + Express) → Deploy to Renderf
└── Database (MongoDB) → MongoDB Atlas
```

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user (username + password)
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/travelease`
5. Save this for later use in environment variables

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Connect GitHub Repository
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository: `TravelEase-App`
4. Framework preset: **Vite**
5. Root directory: Leave empty (Vercel will auto-detect)

### 2.2 Configure Build Settings
- **Build Command:** `cd frontend && npm install && npm run build`
- **Output Directory:** `frontend/dist`
- **Install Command:** Leave blank (Vercel handles it)

### 2.3 Add Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:
```
VITE_API_URL=https://your-backend-render-url.onrender.com
```
(Replace with your actual Render backend URL once deployed)

### 2.4 Deploy
Click "Deploy" - it should succeed in ~2 minutes

---

## Step 3: Deploy Backend to Render

### 3.1 Connect GitHub Repository
1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select branch: `main`

### 3.2 Configure Deployment
- **Name:** `travelease-backend`
- **Region:** Select nearest to your users
- **Runtime:** `Node`
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`

### 3.3 Add Environment Variables
In Render dashboard → Environment, add:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelease
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
FRONTEND_URL=https://your-vercel-frontend.vercel.app
```

### 3.4 Deploy
Click "Create Web Service" - deployment starts automatically (~3-5 minutes)

---

## Step 4: Update Frontend with Backend URL

Once backend is deployed on Render:

1. Go back to Vercel
2. Settings → Environment Variables
3. Update `VITE_API_URL` with your Render backend URL
4. Redeploy frontend (automatic on main branch push)

---

## Step 5: Verify Deployment

### Frontend
```bash
# Should load successfully
curl https://your-vercel-frontend.vercel.app
```

### Backend
```bash
# Should return health status
curl https://your-render-backend.onrender.com/api/health
```

---

## Common Issues & Solutions

### ❌ Frontend Build Fails
**Problem:** "Cannot find module 'frontend'"

**Solution:**
1. Check Vercel build command: `cd frontend && npm install && npm run build`
2. Check root directory is empty (not set to `frontend`)
3. Verify output directory: `frontend/dist`

### ❌ Backend Fails to Start
**Problem:** "MONGODB_URI is undefined"

**Solution:**
1. Verify MongoDB Atlas connection string in Render environment variables
2. Check IP whitelist on MongoDB Atlas (add `0.0.0.0/0` for all IPs)
3. Test connection locally: `MONGODB_URI=... npm start`

### ❌ CORS Errors in Frontend
**Problem:** Frontend can't reach backend

**Solution:**
1. Update VITE_API_URL in Vercel to match your Render backend URL
2. Verify backend has CORS enabled (should be in server.js)
3. Redeploy frontend after updating URL

### ❌ Stripe Integration Not Working
**Problem:** Payments fail in production

**Solution:**
1. Use Stripe **live keys** (not test keys) in Render
2. Add webhook endpoint to Stripe dashboard pointing to: `https://your-backend.onrender.com/api/payments/webhook`
3. Test in Stripe dashboard's webhook section

---

## Maintenance & Updates

### To Update Frontend
```bash
git push origin main
# Vercel auto-deploys
```

### To Update Backend
```bash
git push origin main
# Render auto-deploys (if auto-deploy enabled)
```

### To Manually Redeploy
- **Vercel:** Settings → Redeploy
- **Render:** Manual deploy button in dashboard

---

## Environment Variables Reference

### Frontend (Vercel)
- `VITE_API_URL` - Backend API endpoint

### Backend (Render)
- `NODE_ENV` - Set to `production`
- `PORT` - Set to `5000` (Render's default)
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - JWT token expiry (e.g., `7d`)
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `STRIPE_PUBLIC_KEY` - Stripe public key
- `FRONTEND_URL` - Your Vercel frontend URL (for CORS)

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Frontend deployed to Vercel successfully
- [ ] Backend deployed to Render successfully
- [ ] Environment variables set correctly
- [ ] Frontend can reach backend API
- [ ] Stripe keys are live (not test)
- [ ] Database is backed up
- [ ] Monitoring alerts configured
- [ ] Error tracking set up (Sentry recommended)
- [ ] SSL certificates active (auto-handled by Vercel/Render)

---

## Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Stripe API Docs](https://stripe.com/docs/api)

---

**Need help?** Check your deployment logs:
- Vercel: Deployments → Select deployment → Logs
- Render: Logs tab in web service dashboard
