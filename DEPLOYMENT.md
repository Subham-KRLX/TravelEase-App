# 🚀 TravelEase Deployment Guide

This guide will help you deploy your TravelEase application to get a live URL for your resume and faculty.

## 📋 Prerequisites

1. **GitHub Account** - Your code is already at: https://github.com/Subham-KRLX/TravelEase-App
2. **Accounts to Create** (all free):
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) - Database
   - [Render](https://render.com/register) - Backend hosting
   - [Vercel](https://vercel.com/signup) - Frontend hosting

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up
2. Create a **FREE** M0 cluster (select your nearest region)
3. Set up database access:
   - Click "Database Access" → "Add New Database User"
   - Username: `travelease-user`
   - Password: Generate a secure password (save it!)
   - User Privileges: "Atlas Admin"

### 1.2 Configure Network Access
1. Click "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (required for Render)
3. Click "Confirm"

### 1.3 Get Connection String
1. Click "Database" → "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://travelease-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add `/travelease` before the `?` in the URL:
   ```
   mongodb+srv://travelease-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/travelease?retryWrites=true&w=majority
   ```

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [Render](https://render.com) and sign up with GitHub
2. Authorize Render to access your repositories

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your repository: `Subham-KRLX/TravelEase-App`
3. Configure the service:
   - **Name**: `travelease-api` (or your preferred name)
   - **Region**: Select closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave blank (render.yaml will handle it)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### 2.3 Add Environment Variables
Click "Advanced" → Add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB connection string from Step 1.3 |
| `JWT_SECRET` | Generate a random string (e.g., use https://randomkeygen.com/) |
| `JWT_EXPIRE` | `7d` |
| `FRONTEND_URL` | `https://travelease.vercel.app` (update after frontend deployment) |
| `PORT` | `5000` |

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment (takes 5-10 minutes)
3. **Save your backend URL**: `https://travelease-api.onrender.com` (or your chosen name)

### 2.5 Test Backend
Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "status": "success",
  "message": "TravelEase API is running!",
  "timestamp": "..."
}
```

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com/signup) and sign up with GitHub
2. Authorize Vercel to access your repositories

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Import `Subham-KRLX/TravelEase-App`
3. Configure project:
   - **Framework Preset**: Other (Expo will handle it)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variable
Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `EXPO_PUBLIC_API_URL` | Your Render backend URL + `/api` (e.g., `https://travelease-api.onrender.com/api`) |

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment (takes 3-5 minutes)
3. **Save your frontend URL**: `https://travelease.vercel.app` (or assigned URL)

### 3.5 Update Backend CORS
1. Go back to Render dashboard
2. Find your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` to your actual Vercel URL
5. Click "Save Changes" (service will redeploy)

---

## 🌱 Step 4: Seed Database (Optional but Recommended)

To populate your database with sample data:

1. On Render dashboard, go to your backend service
2. Click "Shell" tab (or use their web terminal)
3. Run:
   ```bash
   cd backend && npm run seed
   ```

This will add sample flights, hotels, and a test admin user.

---

## ✅ Step 5: Verify Everything Works

### 5.1 Test Backend API
Visit these URLs in your browser:

- Health check: `https://your-backend.onrender.com/api/health`
- Flights: `https://your-backend.onrender.com/api/flights?from=Delhi&to=Mumbai`
- Hotels: `https://your-backend.onrender.com/api/hotels?location=Mumbai`

### 5.2 Test Frontend
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try searching for flights (Delhi → Mumbai, any dates)
3. Try searching for hotels (Mumbai, any dates)
4. Check if results appear from your backend

---

## 📝 For Your Resume

Use these URLs:

### Project Links
```
🌐 Live Demo: https://travelease.vercel.app
🔗 GitHub: https://github.com/Subham-KRLX/TravelEase-App
🔧 API: https://travelease-api.onrender.com
```

### Project Description Template
```
TravelEase - Full-Stack Travel Booking Platform
• Developed a full-stack MERN application for flight and hotel booking with React Native (Web)
• Built RESTful API with Express.js and MongoDB, deployed on Render with JWT authentication
• Implemented responsive UI with React Native Web, deployed on Vercel
• Tech Stack: React Native, Express.js, MongoDB, Node.js, JWT, Stripe integration
🔗 Live: https://travelease.vercel.app | GitHub: github.com/Subham-KRLX/TravelEase-App
```

---

## 🔄 Automatic Deployments

Both Render and Vercel are now connected to your GitHub repository:
- **Push to GitHub** → Both services auto-deploy
- **No manual deployment needed** after initial setup

---

## ⚠️ Important Notes

### Free Tier Limitations
- **Render Free**: Backend sleeps after 15 min of inactivity (takes ~30s to wake up)
- **Vercel Free**: Unlimited bandwidth for personal projects
- **MongoDB Atlas Free**: 512MB storage

### First Load Delay
When someone visits your site for the first time in a while, the backend needs to "wake up" from Render's free tier sleep. This is normal and takes about 30 seconds.

### Keeping Backend Alive (Optional)
To reduce cold starts, you can use a service like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 5 minutes.

---

## 🆘 Troubleshooting

### Issue: "Network Error" on Frontend
- Check if `EXPO_PUBLIC_API_URL` is set correctly in Vercel
- Verify CORS is configured properly (check `FRONTEND_URL` in Render)

### Issue: No Data Showing
- Ensure database is seeded (Step 4)
- Check MongoDB Atlas network access allows all IPs
- Verify `MONGODB_URI` is correct in Render environment variables

### Issue: Backend Health Check Fails
- Check Render logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is valid

---

## 📧 Support

If you face any issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → Click deployment → View logs
3. Check browser console for frontend errors (F12 → Console)

---

**🎉 Congratulations! Your TravelEase app is now live!**
