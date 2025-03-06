// fix-css-files.js
const fs = require('fs');
const path = require('path');

// Helper function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Function to recursively find all CSS files
function findCssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== 'build') {
      fileList = findCssFiles(filePath, fileList);
    } else if (path.extname(file) === '.css') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix CSS syntax issues
function fixCssFile(filePath) {
  log(`Checking CSS file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = false;
  
  // Fix common CSS syntax issues
  
  // 1. Fix unclosed comments
  if (content.includes('/*') && !content.includes('*/')) {
    content = content.replace(/\/\*([^*]|\*(?!\/))*$/, '');
    fixed = true;
    log(`Fixed unclosed comment in ${filePath}`);
  }
  
  // 2. Fix unescaped forward slashes in URLs
  content = content.replace(/url\(([^)]*\/\/[^)]*)\)/g, (match, url) => {
    if (!url.startsWith('"') && !url.startsWith("'")) {
      return `url("${url}")`;
    }
    return match;
  });
  
  // 3. Fix incomplete rules (like .cta-)
  content = content.replace(/\.[a-zA-Z0-9_-]+-([\s\r\n}])/g, (match, ending) => {
    log(`Fixed incomplete CSS selector in ${filePath}`);
    fixed = true;
    return `.placeholder${ending}`;
  });
  
  // 4. Fix missing closing braces
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  if (openBraces > closeBraces) {
    content = content + '\n}'.repeat(openBraces - closeBraces);
    fixed = true;
    log(`Fixed ${openBraces - closeBraces} missing closing braces in ${filePath}`);
  }
  
  // 5. Fix missing semicolons
  content = content.replace(/([a-zA-Z0-9%#)])\s*\n\s*([a-zA-Z-])/g, '$1;\n$2');
  
  // 6. Fix invalid calc() expressions
  content = content.replace(/calc\(([^)]+)\/([^)]+)\)/g, (match, a, b) => {
    return `calc(${a} / ${b})`;
  });
  
  // Write fixed content back to file
  if (fixed) {
    fs.writeFileSync(filePath, content);
    log(`Fixed and saved ${filePath}`);
  } else {
    log(`No issues found in ${filePath}`);
  }
}

// Main function
function fixCssFiles() {
  try {
    log('Starting CSS files fix...');
    
    // Find all CSS files
    const cssFiles = findCssFiles('src');
    log(`Found ${cssFiles.length} CSS files to check`);
    
    // Fix each file
    cssFiles.forEach(fixCssFile);
    
    // Create known good CSS files for critical components
    createKnownGoodCssFiles();
    
    log('CSS files fix completed successfully!');
  } catch (error) {
    log(`Error during CSS files fix: ${error.message}`);
    process.exit(1);
  }
}

// Function to create known good CSS files for critical components
function createKnownGoodCssFiles() {
  // App.css - Main application styles
  const appCssPath = path.join('src', 'App.css');
  const appCssContent = `/* App.css - Main application styles */
:root {
  --primary-color: #f6851b;
  --primary-hover: #e2761b;
  --background-dark: #121212;
  --background-light: #1e1e1e;
  --background-card: #2a2a2a;
  --text-light: #f5f5f5;
  --text-muted: #a0a0a0;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.2);
  --transition-normal: 0.3s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background-dark);
  color: var(--text-light);
  line-height: 1.6;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header styles */
header {
  background-color: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-normal);
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
}

.wallet-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color var(--transition-normal);
}

.wallet-btn:hover {
  background-color: var(--primary-hover);
}

/* Mobile menu */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.5rem;
  cursor: pointer;
}

/* Footer styles */
footer {
  background-color: var(--background-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px 0;
  margin-top: 60px;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.footer-column h3 {
  color: var(--primary-color);
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-normal);
}

.footer-link:hover {
  color: var(--text-light);
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.social-link {
  color: var(--text-muted);
  font-size: 1.2rem;
  transition: color var(--transition-normal);
}

.social-link:hover {
  color: var(--primary-color);
}

.footer-bottom {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Button styles */
.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color var(--transition-normal);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-light);
  border: 1px solid var(--text-light);
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color var(--transition-normal);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Responsive styles */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .nav-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background-color: var(--background-dark);
    flex-direction: column;
    padding: 20px;
    gap: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
}`;

  fs.writeFileSync(appCssPath, appCssContent);
  log(`Created/Updated ${appCssPath}`);

  // HomePage.css - Styles for the home page
  const homePageCssPath = path.join('src', 'pages', 'HomePage.css');
  const homePageCssContent = `.hero-section {
  padding: 80px 0;
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-dark) 100%);
  text-align: center;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #f6851b, #e2761b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  color: var(--text-light);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.wallet-section {
  padding: 60px 0;
  background-color: var(--background-dark);
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-light);
}

.section-header p {
  max-width: 700px;
  margin: 0 auto;
  color: var(--text-muted);
}

.wallet-container {
  display: flex;
  justify-content: center;
}

.features-section {
  padding: 80px 0;
  background-color: var(--background-light);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  background-color: var(--background-card);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 2.5rem;
  color: #f6851b;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  color: var(--text-light);
}

.feature-card p {
  color: var(--text-muted);
}

.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #f6851b 0%, #e2761b 100%);
  text-align: center;
  color: white;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-section p {
  max-width: 700px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-section .btn-primary {
  background-color: white;
  color: #f6851b;
}

.cta-section .btn-primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.cta-section .btn-secondary {
  border-color: white;
  color: white;
}

.cta-section .btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.placeholder-section {
  padding: 40px;
  margin: 40px 0;
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  text-align: center;
}

.placeholder-section h2 {
  font-size: 1.75rem;
  margin-bottom: 15px;
  color: var(--text-light);
}

.placeholder-section p {
  color: var(--text-muted);
  margin-bottom: 15px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0;
  }
  
  .hero-section h1 {
    font-size: 2.25rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .section-header h2 {
    font-size: 1.75rem;
  }
  
  .feature-card {
    padding: 20px;
  }
  
  .cta-section h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 40px 0;
  }
  
  .hero-section h1 {
    font-size: 1.75rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}`;

  // Create directory if it doesn't exist
  if (!fs.existsSync(path.dirname(homePageCssPath))) {
    fs.mkdirSync(path.dirname(homePageCssPath), { recursive: true });
  }
  
  fs.writeFileSync(homePageCssPath, homePageCssContent);
  log(`Created/Updated ${homePageCssPath}`);

  // MetaMaskConnector.css - Styles for the MetaMask connector component
  const metaMaskCssPath = path.join('src', 'components', 'MetaMaskConnector.css');
  const metaMaskCssContent = `.metamask-container {
  background-color: var(--background-card);
  border-radius: var(--border-radius-md);
  padding: 20px;
  margin: 20px 0;
  max-width: 500px;
  box-shadow: var(--shadow-sm);
}

.metamask-button {
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

.metamask-button:hover {
  background-color: #e2761b;
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
}`;

  // Create directory if it doesn't exist
  if (!fs.existsSync(path.dirname(metaMaskCssPath))) {
    fs.mkdirSync(path.dirname(metaMaskCssPath), { recursive: true });
  }
  
  fs.writeFileSync(metaMaskCssPath, metaMaskCssContent);
  log(`Created/Updated ${metaMaskCssPath}`);
}

// Run the fix
fixCssFiles();
