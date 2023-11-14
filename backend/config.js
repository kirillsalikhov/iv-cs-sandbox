const fs = require('fs');
const path = require("path");

const config = {
    vite: {
        devHost: process.env.VITE_DEV_HOST || '',
        manifest: {}
    }
}

if (!config.vite.devHost) {
    const manifestPath = path.join(__dirname, 'static/dist/manifest.json');
    const manifestFile = fs.readFileSync(manifestPath);
    config.vite.manifest = JSON.parse(manifestFile)
}

module.exports = config;
