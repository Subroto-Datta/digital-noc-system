#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

console.log('🚀 Digital NOC System - Quick Setup Script\n');

// Color functions for better console output
const colors = {
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`,
    bold: (text) => `\x1b[1m${text}\x1b[0m`
};

function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    switch(type) {
        case 'success':
            console.log(`[${timestamp}] ${colors.green('✅')} ${message}`);
            break;
        case 'error':
            console.log(`[${timestamp}] ${colors.red('❌')} ${message}`);
            break;
        case 'warning':
            console.log(`[${timestamp}] ${colors.yellow('⚠️')} ${message}`);
            break;
        case 'info':
            console.log(`[${timestamp}] ${colors.blue('ℹ️')} ${message}`);
            break;
    }
}

function createEnvFile(filePath, template) {
    if (fs.existsSync(filePath)) {
        log(`Environment file already exists: ${filePath}`, 'warning');
        return false;
    }
    
    fs.writeFileSync(filePath, template);
    log(`Created environment file: ${filePath}`, 'success');
    return true;
}

function installDependencies(directory) {
    try {
        log(`Installing dependencies in ${directory}...`);
        process.chdir(directory);
        execSync('npm install', { stdio: 'inherit' });
        log(`Dependencies installed successfully in ${directory}`, 'success');
        return true;
    } catch (error) {
        log(`Failed to install dependencies in ${directory}: ${error.message}`, 'error');
        return false;
    }
}

function createDirectories() {
    const dirs = [
        'backend/uploads',
        'backend/uploads/noc-documents'
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            log(`Created directory: ${dir}`, 'success');
        }
    });
}

function generateJWTSecret() {
    return crypto.randomBytes(64).toString('hex');
}

function main() {
    const rootDir = process.cwd();
    
    log(colors.bold('Starting Digital NOC System setup...'));
    
    // Step 1: Create backend .env file
    log('📝 Creating backend environment file...');
    const backendEnvTemplate = `# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/digital-noc?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=${generateJWTSecret()}

# Server Configuration
PORT=5000
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# CORS Configuration
FRONTEND_URL=http://localhost:3000
`;
    
    createEnvFile('backend/.env', backendEnvTemplate);
    
    // Step 2: Create frontend .env file
    log('📝 Creating frontend environment file...');
    const frontendEnvTemplate = `# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# App Configuration
REACT_APP_NAME=Digital NOC System
REACT_APP_VERSION=1.0.0
`;
    
    createEnvFile('frontend/.env', frontendEnvTemplate);
    
    // Step 3: Create necessary directories
    log('📁 Creating upload directories...');
    createDirectories();
    
    // Step 4: Install backend dependencies
    log('📦 Installing backend dependencies...');
    if (installDependencies(path.join(rootDir, 'backend'))) {
        log('Backend dependencies installed successfully', 'success');
    }
    
    // Step 5: Install frontend dependencies
    log('📦 Installing frontend dependencies...');
    process.chdir(rootDir);
    if (installDependencies(path.join(rootDir, 'frontend'))) {
        log('Frontend dependencies installed successfully', 'success');
    }
    
    // Reset to root directory
    process.chdir(rootDir);
    
    // Step 6: Create package.json scripts for easy development
    const packageJsonPath = 'package.json';
    let packageJson;
    
    if (fs.existsSync(packageJsonPath)) {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } else {
        packageJson = {
            name: "digital-noc-system",
            version: "1.0.0",
            description: "Digital NOC System - Full Stack Application",
            scripts: {},
            keywords: ["noc", "digital", "system", "react", "nodejs"],
            author: "",
            license: "MIT"
        };
    }
    
    // Add convenience scripts
    packageJson.scripts = {
        ...packageJson.scripts,
        "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
        "dev:backend": "cd backend && npm start",
        "dev:frontend": "cd frontend && npm start",
        "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install",
        "build": "cd frontend && npm run build",
        "start:production": "cd backend && npm run start:production"
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    log('Updated package.json with convenience scripts', 'success');
    
    // Step 7: Install concurrently for running both servers
    try {
        log('Installing concurrently for development...');
        execSync('npm install concurrently --save-dev', { stdio: 'inherit' });
        log('Concurrently installed successfully', 'success');
    } catch (error) {
        log('Failed to install concurrently (optional)', 'warning');
    }
    
    // Success message
    console.log('\n' + colors.green('🎉 Setup completed successfully!'));
    console.log('\n' + colors.bold('Next steps:'));
    console.log('1. ' + colors.yellow('Configure your MongoDB URI in backend/.env'));
    console.log('2. ' + colors.yellow('Set up Google OAuth and update GOOGLE_CLIENT_ID in both .env files'));
    console.log('3. ' + colors.yellow('Run "npm run dev" to start both servers'));
    console.log('4. ' + colors.yellow('Create an admin user: cd backend && node scripts/create-admin.js'));
    console.log('\n' + colors.blue('📖 For detailed setup instructions, see FULL_SETUP_GUIDE.md'));
    console.log('\n' + colors.green('Happy coding! 🚀'));
}

// Run the setup
try {
    main();
} catch (error) {
    log(`Setup failed: ${error.message}`, 'error');
    process.exit(1);
}