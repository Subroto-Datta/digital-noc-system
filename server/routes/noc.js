const express = require('express');
const router = express.Router();
const {
  createNoc,
  getNocById,
  getNocsForUser,
  updateNoc,
  deleteNoc,
} = require('../controllers/nocController');

// Note: The authMiddleware is already applied in app.js for all /noc routes,
// so we don't need to add it to each route here.

// POST route to create a new NOC request
router.post('/create', createNoc);

// GET route to fetch a single NOC request by its ID
router.get('/:id', getNocById);

// GET route to fetch all NOC requests for a user
router.get('/user/:userId', getNocsForUser);

// PUT route to update an NOC request
router.put('/update/:id', updateNoc);

// DELETE route to delete an NOC request
router.delete('/delete/:id', deleteNoc);

module.exports = router;