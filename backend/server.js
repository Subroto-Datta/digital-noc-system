const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const nocRoutes = require('./routes/noc');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://digital-noc-system.onrender.com', // Updated for full-stack deployment
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noc_management')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/noc', nocRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NOC Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check build files
app.get('/api/debug', (req, res) => {
  const buildPath = path.join(__dirname, '../frontend/build');
  const fs = require('fs');
  
  try {
    const buildExists = fs.existsSync(buildPath);
    const indexExists = fs.existsSync(path.join(buildPath, 'index.html'));
    const files = buildExists ? fs.readdirSync(buildPath) : [];
    
    res.json({
      environment: process.env.NODE_ENV,
      port: process.env.PORT,
      render: !!process.env.RENDER,
      buildPath,
      buildExists,
      indexExists,
      files: files.slice(0, 10) // First 10 files
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Serve static files from React build - force production mode on Render
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.PORT;

if (isProduction) {
  // Serve static files from the React app build directory
  const buildPath = path.join(__dirname, '../frontend/build');
  console.log(`Serving static files from: ${buildPath}`);
  app.use(express.static(buildPath));
  
  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    const indexPath = path.join(buildPath, 'index.html');
    console.log(`Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath);
  });
} else {
  // Development mode - just return a message for non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    res.json({ message: 'API is running. Frontend should be served separately in development.' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
