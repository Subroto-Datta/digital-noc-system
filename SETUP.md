# NOC Management System - Setup Guide

This guide will help you set up the Digital NOC Management System on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd noc-management-system
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create environment file:
```bash
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/noc_management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```

The frontend application will be available at `http://localhost:3000`

## 🔧 Detailed Setup

### MongoDB Setup

1. **Install MongoDB**:
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Follow the installation instructions for your operating system

2. **Start MongoDB**:
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS (with Homebrew)
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running**:
   ```bash
   mongosh
   ```

### Backend Configuration

The backend uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/noc_management |
| `JWT_SECRET` | Secret key for JWT tokens | (required) |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

### Frontend Configuration

The frontend is configured to proxy API requests to the backend. The proxy is set in `package.json`:

```json
{
  "proxy": "http://localhost:5000"
}
```

## 🧪 Testing the Setup

### 1. Backend Health Check
Visit `http://localhost:5000/api/health` in your browser. You should see:
```json
{
  "status": "OK",
  "message": "NOC Management API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Frontend Access
Visit `http://localhost:3000` in your browser. You should see the login page.

### 3. Create Your First Account
1. Click "Create a new account" on the login page
2. Fill out the registration form
3. Choose your role (Student, Faculty, or Administrator)
4. Submit the form

## 👥 User Roles

### Student
- Can create NOC requests
- Can view their own requests
- Can update their profile

### Faculty
- Can view all NOC requests
- Can approve/reject requests
- Can add review comments
- Can view statistics

### Administrator
- Full access to all features
- Can manage users
- Can delete requests
- Advanced analytics

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running and accessible.

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change the PORT in your `.env` file or kill the process using the port.

#### 3. CORS Issues
```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Make sure the FRONTEND_URL in your `.env` file matches your frontend URL.

#### 4. JWT Secret Error
```
Error: secretOrPrivateKey must have a value
```
**Solution**: Make sure you have set a JWT_SECRET in your `.env` file.

### Debug Mode

To run in debug mode:

**Backend**:
```bash
DEBUG=* npm run dev
```

**Frontend**:
```bash
REACT_APP_DEBUG=true npm start
```

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student|faculty|admin),
  department: String,
  studentId: String (optional),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### NOC Requests Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  purpose: String,
  department: String,
  status: String (pending|approved|rejected|under_review),
  student: ObjectId (ref: User),
  reviewedBy: ObjectId (ref: User),
  reviewComments: String,
  reviewedAt: Date,
  priority: String (low|medium|high),
  tags: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Considerations

1. **Change Default JWT Secret**: Use a strong, unique JWT secret in production
2. **Database Security**: Secure your MongoDB instance
3. **Environment Variables**: Never commit `.env` files to version control
4. **HTTPS**: Use HTTPS in production
5. **Rate Limiting**: The API includes rate limiting to prevent abuse

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance
3. Set up proper logging and monitoring
4. Use a process manager like PM2

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Serve the static files with a web server like Nginx
3. Configure proper caching headers

## 📞 Support

If you encounter any issues during setup:

1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check that all environment variables are set correctly
5. Create an issue in the repository with detailed error information

## 🎯 Next Steps

After successful setup:

1. Create test accounts for different roles
2. Submit sample NOC requests
3. Test the approval workflow
4. Explore the admin dashboard
5. Customize the system for your institution's needs

Happy coding! 🎉
