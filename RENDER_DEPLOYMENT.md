# Render Full-Stack Deployment Guide

## Prerequisites
1. GitHub account with this repository
2. Render account (free tier available)
3. MongoDB Atlas database (already configured)
4. Google OAuth credentials (already configured)

## Pre-Deployment Testing (Recommended)

Test the build process locally before deploying:

```bash
# Test the exact build process Render will use
npm run install:all
npm run build

# Test the production server locally
npm run start:production
```

If any of these fail locally, fix the issues before deploying to Render.

## Deployment Steps

### Deploy as Single Full-Stack Application (Recommended)

#### Step 1: Create Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `digital-noc-system`
4. Configure the service:
   - **Name**: `digital-noc-system`
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Root Directory**: (leave empty - uses root)
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm run start:production`
   - **Plan**: Free

**Alternative Build Commands (if the default fails):**
- **Option 1**: `npm install && npm run build`
- **Option 2**: `npm ci && npm run install:all && npm run build`
- **Option 3**: `npm install --production=false && npm run build`
- **Option 4**: Manual: `npm install && cd backend && npm install && cd ../frontend && npm install && npm run build`

#### Step 2: Add Environment Variables
In your service settings, add these environment variables:

**Required Variables:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

**Optional Variables:**
```
FRONTEND_URL=https://digital-noc-system.onrender.com
```

#### Step 3: Deploy and Monitor
1. Click "Create Web Service"
2. Render will automatically build and deploy your app
3. Monitor the build logs for any issues
4. Your app will be available at: `https://digital-noc-system.onrender.com`

## Post-Deployment Setup

### 1. Update Google OAuth Settings
Add your Render URL to Google OAuth:
- **Authorized JavaScript origins**: `https://digital-noc-system.onrender.com`
- **Authorized redirect URIs**: `https://digital-noc-system.onrender.com`

### 2. Create Admin User
After successful deployment, create an admin user:

**Option A: Using Render Shell**
1. Go to your service dashboard on Render
2. Click "Shell" tab
3. Run: `cd backend && node scripts/create-admin.js`

**Option B: Locally (if needed)**
Update your local `.env` file with production MongoDB URI and run:
```bash
cd backend
node scripts/create-admin.js
```

### 3. Test Your Application
1. Visit `https://digital-noc-system.onrender.com`
2. Test user registration and login
3. Create a sample NOC request
4. Verify document uploads work
5. Test admin dashboard functionality

## Architecture Overview

**Full-Stack Deployment:**
- Frontend (React) is built and served as static files by the backend
- Backend (Express) serves both API routes (`/api/*`) and frontend files
- Single domain for both frontend and backend
- Simplified CORS configuration

**Build Process:**
1. `npm run install:all` - Installs dependencies for root, backend, and frontend
2. `npm run build` - Builds the React app to `frontend/build/`
3. Backend serves static files from `frontend/build/` in production

## Troubleshooting

### Common Issues:

1. **Build Failure**
   - Check build logs in Render dashboard
   - Try alternative build commands (see Step 1 above)
   - Ensure all dependencies are listed in package.json files
   - Verify Node.js version compatibility
   
   **Build Command Troubleshooting:**
   - If "npm run install:all" fails → Try Option 1: `npm install && npm run build`
   - If permission errors → Try Option 2: `npm ci && npm run install:all && npm run build`
   - If dev dependencies missing → Try Option 3: `npm install --production=false && npm run build`
   - If npm cache issues → Clear build cache in Render and try Option 2

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Ensure MongoDB Atlas allows connections from `0.0.0.0/0`
   - Check environment variables are set correctly

3. **Frontend Not Loading**
   - Verify build completed successfully
   - Check that `frontend/build` directory exists after build
   - Ensure static file serving is working in production mode

4. **API Routes Not Working**
   - Verify API routes start with `/api/`
   - Check CORS configuration
   - Monitor server logs for errors

5. **File Uploads Failing**
   - Note: Render's filesystem is ephemeral
   - Files uploaded will be lost on service restart
   - Consider using cloud storage (AWS S3, Cloudinary) for production

### Viewing Logs:
- **Build Logs**: Available during deployment in Render dashboard
- **Runtime Logs**: Click "Logs" tab in your service dashboard
- **Real-time Monitoring**: Logs update in real-time

## Production Considerations

### Free Tier Limitations:
- Services spin down after 15 minutes of inactivity
- First request after sleeping may take 30+ seconds
- 750 build hours per month
- No persistent file storage

### Recommended Upgrades:
- **Starter Plan ($7/month)**: Always-on service, faster builds
- **Cloud Storage**: For persistent file uploads
- **CDN**: For faster static asset delivery

## URLs and Endpoints

**Application URL:** `https://digital-noc-system.onrender.com`

**Key Pages:**
- Home: `/`
- Login: `/login`
- Register: `/signup`
- Dashboard: `/dashboard`
- Admin: `/admin`
- Create NOC: `/create-noc`

**API Endpoints:**
- Health Check: `/api/health`
- Auth: `/api/auth/*`
- NOC Management: `/api/noc/*`

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode | Yes |
| `PORT` | Server port (Render uses 10000) | Yes |
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Optional |

Your Digital NOC Management System is now ready for production! 🚀

## Backup Deployment Strategy

If the full-stack deployment fails, you can deploy backend and frontend separately:

### Backend Only Deployment
```
Name: digital-noc-backend
Environment: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### Frontend Only Deployment  
```
Type: Static Site
Name: digital-noc-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
Environment Variables: 
- REACT_APP_API_URL=https://digital-noc-backend.onrender.com
```

This approach requires updating CORS settings and may involve additional configuration.