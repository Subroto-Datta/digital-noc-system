🚀 Digital NOC System

    A web-based application built using the MERN stack to streamline the process of generating, tracking, and managing No Objection Certificates (NOCs) within an academic department.

This MVP (Minimum Viable Product) is being developed for the IT Department of K.J. Somaiya Institute of Technology as a 5-month minor project.

📌 Features

🔐 User Authentication – JWT-based login/signup
📝 NOC Management – Create, Read, Update, Delete NOC requests
🎛️ Role-based Access – Students, Faculty, and Admins (future scope)
📊 Dashboard View – Track the status of NOC applications
☁️ Scalable Backend – MongoDB Atlas, Express, Node.js
🎨 Frontend (React) – Clean UI for form submission & tracking

🏗️ Tech Stack
Frontend: React.js, Axios, Tailwind CSS (UI)
Backend: Node.js, Express.js
Database: MongoDB Atlas (Mongoose ORM)
Authentication: JWT + bcrypt
Version Control: Git & GitHub

⚙️ Installation & Setup
1. Clone the repo
git clone https://github.com/<your-username>/digital-noc-system.git
cd digital-noc-system

2. Backend Setup
cd backend
npm install

Create a .env file inside backend/ and add:
PORT=5000
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-secret-key>


Run the backend:
npm start

3. Frontend Setup
cd frontend
npm install
npm run dev

📡 API Endpoints
🔐 Auth Routes
POST /auth/signup → Register new user
POST /auth/login → Login & return JWT

📝 NOC Routes
POST /noc/create → Create NOC request
GET /noc → Get all NOC requests
GET /noc/user/:id → Get specific NOC request
PUT /noc/update/:id → Update NOC request
DELETE /noc/delete/:id → Delete NOC request

🤝 Contribution Workflow
We follow GitHub Flow:
Create a new branch from dev
Commit changes with clear messages
Open a Pull Request to dev
After review → merge to main

👨‍💻 Contributors

Subroto Datta (Backend & Frontend Integration)
Swati Tiwari
Udita Pandya
Malaika Yadav
Guide: Mrs. Sarita Rathod, K.J. Somaiya Institute of Technology