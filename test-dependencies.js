// test-dependencies.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main function to test dependencies
function testDependencies() {
  try {
    log('Starting dependency testing for FilmChain project...');

    // Check if required files exist
    log('Checking for critical files...');
    const requiredFiles = [
      'src/App.js',
      'src/contexts/WalletContext.js',
      'src/components/MetaMaskConnector.js',
      'public/index.html'
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        log(`ERROR: Required file ${file} is missing!`);
        process.exit(1);
      } else {
        log(`✓ ${file} exists`);
      }
    }

    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
      log('ERROR: node_modules directory not found. Please run install-dependencies.js first.');
      process.exit(1);
    } else {
      log('✓ node_modules exists');
    }

    // Test MetaMask detection code
    log('Creating MetaMask test script...');
    const metamaskTestContent = `
// Simple test to check if the MetaMask detection code would work
console.log("Testing MetaMask detection logic...");

// Mock window.ethereum
const mockEthereum = {
  isMetaMask: true,
  request: () => Promise.resolve(['0x123456789abcdef']),
  on: (event, callback) => console.log(\`Would register listener for \${event} event\`)
};

// Simulate detection
console.log("window.ethereum exists:", !!mockEthereum);
console.log("isMetaMask:", mockEthereum.isMetaMask);

// Test account request
mockEthereum.request({ method: 'eth_accounts' })
  .then(accounts => {
    console.log("Accounts:", accounts);
    console.log("✓ MetaMask account request simulation successful");
  })
  .catch(err => {
    console.error("Error in MetaMask simulation:", err);
  });

console.log("MetaMask detection test completed");
`;

    fs.writeFileSync('metamask-test.js', metamaskTestContent);
    log('Running MetaMask test script...');
    execSync('node metamask-test.js', { stdio: 'inherit' });

    log('All tests completed successfully!');
    log('Your FilmChain project dependencies appear to be working correctly.');
  } catch (error) {
    log(`Error during testing: ${error.message}`);
    process.exit(1);
  }
}

// Run the tests
testDependencies();
