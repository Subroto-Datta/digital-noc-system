const express = require('express');
const router = express.Router();
const NocRequest = require('../models/NocRequest');

// Create new NOC
router.post('/create', async (req, res) => {
  try {
    const newNOC = new NocRequest(req.body);
    const saved = await newNOC.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get NOC by ID
router.get('/:id', async (req, res) => {
  try {
    const noc = await NocRequest.findById(req.params.id);
    if (!noc) return res.status(404).json({ error: 'NOC not found' });
    res.json(noc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all NOC requests for a specific user (by roll number or any user identifier)
router.get('/user/:userId', async (req, res) => {
  try {
    const nocs = await NocRequest.find({ rollNo: req.params.userId });
    res.json(nocs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a NOC request
router.put('/update/:id', async (req, res) => {
  try {
    const updatedNOC = await NocRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedNOC) return res.status(404).json({ error: 'NOC not found' });
    res.json(updatedNOC);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a NOC request
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await NocRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'NOC not found' });
    res.json({ message: 'NOC deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;