# Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### Security
- [ ] Environment variables (.env) excluded from git
- [ ] Uploaded files directory excluded from git  
- [ ] JWT_SECRET is secure (64+ character random string)
- [ ] MongoDB Atlas network access configured (0.0.0.0/0 for Render)
- [ ] Google OAuth configured with production domain

### Configuration
- [ ] NODE_ENV=production in Render environment variables
- [ ] MONGODB_URI points to production database
- [ ] CORS origins include production domain
- [ ] Rate limiting configured (100 requests/15min)
- [ ] Helmet security headers enabled

### Build & Dependencies
- [ ] Frontend builds successfully (`npm run build:frontend`)
- [ ] All dependencies listed in package.json
- [ ] Node.js version compatible (>=14.0.0)
- [ ] No console.log statements in production code

## 🚀 Render Deployment Steps

### 1. Create Web Service
- Service Name: `digital-noc-system`
- Environment: Node
- Build Command: `npm run install:all && npm run build:frontend`
- Start Command: `npm run start:production`

### 2. Environment Variables
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-64-char-secret
GOOGLE_CLIENT_ID=your-google-client-id
```

### 3. Post-Deployment
- [ ] Health check passes: `/api/health`
- [ ] Create admin user via Render shell
- [ ] Update Google OAuth with production URL
- [ ] Test complete user workflow
- [ ] Test file upload/download functionality
- [ ] Test admin dashboard features

## 🔧 Production Optimizations

### Performance
- [ ] Frontend assets compressed (gzip)
- [ ] Database indexes configured
- [ ] Static files served efficiently
- [ ] Rate limiting prevents abuse

### Monitoring
- [ ] Check Render logs for errors
- [ ] Monitor database connections
- [ ] Track API response times
- [ ] Monitor file upload sizes

### Maintenance
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Error logging implemented
- [ ] Performance monitoring setup

## 🚨 Known Limitations (Free Tier)

### Render Free Tier
- Services sleep after 15 minutes of inactivity
- Cold start can take 30+ seconds
- 750 build hours per month limit
- Ephemeral file system (uploads lost on restart)

### Recommendations for Production
- Upgrade to Render Starter plan ($7/month) for always-on service
- Implement cloud storage (AWS S3/Cloudinary) for file uploads
- Set up monitoring and alerting
- Configure automated backups

## 📞 Support & Resources

- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Project Repository**: https://github.com/Subroto-Datta/digital-noc-system