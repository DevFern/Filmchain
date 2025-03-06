// fix-babel-deps.js
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
    
    // Add devDependencies section if it doesn't exist
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    
    // Add the required Babel plugins to devDependencies
    const babelPlugins = {
      "@babel/plugin-proposal-private-property-in-object": "^7.21.0"
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
    
    // Save updated package.json
    if (changesCount > 0) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      log(`Updated package.json with ${changesCount} new dependencies`);
    } else {
      log('No changes needed in package.json');
    }
    
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
    log('build-fix.js not found, cannot update');
    return;
  }
  
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
}`;
    
    // Replace the existing updateBabelrc function
    buildFixContent = buildFixContent.replace(
      /function updateBabelrc\(\) {[\s\S]*?}/,
      babelrcUpdateFunction
    );
    
    // Update the fixPackageJson function to add the required Babel plugins
    const packageJsonFixFunction = `// Fix package.json by removing problematic dependencies
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
    
    // Add @babel/plugin-proposal-private-property-in-object to devDependencies
    if (!packageJson.devDependencies['@babel/plugin-proposal-private-property-in-object']) {
      packageJson.devDependencies['@babel/plugin-proposal-private-property-in-object'] = '^7.21.0';
      log('Added @babel/plugin-proposal-private-property-in-object to devDependencies');
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
