const fs = require('fs');
require('dotenv').config();

const config = {
    API_URL: process.env.API_URL || '',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
    FIREBASE: {
        apiKey: process.env.FIREBASE_API_KEY || '',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.FIREBASE_PROJECT_ID || ''
    }
};

const fileContent = `window.APP_CONFIG = ${JSON.stringify(config, null, 2)};`;
fs.writeFileSync('./frontend/js/config.js', fileContent);

console.log('Config file generated successfully');