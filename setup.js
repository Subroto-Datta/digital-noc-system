// NOC Management System Setup Script
const fs = require('fs');
const path = require('path');

console.log('🚀 NOC Management System Setup');
console.log('================================\n');

// Create .env file for backend
const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/noc_management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_123456789
NODE_ENV=development
FRONTEND_URL=http://localhost:3000`;

const backendEnvPath = path.join(__dirname, 'backend', '.env');

try {
  fs.writeFileSync(backendEnvPath, envContent);
  console.log('✅ Created backend/.env file');
} catch (error) {
  console.log('❌ Could not create .env file:', error.message);
  console.log('📝 Please create backend/.env manually with the following content:');
  console.log(envContent);
}

console.log('\n📋 Setup Instructions:');
console.log('1. Install MongoDB locally OR use MongoDB Atlas (cloud)');
console.log('2. Update the MONGODB_URI in backend/.env if using Atlas');
console.log('3. Start the backend: cd backend && npm run dev');
console.log('4. Start the frontend: cd frontend && npm start');
console.log('\n🌐 MongoDB Atlas Setup (Recommended):');
console.log('1. Go to: https://www.mongodb.com/atlas');
console.log('2. Create a free account');
console.log('3. Create a new cluster (M0 free tier)');
console.log('4. Get your connection string');
console.log('5. Replace MONGODB_URI in backend/.env with your Atlas connection string');

console.log('\n🎯 Quick Start Commands:');
console.log('Backend:  cd backend && npm run dev');
console.log('Frontend: cd frontend && npm start');
console.log('\n📱 Access URLs:');
console.log('Frontend: http://localhost:3000');
console.log('Backend:  http://localhost:5000');
console.log('Health:   http://localhost:5000/api/health');

