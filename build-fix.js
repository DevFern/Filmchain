// build-fix.js
const fs = require('fs');
const path = require('path');

// Check if package.json exists
try {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = require(packageJsonPath);
  
  // Log dependencies for debugging
  console.log('Dependencies:', Object.keys(packageJson.dependencies));
  
  // Check for problematic dependencies
  if (packageJson.dependencies['@helia/http-client']) {
    console.log('Found problematic dependency: @helia/http-client');
    
    // Replace with correct dependency
    packageJson.dependencies['@helia/http'] = '^1.0.0';
    delete packageJson.dependencies['@helia/http-client'];
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json with correct dependency');
  }
  
  console.log('Build fix script completed successfully');
} catch (error) {
  console.error('Error in build fix script:', error);
}
