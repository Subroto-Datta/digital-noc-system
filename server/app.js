require('express-async-errors');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const nocRoutes = require('./routes/noc');
const authenticationMiddleware = require('./middlewares/authenticationMiddleware');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/noc', authenticationMiddleware, nocRoutes);

// A simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend running ✅' });
});

// 3. Register the error handler as the last middleware
app.use(errorHandlerMiddleware);

module.exports = app;