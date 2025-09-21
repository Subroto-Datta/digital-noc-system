const mongoose = require('mongoose');

const NocRequestSchema = new mongoose.Schema({
  // This links the NOC request to a specific user in the 'User' collection.
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This must match the name you used in mongoose.model('User', ...)
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // This provides a clear status for the request's workflow.
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  // We can add fields for comments or uploaded files here later.
}, { timestamps: true }); // Using timestamps is a good practice.

module.exports = mongoose.model('NocRequest', NocRequestSchema);