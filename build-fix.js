// build-fix.js
const fs = require('fs');
const path = require('path');

// Helper function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main function
async function runBuildFix() {
  log('Starting build fix script...');

  try {
    // Fix CSS files first
    fixCssFiles();
    
    // Fix package.json dependencies if needed
    fixPackageJson();
    
    // Create or update configuration files
    updateNpmrc();
    updateVercelJson();
    updateBabelrc();
    
    // Fix component files if needed
    fixIndieFundSection();
    
    // Only fix WalletContext if MetaMaskConnector doesn't exist
    const metaMaskConnectorPath = path.join(__dirname, 'src', 'components', 'MetaMaskConnector.js');
    if (!fs.existsSync(metaMaskConnectorPath)) {
      log('MetaMaskConnector.js not found, applying WalletContext fix');
      fixWalletContext();
    } else {
      log('MetaMaskConnector.js found, skipping WalletContext replacement');
    }

    log('Build fix script completed successfully');
  } catch (error) {
    log(`Error in build fix script: ${error.message}`);
    process.exit(1);
  }
}

// Function to fix CSS files
function fixCssFiles() {
  try {
    log('Starting CSS files fix...');

    // Find all CSS files in the project
    const cssFiles = findCssFiles('src');
    log(`Found ${cssFiles.length} CSS files to check`);

    // Check and fix each CSS file
    for (const cssFile of cssFiles) {
      log(`Checking CSS file: ${cssFile}`);
      
      const content = fs.readFileSync(cssFile, 'utf8');
      
      // Fix unescaped forward slashes in problematic contexts
      const fixedContent = content
        // Replace any unescaped forward slashes in comments with escaped ones
        .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, comment => {
          return comment.replace(/\//g, '\\/');
        })
        // Fix unescaped slashes in URLs
        .replace(/url$$['"]?([^'")]+)['"]?$$/g, (match, url) => {
          return `url('${url.replace(/\//g, '\\/')}')`;
        });
      
      if (content !== fixedContent) {
        fs.writeFileSync(cssFile, fixedContent);
        log(`Fixed issues in ${cssFile}`);
      } else {
        log(`No issues found in ${cssFile}`);
      }
    }

    // Create or update key CSS files with known good content
    updateAppCss();
    updateHomePageCss();
    updateMetaMaskConnectorCss();

    log('CSS files fix completed successfully!');
  } catch (error) {
    log(`Error during CSS files fix: ${error.message}`);
    throw error;
  }
}

// Function to find all CSS files in a directory recursively
function findCssFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findCssFiles(filePath, fileList);
    } else if (file.endsWith('.css')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Fix package.json by removing problematic dependencies and adding required ones
function fixPackageJson() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Count dependencies before changes
      const depCount = Object.keys(packageJson.dependencies || {}).length;
      log(`Dependencies found: ${depCount}`);
      
      // Remove problematic dependencies
      if (packageJson.dependencies && packageJson.dependencies['@helia/http']) {
        delete packageJson.dependencies['@helia/http'];
        log('Removed @helia/http dependency');
      }
      
      if (packageJson.dependencies && packageJson.dependencies['helia']) {
        delete packageJson.dependencies['helia'];
        log('Removed helia dependency');
      }
      
      // Fix malformed package.json if needed
      if (packageJson.dependencies && typeof packageJson.dependencies['@babel/plugin-proposal-private-property-in-object'] === 'string') {
        const babelPlugin = packageJson.dependencies['@babel/plugin-proposal-private-property-in-object'];
        delete packageJson.dependencies['@babel/plugin-proposal-private-property-in-object'];
        
        if (!packageJson.devDependencies) {
          packageJson.devDependencies = {};
        }
        
        packageJson.devDependencies['@babel/plugin-proposal-private-property-in-object'] = babelPlugin;
        log('Moved @babel/plugin-proposal-private-property-in-object to devDependencies');
      }
      
      // Add required Babel plugins to devDependencies
      if (!packageJson.devDependencies) {
        packageJson.devDependencies = {};
      }
      
      // Add @babel/plugin-proposal-private-property-in-object to devDependencies if it doesn't exist
      if (!packageJson.devDependencies['@babel/plugin-proposal-private-property-in-object']) {
        packageJson.devDependencies['@babel/plugin-proposal-private-property-in-object'] = '^7.21.0';
        log('Added @babel/plugin-proposal-private-property-in-object to devDependencies');
      }
      
      // Save changes
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    } catch (error) {
      log(`Error parsing package.json: ${error.message}`);
      // Create a new valid package.json if parsing fails
      createNewPackageJson();
    }
  } else {
    log('package.json not found, creating new one');
    createNewPackageJson();
  }
}

// Create a new valid package.json file
function createNewPackageJson() {
  const validPackageJson = {
    "name": "filmchain-platform",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
      "@openzeppelin/contracts": "^4.8.0",
      "@testing-library/jest-dom": "^5.16.5",
      "@testing-library/react": "^13.4.0",
      "@testing-library/user-event": "^13.5.0",
      "ajv": "^8.12.0",
      "ajv-keywords": "^5.1.0",
      "axios": "^1.2.1",
      "ethers": "^5.7.2",
      "framer-motion": "^10.16.4",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.4.5",
      "react-scripts": "5.0.1",
      "web3": "^1.8.1"
    },
    "devDependencies": {
      "@babel/plugin-proposal-private-property-in-object": "^7.21.0"
    },
    "scripts": {
      "prebuild": "node build-fix.js",
      "postinstall": "node build-fix.js",
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    },
    "eslintConfig": {
      "extends": [
        "react-app",
        "react-app/jest"
      ]
    },
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(validPackageJson, null, 2));
  log('Created new package.json file');
}

// Update .npmrc file
function updateNpmrc() {
  const npmrcPath = path.join(__dirname, '.npmrc');
  const npmrcContent = 'legacy-peer-deps=true\nsave-exact=true\naudit=false\nfund=false';
  
  fs.writeFileSync(npmrcPath, npmrcContent);
  log('Updated .npmrc file');
}

// Create or update vercel.json
function updateVercelJson() {
  const vercelJsonPath = path.join(__dirname, 'vercel.json');
  const vercelJsonContent = {
    "version": 2,
    "buildCommand": "CI=false npm run build",
    "outputDirectory": "build",
    "routes": [
      { "handle": "filesystem" },
      { "src": "/[^.]+", "dest": "/index.html" }
    ]
  };
  
  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJsonContent, null, 2));
  log('Created/Updated vercel.json file');
}

// Create or update .babelrc
function updateBabelrc() {
  const babelrcPath = path.join(__dirname, '.babelrc');
  const babelrcContent = {
    "presets": ["@babel/preset-env", "@babel/preset-react"],
    "plugins": [
      "@babel/plugin-proposal-private-property-in-object",
      "@babel/plugin-transform-private-property-in-object",
      "@babel/plugin-transform-private-methods",
      "@babel/plugin-transform-class-properties",
      "@babel/plugin-transform-nullish-coalescing-operator",
      "@babel/plugin-transform-optional-chaining",
      "@babel/plugin-transform-numeric-separator"
    ]
  };
  
  fs.writeFileSync(babelrcPath, JSON.stringify(babelrcContent, null, 2));
  log('Created/Updated .babelrc file');
}

// Fix IndieFundSection component
function fixIndieFundSection() {
  const indieFundSectionPath = path.join(__dirname, 'src', 'components', 'IndieFundSection.js');
  const indieFundCssPath = path.join(__dirname, 'src', 'components', 'IndieFundSection.css');
  
  // Create directory if it doesn't exist
  const componentsDir = path.join(__dirname, 'src', 'components');
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  // Create a known working version of IndieFundSection.js
  const indieFundSectionContent = `import React from 'react';
import './IndieFundSection.css';

const IndieFundSection = () => {
  return (
    <section className="indie-fund-section">
      <div className="container">
        <h2>Indie Film Funding</h2>
        <p>Support independent filmmakers and earn rewards through blockchain technology.</p>
        
        <div className="fund-options">
          <div className="fund-card">
            <h3>Micro Investments</h3>
            <p>Invest small amounts in multiple projects to diversify your portfolio.</p>
            <button className="fund-button">Learn More</button>
          </div>
          
          <div className="fund-card">
            <h3>Producer Credits</h3>
            <p>Larger investments can earn you producer credits and profit sharing.</p>
            <button className="fund-button">Learn More</button>
          </div>
          
          <div className="fund-card">
            <h3>NFT Rewards</h3>
            <p>Receive exclusive NFTs and digital collectibles from supported films.</p>
            <button className="fund-button">Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndieFundSection;`;

  // Create CSS for IndieFundSection
  const indieFundCssContent = `.indie-fund-section {
  padding: 60px 0;
  background-color: #f5f5f5;
}

.indie-fund-section h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.fund-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin-top: 40px;
}

.fund-card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 250px;
  transition: transform 0.3s ease;
}

.fund-card:hover {
  transform: translateY(-5px);
}

.fund-card h3 {
  color: #f6851b;
  margin-bottom: 15px;
}

.fund-button {
  background-color: #f6851b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  margin-top: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.fund-button:hover {
  background-color: #e2761b;
}

@media (max-width: 768px) {
  .fund-options {
    flex-direction: column;
  }
  
  .fund-card {
    margin-bottom: 20px;
  }
}`;

  fs.writeFileSync(indieFundSectionPath, indieFundSectionContent);
  fs.writeFileSync(indieFundCssPath, indieFundCssContent);
  log('Created/Updated IndieFundSection.js with a known working version');
  log('Created/Updated IndieFundSection.css file');
}

// Fix WalletContext component - only called if MetaMaskConnector doesn't exist
function fixWalletContext() {
  const walletContextPath = path.join(__dirname, 'src', 'contexts', 'WalletContext.js');
  
  // Create directory if it doesn't exist
  const walletContextDir = path.dirname(walletContextPath);
  if (!fs.existsSync(walletContextDir)) {
    fs.mkdirSync(walletContextDir, { recursive: true });
  }
  
  // Create a simplified version of WalletContext.js
  const walletContextContent = `import React, { createContext, useState, useEffect, useContext } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        console.log('MetaMask is installed!');
        setIsMetaMaskInstalled(true);
        
        // Check if already connected
        window.ethereum.request({ method: 'eth_accounts' })
          .then(accounts => {
            if (accounts && accounts.length > 0) {
              console.log('Already connected to account:', accounts[0]);
              setAccount(accounts[0]);
            }
            setIsInitializing(false);
          })
          .catch(err => {
            console.error('Error checking accounts:', err);
            setIsInitializing(false);
          });
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            console.log('Account changed to:', accounts[0]);
            setAccount(accounts[0]);
          } else {
            console.log('Account disconnected');
            setAccount(null);
          }
        });
      } else {
        console.log('MetaMask is not installed');
        setIsMetaMaskInstalled(false);
        setIsInitializing(false);
      }
    };
    
    // Small delay to ensure window.ethereum is available
    setTimeout(checkMetaMask, 1000);
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        console.log('Connected to account:', accounts[0]);
        setAccount(accounts[0]);
      } else {
        throw new Error('No accounts found');
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
      setError(err.message || 'Failed to connect to MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from MetaMask
  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isMetaMaskInstalled,
        isConnecting,
        isInitializing,
        error,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;`;

  fs.writeFileSync(walletContextPath, walletContextContent);
  log('Created/Updated WalletContext.js with a simplified version');
}

// Update App.css with known good content
function updateAppCss() {
  const appCssPath = path.join(__dirname, 'src', 'App.css');
  
  // Create directory if it doesn't exist
  const appDir = path.dirname(appCssPath);
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }
  
  const appCssContent = `/* App.css - Main application styles */
:root {
  --primary-color: #f6851b;
  --primary-hover: #e2761b;
  --secondary-color: #3498db;
  --text-color: #333333;
  --background-light: #f8f9fa;
  --background-dark: #343a40;
  --border-color: #dee2e6;
  --success-color: #28a745;
  --error-color: #dc3545;
  --warning-color: #ffc107;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.app-header {
  background-color: white;
  box-shadow: var(--shadow-sm);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.app-footer {
  background-color: var(--background-dark);
  color: white;
  padding: 40px 0;
  margin-top: 60px;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-section h3 {
  margin-bottom: 20px;
  font-size: 18px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-link {
  color: white;
  font-size: 20px;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: var(--primary-color);
}

.copyright {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #495057;
  color: #adb5bd;
}

/* Button styles */
.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background-color: #2980b9;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background-color: var(--primary-color);
  color: white;
}

/* Form styles */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Card styles */
.card {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.card-title {
  font-size: 20px;
  margin-bottom: 15px;
  color: var(--text-color);
}

.card-text {
  color: #6c757d;
  margin-bottom: 15px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .footer-container {
    flex-direction: column;
  }
}`;

  fs.writeFileSync(appCssPath, appCssContent);
  log('Created/Updated src/App.css');
}

// Update HomePage.css with known good content
function updateHomePageCss() {
  const homePageCssPath = path.join(__dirname, 'src', 'pages', 'HomePage.css');
  
  // Create directory if it doesn't exist
  const pagesDir = path.dirname(homePageCssPath);
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  const homePageCssContent = `/* HomePage.css */
.hero-section {
  background-color: #f8f9fa;
  padding: 80px 0;
  text-align: center;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

.hero-section p {
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto 30px;
}

.feature-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 50px;
}

.feature-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #f6851b;
}

.feature-card p {
  color: #6c757d;
}

.placeholder-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 30px 0;
  text-align: center;
}

.placeholder-section h2 {
  color: #333;
  margin-bottom: 15px;
}

.placeholder-section p {
  color: #6c757d;
}

.wallet-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 30px;
  margin: 30px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .feature-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .feature-card {
    width: 100%;
  }
}`;

  fs.writeFileSync(homePageCssPath, homePageCssContent);
  log('Created/Updated src/pages/HomePage.css');
}

// Update MetaMaskConnector.css with known good content
function updateMetaMaskConnectorCss() {
  const designFixesCssPath = path.join(__dirname, 'src', 'components', 'DesignFixes.css');
  
  // Create directory if it doesn't exist
  const componentsDir = path.dirname(designFixesCssPath);
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  const designFixesCssContent = `/* MetaMask Connector Styles */
.metamask-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  max-width: 500px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metamask-button, .connect-button, .disconnect-button {
  background-color: #f6851b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  text-decoration: none;
  display: inline-block;
}

.metamask-button:hover, .connect-button:hover {
  background-color: #e2761b;
}

.disconnect-button {
  background-color: #dc3545;
  font-size: 12px;
  padding: 5px 10px;
  margin-left: 10px;
}

.disconnect-button:hover {
  background-color: #c82333;
}

.status-message {
  margin: 10px 0;
  font-weight: bold;
}

.error-message {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.account-info {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

/* Header Layout Styles */
.metamask-header-container {
  display: flex;
  align-items: center;
}

.wallet-address {
  background-color: rgba(246, 133, 27, 0.1);
  color: #f6851b;
  padding: 8
