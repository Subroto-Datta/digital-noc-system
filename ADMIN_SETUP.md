# Admin Setup Guide

This document explains how to set up admin access for the Digital NOC Management System.

## Security Model

- **Admin access is restricted** - Only IT department can create admin users
- **No self-registration for admin** - Users cannot sign up as admin through the regular signup form
- **Server-controlled role assignment** - Admin roles are assigned by existing admins only
- **Environment variable protection** - Admin creation requires special environment variables

## Initial Admin Setup

### Method 1: Using the Script with Environment Variables (Recommended)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment example file:
   ```bash
   cp env.example .env
   ```

3. Edit the `.env` file and set admin creation variables:
   ```bash
   # Enable admin creation (IT Department Only)
   ENABLE_ADMIN_CREATION=true
   
   # Set your admin credentials
   ADMIN_EMAIL=admin@yourcollege.edu
   ADMIN_PASSWORD=YourSecurePassword123
   ADMIN_NAME=IT Department Head
   ADMIN_DEPARTMENT=IT Department
   ```

4. Create the initial admin user:
   ```bash
   npm run create-admin
   ```

5. **CRITICAL SECURITY STEP**: After admin is created, disable admin creation:
   ```bash
   # Edit .env file and change:
   ENABLE_ADMIN_CREATION=false
   # Or remove the line entirely
   ```

6. **IMPORTANT**: Change the admin password immediately after first login!

### Method 2: Manual Database Creation

If you prefer to create the admin user manually:

1. Connect to your MongoDB database
2. Insert a user document with role: 'admin'
3. Ensure the password is properly hashed using bcrypt

## Creating Additional Admin Users

Once you have an initial admin user, you can create additional admins through the API:

### Using the API Endpoint

**Endpoint**: `POST /api/auth/create-admin`

**Headers**:
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "IT Department Head",
  "email": "admin2@college.edu",
  "password": "SecurePassword123",
  "department": "IT Department",
  "role": "admin"
}
```

**Response**:
```json
{
  "message": "Admin user created successfully",
  "user": {
    "id": "user_id",
    "name": "IT Department Head",
    "email": "admin2@college.edu",
    "role": "admin",
    "department": "IT Department"
  }
}
```

## Security Best Practices

1. **Strong Passwords**: Use complex passwords for admin accounts
2. **Regular Rotation**: Change admin passwords regularly
3. **Limited Access**: Only create admin accounts for authorized IT personnel
4. **Monitor Access**: Keep track of who has admin access
5. **Secure Storage**: Store admin credentials securely

## User Role Hierarchy

- **Student**: Can create and track NOC requests
- **Faculty**: Can review and approve NOC requests (redirected to admin dashboard)
- **Admin**: Full system access and management (IT department only)

## Troubleshooting

### If you can't create admin users:

1. Check if you're authenticated as an admin
2. Verify the JWT token is valid
3. Ensure the database connection is working
4. Check server logs for error messages

### If the create-admin script fails:

1. Ensure MongoDB is running
2. Check the MONGODB_URI environment variable
3. Verify the database connection string
4. Check if the User model is properly imported

## Production Deployment

For production deployment:

1. Change default admin credentials
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Set up proper logging and monitoring
5. Regular security audits
6. Backup admin credentials securely

## Support

For technical support or questions about admin setup, contact the IT department.
