const { execSync } = require('child_process');
const path = require('path');

console.log('Building frontend...');
process.chdir(path.join(__dirname, 'frontend'));

// Set CI=false to ignore warnings and build successfully
process.env.CI = 'false';

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Frontend build completed successfully!');
} catch (error) {
  console.error('Frontend build failed:', error.message);
  process.exit(1);
}