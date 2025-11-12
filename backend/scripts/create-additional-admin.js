const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdditionalAdmin = async () => {
  try {
    // Check if admin creation is enabled
    if (process.env.ENABLE_ADMIN_CREATION !== 'true') {
      console.log('❌ Admin creation is disabled.');
      console.log('To enable admin creation, set ENABLE_ADMIN_CREATION=true in your environment variables.');
      console.log('This is a security feature to prevent unauthorized admin creation.');
      process.exit(0);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noc-system');
    console.log('✅ Connected to MongoDB');

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@college.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'IT Department Head';
    const adminDepartment = process.env.ADMIN_DEPARTMENT || 'IT Department';

    // Check if this specific admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('ℹ️  Admin user with this email already exists:', existingAdmin.email);
      console.log('Change ADMIN_EMAIL in your .env file to create a different admin.');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      department: adminDepartment,
      role: 'admin'
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('🎉 Additional admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Name:', admin.name);
    console.log('🏢 Department:', admin.department);
    console.log('');
    console.log('⚠️  IMPORTANT SECURITY STEPS:');
    console.log('1. Change the password after first login');
    console.log('2. Set ENABLE_ADMIN_CREATION=false or remove it from environment');
    console.log('3. Keep admin credentials secure');
    console.log('');
    console.log('✅ Additional admin setup complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating additional admin:', error);
    process.exit(1);
  }
};

// Run the script
createAdditionalAdmin();
