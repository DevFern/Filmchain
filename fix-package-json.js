// fix-package-json.js
const fs = require('fs');
const path = require('path');

// Helper function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main function to fix package.json
function fixPackageJson() {
  try {
    log('Starting package.json fix...');

    // Create a valid package.json content
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
      },
      "resolutions": {
        "ajv": "^8.12.0",
        "ajv-keywords": "^5.1.0",
        "sourcemap-codec": "npm:@jridgewell/sourcemap-codec@latest",
        "rollup-plugin-terser": "npm:@rollup/plugin-terser@latest",
        "@humanwhocodes/object-schema": "npm:@eslint/object-schema@latest",
        "@humanwhocodes/config-array": "npm:@eslint/config-array@latest",
        "@babel/plugin-proposal-private-methods": "npm:@babel/plugin-transform-private-methods@latest",
        "@babel/plugin-proposal-optional-chaining": "npm:@babel/plugin-transform-optional-chaining@latest",
        "@babel/plugin-proposal-numeric-separator": "npm:@babel/plugin-transform-numeric-separator@latest",
        "@babel/plugin-proposal-class-properties": "npm:@babel/plugin-transform-class-properties@latest",
        "@babel/plugin-proposal-nullish-coalescing-operator": "npm:@babel/plugin-transform-nullish-coalescing-operator@latest",
        "@babel/plugin-proposal-private-property-in-object": "npm:@babel/plugin-transform-private-property-in-object@latest",
        "postcss": "^8.4.31",
        "terser": "^5.14.2",
        "semver": "^7.5.2",
        "tough-cookie": "^4.1.3",
        "node-forge": "^1.3.0",
        "loader-utils": "^2.0.4",
        "serialize-javascript": "^6.0.2",
        "shell-quote": "^1.7.3",
        "nth-check": "^2.0.1",
        "minimatch": "^3.0.5",
        "ansi-html": "^0.0.8",
        "browserslist": "^4.16.5",
        "cross-spawn": "^7.0.3",
        "html-minifier": "^4.0.0",
        "ip": "^2.0.0"
      }
    };

    // Write the fixed package.json
    fs.writeFileSync('package.json', JSON.stringify(validPackageJson, null, 2));
    log('Fixed package.json file');

    // Also update the build-fix.js file to include the Babel plugin fix
    updateBuildFixScript();

    log('Package.json fix completed successfully!');
  } catch (error) {
    log(`Error during package.json fix: ${error.message}`);
    process.exit(1);
  }
}

// Function to update the build-fix.js script
function updateBuildFixScript() {
  try {
    // Read the existing build-fix.js file
    const buildFixContent = fs.readFileSync('build-fix.js', 'utf8');
    
    // Update the updateBabelrc function to include the correct plugins
    const updatedBuildFixContent = buildFixContent.replace(
      `function updateBabelrc() {
  const babelrcPath = path.join(__dirname, '.babelrc');
  const babelrcContent = {
    "presets": ["@babel/preset-env", "@babel/preset-react"],
    "plugins": ["@babel/plugin-proposal-private-property-in-object"]
  };
  
  fs.writeFileSync(babelrcPath, JSON.stringify(babelrcContent, null, 2));
  log('Created/Updated .babelrc file');
}`,
      `function updateBabelrc() {
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
}`
    );
    
    // Update the fixPackageJson function to add the required Babel plugins
    const updatedFixPackageJson = updatedBuildFixContent.replace(
      `function fixPackageJson() {
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
    
    // Save changes
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}`,
      `function fixPackageJson() {
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
    
    // Add @babel/plugin-proposal-private-property-in-object to devDependencies
    if (!packageJson.devDependencies['@babel/plugin-proposal-private-property-in-object']) {
      packageJson.devDependencies['@babel/plugin-proposal-private-property-in-object'] = '^7.21.0';
      log('Added @babel/plugin-proposal-private-property-in-object to devDependencies');
    }
    
    // Save changes
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}`
    );
    
    // Write the updated build-fix.js file
    fs.writeFileSync('build-fix.js', updatedFixPackageJson);
    log('Updated build-fix.js to include Babel plugin fixes');
  } catch (error) {
    log(`Error updating build-fix.js: ${error.message}`);
  }
}

// Run the fix
fixPackageJson();
