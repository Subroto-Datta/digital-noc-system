# Render Deployment Guide

## Prerequisites
1. GitHub account with this repository
2. Render account (free tier available)
3. MongoDB Atlas database (already configured)
4. Google OAuth credentials (already configured)

## Deployment Steps

### Method 1: Using Render Dashboard (Recommended)

#### Step 1: Deploy Backend
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `digital-noc-backend`
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 2: Add Backend Environment Variables
In your backend service settings, add these environment variables:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

#### Step 3: Deploy Frontend
1. Click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `digital-noc-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

#### Step 4: Add Frontend Environment Variables
In your frontend service settings, add:
```
REACT_APP_API_URL=https://your-backend-name.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Method 2: Using render.yaml (Blueprint)

1. Copy the `render.yaml` file to your repository root
2. Update the service names and environment variables
3. Go to Render Dashboard → "New +" → "Blueprint"
4. Connect your repository and deploy

## Post-Deployment Setup

### 1. Create Admin User
After successful deployment, create an admin user:

```bash
# SSH into your backend service (from Render dashboard)
cd /opt/render/project/src/backend
node scripts/create-admin.js
```

Or use the web interface once deployed.

### 2. Update Google OAuth
Add your Render frontend URL to Google OAuth settings:
- Frontend URL: `https://your-frontend-name.onrender.com`

### 3. Test Your Application
1. Visit your frontend URL
2. Test user registration and login
3. Create a sample NOC request
4. Verify document uploads work
5. Test admin dashboard functionality

## Troubleshooting

### Common Issues:
1. **Build fails**: Check build logs in Render dashboard
2. **API not connecting**: Verify REACT_APP_API_URL matches your backend URL
3. **Database connection**: Ensure MongoDB Atlas allows connections from 0.0.0.0/0
4. **File uploads**: Render's filesystem is ephemeral - consider using cloud storage for production

### Logs:
- View logs in Render dashboard for each service
- Backend logs show API requests and database connections
- Frontend build logs show compilation issues

## URLs After Deployment
- Backend API: `https://digital-noc-backend.onrender.com`
- Frontend App: `https://digital-noc-frontend.onrender.com`
- Admin Dashboard: `https://digital-noc-frontend.onrender.com/admin`

## Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after sleeping may take 30+ seconds
- 750 build hours per month
- Consider upgrading for production use