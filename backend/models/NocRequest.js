const mongoose = require('mongoose');

const nocRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    enum: [
      'internship',
      'study_abroad',
      'research_collaboration',
      'external_project',
      'conference_attendance',
      'workshop_participation',
      'other'
    ]
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewComments: {
    type: String,
    trim: true,
    maxlength: [500, 'Review comments cannot exceed 500 characters']
  },
  reviewedAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
nocRequestSchema.index({ student: 1, status: 1 });
nocRequestSchema.index({ status: 1, createdAt: -1 });
nocRequestSchema.index({ department: 1, status: 1 });

// Virtual for formatted creation date
nocRequestSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to update status
nocRequestSchema.methods.updateStatus = function(newStatus, reviewedBy, comments) {
  this.status = newStatus;
  this.reviewedBy = reviewedBy;
  this.reviewComments = comments;
  this.reviewedAt = new Date();
  return this.save();
};

// Static method to get requests by status
nocRequestSchema.statics.getByStatus = function(status) {
  return this.find({ status }).populate('student', 'name email department');
};

// Static method to get requests by student
nocRequestSchema.statics.getByStudent = function(studentId) {
  return this.find({ student: studentId }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('NocRequest', nocRequestSchema);
