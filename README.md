# Digital NOC System 🎓

A comprehensive web-based platform designed to streamline NOC (No Objection Certificate) requests and approval workflows across academic departments. This system digitizes the traditional paper-based NOC process, making it more efficient, transparent, and accessible for students and administrators.

## ✨ Features

- **Digital NOC Requests**: Submit and track NOC requests online
- **Multi-Department Support**: Handle requests across different academic departments
- **Real-time Tracking**: Monitor request status and approval progress
- **User-friendly Interface**: Intuitive React-based frontend
- **Secure Backend**: Robust Node.js/Express.js API
- **Database Management**: MongoDB Atlas for reliable data storage

## 🚀 Tech Stack

### Frontend
- **React.js** - Modern UI framework for building interactive user interfaces
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud-based NoSQL database
- **Mongoose** - MongoDB object modeling tool

### Development Tools
- **GitHub** - Version control and collaboration
- **Nodemon** - Development server with auto-restart

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (for database)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd digital-noc-system
```

### 2. Backend Setup
```bash
cd server
npm install
```

### 3. Environment Configuration
Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

### 4. Start the Backend Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`

### 5. Frontend Setup (when available)
```bash
cd client
npm install
npm start
```

## 📚 API Documentation

### NOC Request Endpoints

#### Create NOC Request
- **POST** `/noc/create`
- **Description**: Submit a new NOC request
- **Request Body**:
```json
{
  "studentName": "Subroto Datta",
  "rollNo": "21IT001",
  "department": "IT",
  "purpose": "Internship at TCS"
}
```

#### Get All NOC Requests
- **GET** `/noc/all`
- **Description**: Retrieve all NOC requests

#### Get NOC Request by ID
- **GET** `/noc/:id`
- **Description**: Retrieve a specific NOC request

#### Update NOC Request
- **PUT** `/noc/:id`
- **Description**: Update an existing NOC request

#### Delete NOC Request
- **DELETE** `/noc/:id`
- **Description**: Delete a NOC request

## 🏗️ Project Structure

```
digital-noc-system/
├── client/                 # React frontend (to be implemented)
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Custom middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API route definitions
│   └── index.js          # Server entry point
├── docs/                 # Documentation
│   └── API_Structure.md  # API documentation
└── README.md             # Project documentation
```

## 🚀 Usage

1. **Start the Backend Server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Access the API**:
   - Base URL: `http://localhost:5000`
   - API endpoints: `/noc/*`

3. **Submit NOC Request**:
   Use the API endpoints to create, read, update, and delete NOC requests.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Contributors

This project is developed by:

- **Subroto Datta** - Project Lead & Full Stack Developer
- **Malaika Yadav** - Frontend Developer
- **Udita Pandya** - Backend Developer
- **Swati Tiwari** - UI/UX Designer

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Made with ❤️ by the Digital NOC System Team**
