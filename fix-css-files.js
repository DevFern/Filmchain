// fix-css-files.js
const fs = require('fs');
const path = require('path');

// Helper function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main function to fix CSS files
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
      
      // Look for unescaped forward slashes in problematic contexts
      const fixedContent = content
        // Fix unescaped slashes in comments
        .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, comment => {
          return comment.replace(/\//g, '\\/');
        })
        // Fix unescaped slashes in URLs
        .replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, url) => {
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
    process.exit(1);
  }
}

// Function to find all CSS files in a directory recursively
function findCssFiles(dir, fileList = []) {
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

// Update App.css with known good content
function updateAppCss() {
  const appCssPath = 'src/App.css';
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
  const homePageCssPath = 'src/pages/HomePage.css';
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
  const metaMaskConnectorCssPath = 'src/components/MetaMaskConnector.css';
  const metaMaskConnectorCssContent = `/* MetaMask Connector Styles */
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
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.wallet-error-tooltip {
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

/* Home page specific styles */
.wallet-section-large {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 30px;
  margin: 30px 0;
  text-align: center;
}`;

  fs.writeFileSync(metaMaskConnectorCssPath, metaMaskConnectorCssContent);
  log('Created/Updated src/components/MetaMaskConnector.css');
}

// Run the fix
console.log('Fixing CSS files...');
fixCssFiles();
