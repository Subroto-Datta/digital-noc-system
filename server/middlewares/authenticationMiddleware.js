const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Authentication middleware to verify JWT token
// @access  Private
const authenticationMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Get token from Bearer token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid.' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token is not valid.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error in authentication middleware.' });
  }
};

module.exports = authenticationMiddleware;