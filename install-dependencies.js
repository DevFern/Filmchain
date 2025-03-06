// install-dependencies.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main function to install dependencies
function installDependencies() {
  try {
    log('Starting dependencies installation for FilmChain project...');

    // Check if npm is installed
    try {
      execSync('npm --version', { stdio: 'ignore' });
    } catch (error) {
      log('npm is not installed. Please install Node.js and npm first.');
      process.exit(1);
    }

    // Install dependencies with legacy peer deps flag
    log('Installing dependencies...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

    // Install specific dependencies that might be causing issues
    log('Installing specific dependencies that might be problematic...');
    const specificDeps = [
      '@babel/plugin-transform-private-property-in-object',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-nullish-coalescing-operator',
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-numeric-separator'
    ];

    for (const dep of specificDeps) {
      log(`Installing ${dep}...`);
      execSync(`npm install --legacy-peer-deps ${dep}`, { stdio: 'inherit' });
    }

    // Fix potential issues with ethers.js
    log('Installing ethers.js v5.7.2 (as specified in package.json)...');
    execSync('npm install --legacy-peer-deps ethers@5.7.2', { stdio: 'inherit' });

    // Install framer-motion for animations
    log('Installing framer-motion...');
    execSync('npm install --legacy-peer-deps framer-motion', { stdio: 'inherit' });

    // Run the build fix script
    log('Running build-fix.js script...');
    require('./build-fix.js');

    log('Dependencies installation completed successfully!');
    log('You can now run "npm start" to start the development server.');
  } catch (error) {
    log(`Error during installation: ${error.message}`);
    process.exit(1);
  }
}

// Run the installation
installDependencies();
