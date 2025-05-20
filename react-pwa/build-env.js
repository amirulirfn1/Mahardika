/**
 * This script ensures environment variables are properly set during the build process.
 * It creates a configuration script that will be included in the HTML.
 */
const fs = require('fs');
const path = require('path');

// Firebase Environment Variables needed for initialization
const firebaseEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
  'REACT_APP_FIREBASE_MEASUREMENT_ID'
];

// Create a configuration object with all the environment variables
const envConfig = firebaseEnvVars.reduce((config, varName) => {
  config[varName] = process.env[varName] || '';
  return config;
}, {});

// Create the JavaScript content that will be injected into the HTML
const jsContent = `
window.ENV = ${JSON.stringify(envConfig, null, 2)};
`;

// Define the output directory and file
const outputDir = path.join(__dirname, 'public');
const outputFile = path.join(outputDir, 'env-config.js');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the configuration to a file
fs.writeFileSync(outputFile, jsContent);
console.log(`Environment configuration written to ${outputFile}`);
