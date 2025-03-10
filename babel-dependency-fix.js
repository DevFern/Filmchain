// babel-dependency-fix.js
const fs = require('fs');
const path = require('path');

// Helper function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main function to fix Babel dependencies
function fixBabelDependencies() {
  try {
    log('Starting Babel dependencies fix...');

    // Read package.json
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add the missing dependency to devDependencies
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    
    // Add the required Babel plugins to devDependencies
    const babelPlugins = {
      "@babel/plugin-proposal-private-property-in-object": "^7.21.0",
      "@babel/plugin-transform-private-property-in-object": "^7.21.0",
      "@babel/plugin-transform-private-methods": "^7.22.5",
      "@babel/plugin-transform-class-properties": "^7.22.5",
      "@babel/plugin-transform-nullish-coalescing-operator": "^7.22.5",
      "@babel/plugin-transform-optional-chaining": "^7.22.5",
      "@babel/plugin-transform-numeric-separator": "^7.22.5"
    };
    
    let changesCount = 0;
    
    // Add each plugin if it doesn't exist
    for (const [plugin, version] of Object.entries(babelPlugins)) {
      if (!packageJson.devDependencies[plugin]) {
        packageJson.devDependencies[plugin] = version;
        log(`Added ${plugin}@${version} to devDependencies`);
        changesCount++;
      }
    }
    
    // Update .babelrc file
    const babelrcPath = path.join(__dirname, '.babelrc');
    const babelrcContent = {
      "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
      ],
      "plugins": [
        "@babel/plugin-transform-private-property-in-object",
        "@babel/plugin-transform-private-methods",
        "@babel/plugin-transform-class-properties",
        "@babel/plugin-transform-nullish-coalescing-operator",
        "@babel/plugin-transform-optional-chaining",
        "@babel/plugin-transform-numeric-separator"
      ]
    };
    
    fs.writeFileSync(babelrcPath, JSON.stringify(babelrcContent, null, 2));
    log('Updated .babelrc file with correct plugin names');
    
    // Save updated package.json
    if (changesCount > 0) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      log(`Updated package.json with ${changesCount} new dependencies`);
    } else {
      log('No changes needed in package.json');
    }
    
    // Create a .npmrc file to ensure legacy peer deps are used
    const npmrcPath = path.join(__dirname, '.npmrc');
    const npmrcContent = 'legacy-peer-deps=true\nsave-exact=true\naudit=false\nfund=false';
    fs.writeFileSync(npmrcPath, npmrcContent);
    log('Created/Updated .npmrc file');
    
    // Update build-fix.js to include the Babel plugin fix
    updateBuildFixScript();
    
    log('Babel dependencies fix completed successfully!');
    log('Run "npm install" to install the new dependencies, then "npm run build" to build the project.');
  } catch (error) {
    log(`Error during Babel dependencies fix: ${error.message}`);
    process.exit(1);
  }
}

// Function to update the build-fix.js script
function updateBuildFixScript() {
  const buildFixPath = path.join(__dirname, 'build-fix.js');
  
  if (!fs.existsSync(buildFixPath)) {
    log('build-fix.js not found, creating new file');
    
    const buildFixContent = `const fs = require('fs');
const path = require('path');

// Log with timestamp
function log(message) {
  console.log(\`[\${new Date().toISOString()}] \${message}\`);
}

// Main function
async function runBuildFix() {
  log('Starting build fix script...');

  try {
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
    log(\`Error in build fix script: \${error.message}\`);
    process.exit(1);
  }
}

// Fix package.json by removing problematic dependencies and adding required ones
function fixPackageJson() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Count dependencies before changes
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    log(\`Dependencies found: \${depCount}\`);
    
    // Remove problematic dependencies
    if (packageJson.dependencies && packageJson.dependencies['@helia/http']) {
      delete packageJson.dependencies['@helia/http'];
      log('Removed @helia/http dependency');
    }
    
    // Add required Babel plugins to devDependencies
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    
    const babelPlugins = {
      "@babel/plugin-proposal-private-property-in-object": "^7.21.0",
      "@babel/plugin-transform-private-property-in-object": "^7.21.0",
      "@babel/plugin-transform-private-methods": "^7.22.5",
      "@babel/plugin-transform-class-properties": "^7.22.5",
      "@babel/plugin-transform-nullish-coalescing-operator": "^7.22.5",
      "@babel/plugin-transform-optional-chaining": "^7.22.5",
      "@babel/plugin-transform-numeric-separator": "^7.22.5"
    };
    
    for (const [plugin, version] of Object.entries(babelPlugins)) {
      if (!packageJson.devDependencies[plugin]) {
        packageJson.devDependencies[plugin] = version;
        log(\`Added \${plugin} to devDependencies\`);
      }
    }
    
    // Save changes
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}

// Update .npmrc file
function updateNpmrc() {
  const npmrcPath = path.join(__dirname, '.npmrc');
  const npmrcContent = 'legacy-peer-deps=true\\nnode-linker=hoisted\\nsave-exact=true\\naudit=false\\nfund=false';
  
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
  
  // Only replace if the file exists
  if (fs.existsSync(indieFundSectionPath)) {
    // Create a known working version of IndieFundSection.js
    const indieFundSectionContent = \`import React from 'react';
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

export default IndieFundSection;\`;

    // Create CSS for IndieFundSection
    const indieFundCssContent = \`.indie-fund-section {
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
}\`;

    fs.writeFileSync(indieFundSectionPath, indieFundSectionContent);
    fs.writeFileSync(indieFundCssPath, indieFundCssContent);
    log('Replaced IndieFundSection.js with a known working version');
    log('Created IndieFundSection.css file');
  }
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
  const walletContextContent = \`import React, { createContext, useState, useEffect, useContext } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
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
          })
          .catch(err => {
            console.error('Error checking accounts:', err);
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
        error,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;\`;

  fs.writeFileSync(walletContextPath, walletContextContent);
  log('Completely replaced WalletContext.js with a simplified version');
}

// Run the script
runBuildFix();`;
    
    fs.writeFileSync(buildFixPath, buildFixContent);
    return;
  }
  
  // If build-fix.js exists, update it to include Babel plugin fixes
  let buildFixContent = fs.readFileSync(buildFixPath, 'utf8');
  
  // Check if the file already has the Babel plugin fix
  if (!buildFixContent.includes('@babel/plugin-proposal-private-property-in-object')) {
    // Update the updateBabelrc function to include the correct plugins
    const babelrcUpdateFunction = `// Create or update .babelrc
function updateBabelrc() {
  const babelrcPath = path.join(__dirname, '.babelrc');
  const babelrcContent = {
    "presets": ["@babel/preset-env", "@babel/preset-react"],
    "plugins": [
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
}`;
    
    // Replace the existing updateBabelrc function
    buildFixContent = buildFixContent.replace(
      /function updateBabelrc\(\) {[\s\S]*?}/,
      babelrcUpdateFunction
    );
    
    // Update the fixPackageJson function to add the required Babel plugins
    const packageJsonFixFunction = `// Fix package.json by removing problematic dependencies and adding required ones
function fixPackageJson() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Count dependencies before changes
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    log(\`Dependencies found: \${depCount}\`);
    
    // Remove problematic dependencies
    if (packageJson.dependencies && packageJson.dependencies['@helia/http']) {
      delete packageJson.dependencies['@helia/http'];
      log('Removed @helia/http dependency');
    }
    
    // Add required Babel plugins to devDependencies
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    
    const babelPlugins = {
      "@babel/plugin-proposal-private-property-in-object": "^7.21.0",
      "@babel/plugin-transform-private-property-in-object": "^7.21.0",
      "@babel/plugin-transform-private-methods": "^7.22.5",
      "@babel/plugin-transform-class-properties": "^7.22.5",
      "@babel/plugin-transform-nullish-coalescing-operator": "^7.22.5",
      "@babel/plugin-transform-optional-chaining": "^7.22.5",
      "@babel/plugin-transform-numeric-separator": "^7.22.5"
    };
    
    for (const [plugin, version] of Object.entries(babelPlugins)) {
      if (!packageJson.devDependencies[plugin]) {
        packageJson.devDependencies[plugin] = version;
        log(\`Added \${plugin} to devDependencies\`);
      }
    }
    
    // Save changes
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}`;
    
    // Replace the existing fixPackageJson function
    buildFixContent = buildFixContent.replace(
      /function fixPackageJson\(\) {[\s\S]*?}/,
      packageJsonFixFunction
    );
    
    fs.writeFileSync(buildFixPath, buildFixContent);
    log('Updated build-fix.js to include Babel plugin fixes');
  } else {
    log('build-fix.js already includes Babel plugin fixes');
  }
}

// Run the fix
fixBabelDependencies();
