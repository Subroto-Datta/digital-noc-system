const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login } = require('../controllers/authController');

// Add validation middleware to the signup route
router.post(
  '/signup',
  [
    // name must not be empty
    body('name', 'Name is required').not().isEmpty(),
    // email must be a valid email
    body('email', 'Please include a valid email').isEmail(),
    // password must be at least 8 chars long
    body(
      'password',
      'Please enter a password with 8 or more characters'
    ).isLength({ min: 8 }),
  ],
  signup
);

router.post('/login', login);

module.exports = router;