# Render Web Service Configuration

Copy these values into your Render "New Web Service" form.

## 1. Project Details
- **Name**: `TravelEase-Backend`
- **Root Directory**: `backend`
  > **IMPORTANT**: You MUST set this to `backend` since your code is in a subdirectory.  
  > If you leave this empty, the build will fail.

## 2. Build & Start Commands
- **Build Command**: `npm install`
- **Start Command**: `npm start`
  > Note: Do not use `yarn`; your project is set up with `npm`.

## 3. Environment Variables
Scroll down to "Environment Variables" and verify/add these:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://subhamsangwan_db_user:kouXxQOlptMDHJpz@cluster0.3mdmkal.mongodb.net/travelease?retryWrites=true&w=majority&appName=Cluster0` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `my_super_secret_key_123!` (or any random string you create) |

## 4. Final Step
Click **Create Web Service** at the bottom.
