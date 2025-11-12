# Digital NOC Management System

A comprehensive web-based application designed to streamline the process of generating, tracking, and managing NOC (No Objection Certificate) requests within academic institutions.

## 🎯 Core Purpose & Functionality

NOC (No Objection Certificate) is typically required by students for various purposes like:
- Internships at companies
- Study abroad programs
- Research collaborations
- External project participation
- Other academic activities requiring institutional approval

## ✨ Key Features

### 🔐 User Authentication System
- JWT-based login/signup
- Role-based access (Student, Faculty, Admin)
- Secure password hashing with bcrypt

### 📋 NOC Request Management
- Create new NOC requests with details like:
  - Title, Department, Purpose, Description
  - Status tracking (Pending, Approved, Rejected)
- View all submitted NOC requests
- Track application status

### 🎛️ Role-Based Access Control
- **Students**: Can create and view their own NOC requests
- **Faculty/Admin**: Can approve/reject NOC requests
- **Administrators**: Can manage the entire NOC workflow

### 📊 Dashboard Interface
- Clean, modern UI for form submission and tracking
- Protected routes for authenticated users
- Responsive design with Tailwind CSS

## 🏗️ Technical Architecture

### Frontend (React.js)
- React 19.1.1 with React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- JWT token management for authentication
- Protected routes for secure access

### Backend (Node.js/Express)
- Express.js server with RESTful API
- MongoDB with Mongoose ODM
- JWT authentication middleware
- Role-based authorization
- Input validation with express-validator

## 📊 Database Models

### User Model
Stores user information (name, email, password, role, department, studentId)

### NocRequest Model
Stores NOC request details linked to users with comprehensive tracking

## 🚀 API Structure

### Authentication Routes:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### NOC Routes:
- `POST /api/noc/create` - Create new NOC request
- `GET /api/noc/:id` - Get specific NOC request
- `GET /api/noc/user/:userId` - Get all NOCs for a user
- `GET /api/noc` - Get all NOCs (Admin/Faculty)
- `PUT /api/noc/update/:id` - Update NOC request (Admin/Faculty)
- `DELETE /api/noc/delete/:id` - Delete NOC request (Admin/Faculty)
- `GET /api/noc/stats/overview` - Get NOC statistics (Admin/Faculty)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/noc_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🎯 Target Users

- **Students**: Submit NOC requests for various academic activities
- **Faculty**: Review and approve/reject student requests
- **Administrators**: Manage the entire NOC workflow

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Starts React development server
```

### Database
Make sure MongoDB is running on your system. The application will automatically create the necessary collections.

## 📱 Features Overview

### For Students
- Create and submit NOC requests
- Track request status
- View request history
- Update profile information

### For Faculty/Admin
- Review all NOC requests
- Approve or reject requests
- Add review comments
- View statistics and analytics
- Filter requests by status, department, etc.

### For Administrators
- Full system management
- User management capabilities
- Advanced analytics
- System configuration

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet.js security headers

## 🎨 UI/UX Features

- Responsive design
- Modern, clean interface
- Role-based navigation
- Status indicators
- Loading states
- Error handling
- Form validation

## 📈 Future Enhancements

- Email notifications
- File upload support
- Advanced reporting
- Mobile app
- Integration with existing academic systems
- Automated approval workflows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

This system digitizes what is typically a paper-based, manual process in academic institutions, making it more efficient, trackable, and accessible for all stakeholders involved in the NOC approval process.