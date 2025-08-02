// server/models/NocRequest.js
const mongoose = require('mongoose');

const NocRequestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  department: { type: String, required: true },
  purpose: { type: String, required: true },
  facultyApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NocRequest', NocRequestSchema);