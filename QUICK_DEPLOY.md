# 🚀 Quick Deployment Setup

## Your Deployment Strategy

You have a **monorepo** with frontend and backend. Deploy them separately:

### Frontend → Vercel ✅
- Already partially configured
- Fix: Update `vercel.json` build command (DONE)
- Add environment variable in Vercel dashboard

### Backend → Render
- Uses `render.yaml` configuration
- Needs manual setup on Render.com

---

## 5-Minute Quick Start

### 1️⃣ Deploy Backend to Render (First)

**Steps:**
1. Go to https://render.com/auth/register
2. Sign up with GitHub
3. New → Web Service
4. Connect your `TravelEase-App` repository
5. Settings:
   - Name: `travelease-backend`
   - Build: `cd backend && npm install`
   - Start: `cd backend && npm start`
6. Add Environment Variables:
   ```
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/travelease
   JWT_SECRET = (generate random string)
   STRIPE_SECRET_KEY = (from Stripe dashboard)
   STRIPE_PUBLIC_KEY = (from Stripe dashboard)
   FRONTEND_URL = (add this later after Vercel deploys)
   ```
7. Click "Create Web Service" and wait 5 minutes

**Result:** You'll get a URL like `https://travelease-backend-xxxx.onrender.com`

---

### 2️⃣ Deploy Frontend to Vercel (Second)

**Steps:**
1. Go to https://vercel.com/new
2. Import your `TravelEase-App` repository
3. Settings:
   - Framework: Vite
   - Build: `cd frontend && npm install && npm run build`
   - Output: `frontend/dist`
4. Environment Variables:
   ```
   VITE_API_URL = https://travelease-backend-xxxx.onrender.com
   ```
5. Click "Deploy" and wait 2 minutes

**Result:** You'll get a URL like `https://travelease-app-xxxx.vercel.app`

---

### 3️⃣ Update Render Backend

Go back to Render dashboard:
- Settings → Environment Variables
- Update `FRONTEND_URL` = your new Vercel URL
- Click "Save"

---

## ✅ Verify Everything Works

```bash
# Test backend is running
curl https://travelease-backend-xxxx.onrender.com/api/health

# Test frontend loads
curl https://travelease-app-xxxx.vercel.app
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| Vercel build fails | Check `vercel.json` has correct build command |
| Render deployment fails | Check `NODE_ENV=production` in env vars |
| CORS errors | Update `VITE_API_URL` in Vercel after Render URL |
| Database connection fails | Check MongoDB Atlas IP whitelist (add 0.0.0.0/0) |
| Stripe fails | Use LIVE keys, not test keys |

---

## Your URLs After Deployment

```
Frontend:  https://YOUR-FRONTEND.vercel.app
Backend:   https://YOUR-BACKEND.onrender.com
Database:  mongodb+srv://user:pass@cluster.mongodb.net/travelease
```

---

## Auto-Deploy Setup

**Vercel:** Automatic on every `git push`  
**Render:** Enable "Auto-deploy" in settings

---

For detailed steps → See `DEPLOYMENT_INSTRUCTIONS.md`
