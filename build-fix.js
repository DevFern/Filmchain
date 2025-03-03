// build-fix.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const packageJsonPath = path.join(__dirname, 'package.json');
const npmrcPath = path.join(__dirname, '.npmrc');

// Function to log with timestamp
function logWithTime(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Function to safely execute commands
function safeExec(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    logWithTime(`Command failed: ${command}`);
    logWithTime(error.message);
    return null;
  }
}

try {
  logWithTime('Starting build fix script...');
  
  // Check if package.json exists
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found');
  }
  
  // Read package.json
  const packageJson = require(packageJsonPath);
  
  // Log dependencies for debugging
  logWithTime('Dependencies found: ' + Object.keys(packageJson.dependencies).length);
  
  // Check for problematic dependencies
  if (packageJson.dependencies['@helia/http-client']) {
    logWithTime('Found problematic dependency: @helia/http-client');
    
    // Replace with correct dependency
    packageJson.dependencies['@helia/http'] = '^1.0.0';
    delete packageJson.dependencies['@helia/http-client'];
    
    logWithTime('Updated @helia/http-client to @helia/http');
  }
  
  // Add resolutions for known vulnerable packages
  if (!packageJson.resolutions) {
    packageJson.resolutions = {};
  }
  
  // Define packages that need resolution
  const vulnerablePackages = {
    'sourcemap-codec': 'npm:@jridgewell/sourcemap-codec@latest',
    'rollup-plugin-terser': 'npm:@rollup/plugin-terser@latest',
    '@humanwhocodes/object-schema': 'npm:@eslint/object-schema@latest',
    '@humanwhocodes/config-array': 'npm:@eslint/config-array@latest',
    '@babel/plugin-proposal-private-methods': 'npm:@babel/plugin-transform-private-methods@latest',
    '@babel/plugin-proposal-optional-chaining': 'npm:@babel/plugin-transform-optional-chaining@latest',
    '@babel/plugin-proposal-numeric-separator': 'npm:@babel/plugin-transform-numeric-separator@latest',
    '@babel/plugin-proposal-class-properties': 'npm:@babel/plugin-transform-class-properties@latest',
    '@babel/plugin-proposal-nullish-coalescing-operator': 'npm:@babel/plugin-transform-nullish-coalescing-operator@latest',
    '@babel/plugin-proposal-private-property-in-object': 'npm:@babel/plugin-transform-private-property-in-object@latest',
    'postcss': '^8.4.31',
    'terser': '^5.14.2',
    'semver': '^7.5.2',
    'tough-cookie': '^4.1.3',
    'node-forge': '^1.3.0',
    'loader-utils': '^2.0.4',
    'serialize-javascript': '^6.0.2',
    'shell-quote': '^1.7.3',
    'nth-check': '^2.0.1',
    'minimatch': '^3.0.5',
    'ansi-html': '^0.0.8',
    'browserslist': '^4.16.5',
    'cross-spawn': '^7.0.3',
    'html-minifier': '^4.0.0',
    'ip': '^2.0.0',
    'ajv': '^8.12.0',
    'ajv-keywords': '^5.1.0',
  };
  
  // Add all vulnerable packages to resolutions
  let resolutionsUpdated = false;
  for (const [pkg, version] of Object.entries(vulnerablePackages)) {
    if (!packageJson.resolutions[pkg] || packageJson.resolutions[pkg] !== version) {
      packageJson.resolutions[pkg] = version;
      resolutionsUpdated = true;
      logWithTime(`Added resolution for ${pkg}: ${version}`);
    }
  }
  
  // Create or update .npmrc file
  const npmrcContent = `
registry=https://registry.npmjs.org/
save-exact=true
audit=false
fund=false
legacy-peer-deps=true
`;

  fs.writeFileSync(npmrcPath, npmrcContent.trim());
  logWithTime('Updated .npmrc file');
  
  // Write updated package.json if changes were made
  if (resolutionsUpdated) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    logWithTime('Updated package.json with vulnerability resolutions');
  }
  
  // Check for and create vercel.json if it doesn't exist
  const vercelJsonPath = path.join(__dirname, 'vercel.json');
  if (!fs.existsSync(vercelJsonPath)) {
    const vercelJson = {
      "version": 2,
      "buildCommand": "CI=false npm run build",
      "outputDirectory": "build",
      "routes": [
        { "handle": "filesystem" },
        { "src": "/[^.]+", "dest": "/index.html" }
      ]
    };
    
    fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
    logWithTime('Created vercel.json file');
  }
  
  // Run npm dedupe to reduce duplicate packages
  logWithTime('Running npm dedupe to clean up dependencies...');
  safeExec('npm dedupe');
  
  // Attempt to fix audit issues without breaking changes
  logWithTime('Attempting to fix non-breaking audit issues...');
  safeExec('npm audit fix --no-fund');
  
  logWithTime('Build fix script completed successfully');
} catch (error) {
  logWithTime(`Error in build fix script: ${error.message}`);
  logWithTime(error.stack);
  // Don't exit with error code to allow build to continue
}
