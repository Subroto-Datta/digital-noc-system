const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const NocRequest = require('../models/NocRequest');
const { auth, authorize } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const { calculatePriority } = require('../utils/priorityCalculator');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/noc-documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF) and PDF files are allowed'));
    }
  }
});

// @route   POST /api/noc/create
// @desc    Create a new NOC request
// @access  Private (Student)
router.post('/create', auth, authorize('student'), upload.array('documents'), [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('purpose')
    .isIn(['internship', 'research_collaboration', 'external_project', 'conference_attendance', 'workshop_participation', 'other'])
    .withMessage('Invalid purpose'),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, purpose, department } = req.body;
    const files = req.files || [];

    // Debug: Log received data
    console.log('Received NOC request:', { title, description, purpose, department });
    console.log('Received files:', files);

    // Process uploaded documents
    const attachments = files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      uploadedAt: new Date()
    }));

    // Calculate priority based on title and description
    const priority = calculatePriority(title, description, purpose);
    console.log('Calculated priority:', priority, 'for title:', title);

    const nocRequest = new NocRequest({
      title,
      description,
      purpose,
      department,
      attachments,
      priority,
      student: req.user._id
    });

    await nocRequest.save();
    await nocRequest.populate('student', 'name email department studentId');

    res.status(201).json({
      message: 'NOC request created successfully',
      nocRequest
    });

  } catch (error) {
    console.error('Create NOC error:', error);
    
    // Clean up uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create NOC request. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/noc/download/:filename
// @desc    Download a document
// @access  Private
router.get('/download/:filename', auth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/noc-documents', filename);
    
    console.log('Download request for:', filename);
    console.log('File path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found at path:', filePath);
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
});

// @route   GET /api/noc/view/:filename
// @desc    View a document in browser
// @access  Private
router.get('/view/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/noc-documents', filename);
    
    // Check authorization from either header or query parameter (for iframe)
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    
    console.log('View request for:', filename);
    console.log('File path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found at path:', filePath);
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    }
    
    console.log('Content type:', contentType);
    console.log('File extension:', ext);
    
    // Set appropriate headers for viewing inline with better CORS support
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for file viewing
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Get file stats for content length
    const stats = fs.statSync(filePath);
    res.setHeader('Content-Length', stats.size);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error reading file' });
      }
    });
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('View error:', error);
    res.status(500).json({ message: 'Error viewing file' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
  }
  if (error.message === 'Only image files (JPEG, PNG, GIF) and PDF files are allowed') {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

// @route   GET /api/noc/user/:userId
// @desc    Get all NOC requests for a specific user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Students can only view their own requests, faculty/admin can view any
    if (req.user.role === 'student' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const nocRequests = await NocRequest.find({ student: userId })
      .populate('student', 'name email department studentId')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      nocRequests,
      count: nocRequests.length
    });

  } catch (error) {
    console.error('Get user NOC requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/noc/:id
// @desc    Get a specific NOC request
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const nocRequest = await NocRequest.findById(id)
      .populate('student', 'name email department studentId')
      .populate('reviewedBy', 'name email');

    if (!nocRequest) {
      return res.status(404).json({ message: 'NOC request not found' });
    }

    // Students can only view their own requests, faculty/admin can view any
    if (req.user.role === 'student' && nocRequest.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ nocRequest });

  } catch (error) {
    console.error('Get NOC request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/noc
// @desc    Get all NOC requests (for faculty/admin)
// @access  Private (Faculty/Admin)
router.get('/', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const { status, department, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;

    const skip = (page - 1) * limit;

    const nocRequests = await NocRequest.find(filter)
      .populate('student', 'name email department studentId')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await NocRequest.countDocuments(filter);

    res.json({
      nocRequests,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get all NOC requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/noc/update/:id
// @desc    Update NOC request status (for faculty/admin)
// @access  Private (Faculty/Admin)
router.put('/update/:id', auth, authorize('faculty', 'admin'), [
  body('status')
    .isIn(['pending', 'approved', 'rejected', 'under_review'])
    .withMessage('Invalid status'),
  body('reviewComments')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review comments cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, reviewComments, title, description, purpose } = req.body;

    const nocRequest = await NocRequest.findById(id);
    if (!nocRequest) {
      return res.status(404).json({ message: 'NOC request not found' });
    }

    // Recalculate priority if title, description, or purpose is updated
    if (title || description || purpose) {
      const newTitle = title || nocRequest.title;
      const newDescription = description || nocRequest.description;
      const newPurpose = purpose || nocRequest.purpose;
      
      const newPriority = calculatePriority(newTitle, newDescription, newPurpose);
      console.log('Recalculated priority:', newPriority, 'for updated NOC:', id);
      
      // Update the fields if provided
      if (title) nocRequest.title = title;
      if (description) nocRequest.description = description;
      if (purpose) nocRequest.purpose = purpose;
      nocRequest.priority = newPriority;
    }

    await nocRequest.updateStatus(status, req.user._id, reviewComments);
    await nocRequest.populate('student', 'name email department studentId');
    await nocRequest.populate('reviewedBy', 'name email');

    res.json({
      message: 'NOC request updated successfully',
      nocRequest
    });

  } catch (error) {
    console.error('Update NOC request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/noc/priority-analysis/:id
// @desc    Get detailed priority analysis for a NOC request
// @access  Private (Admin only)
router.get('/priority-analysis/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const nocRequest = await NocRequest.findById(id);
    
    if (!nocRequest) {
      return res.status(404).json({ message: 'NOC request not found' });
    }

    const { getPriorityAnalysis } = require('../utils/priorityCalculator');
    const analysis = getPriorityAnalysis(nocRequest.title, nocRequest.description, nocRequest.purpose);

    res.json({
      nocRequest: {
        id: nocRequest._id,
        title: nocRequest.title,
        description: nocRequest.description,
        purpose: nocRequest.purpose,
        currentPriority: nocRequest.priority
      },
      analysis
    });

  } catch (error) {
    console.error('Priority analysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/noc/delete/:id
// @desc    Delete NOC request
// @access  Private (Admin only)
router.delete('/delete/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const nocRequest = await NocRequest.findById(id);
    if (!nocRequest) {
      return res.status(404).json({ message: 'NOC request not found' });
    }

    await NocRequest.findByIdAndDelete(id);

    res.json({ message: 'NOC request deleted successfully' });

  } catch (error) {
    console.error('Delete NOC request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/noc/stats/overview
// @desc    Get NOC statistics overview
// @access  Private (Faculty/Admin)
router.get('/stats/overview', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const stats = await NocRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRequests = await NocRequest.countDocuments();
    const recentRequests = await NocRequest.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      under_review: 0
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    res.json({
      totalRequests,
      recentRequests,
      statusCounts
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/noc/email-certificate
// @desc    Email NOC certificate to student
// @access  Private (Faculty/Admin only)
router.post('/email-certificate', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const { nocId, studentEmail } = req.body;
    
    if (!nocId || !studentEmail) {
      return res.status(400).json({ message: 'NOC ID and student email are required' });
    }

    // Find the NOC request
    const nocRequest = await NocRequest.findById(nocId).populate('student');
    if (!nocRequest) {
      return res.status(404).json({ message: 'NOC request not found' });
    }

    // Check if NOC is approved
    if (nocRequest.status !== 'approved') {
      return res.status(400).json({ message: 'NOC must be approved before sending certificate' });
    }

    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: studentEmail,
      subject: `NOC Certificate - ${nocRequest.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">NOC Certificate Approved</h2>
          <p>Dear ${nocRequest.student.name},</p>
          <p>Your No Objection Certificate for <strong>${nocRequest.title}</strong> has been approved and is ready for download.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Certificate Details:</h3>
            <ul>
              <li><strong>Purpose:</strong> ${nocRequest.purpose.replace('_', ' ').toUpperCase()}</li>
              <li><strong>Department:</strong> ${nocRequest.department}</li>
              <li><strong>Approved Date:</strong> ${new Date(nocRequest.updatedAt).toLocaleDateString()}</li>
              <li><strong>Certificate ID:</strong> NOC-${nocRequest._id.toString().slice(-8).toUpperCase()}</li>
            </ul>
          </div>
          
          <p>Please log in to your dashboard to download and print your certificate.</p>
          
          <p>If you have any questions, please contact the administration office.</p>
          
          <p>Best regards,<br>
          College Administration</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Certificate sent successfully to student email',
      sentTo: studentEmail
    });

  } catch (error) {
    console.error('Email certificate error:', error);
    res.status(500).json({ message: 'Failed to send certificate email' });
  }
});

module.exports = router;
