const fs = require('fs');
const path = require("path");

const config = {
    vite: {
        devHost: process.env.VITE_DEV_HOST || '',
        manifest: {},
        entries: {
            main: 'src/main-page/index.tsx',
            viewer: 'src/viewer-page/index.tsx'
        }
    }
}


if (!config.vite.devHost) {
    const manifestPath = path.join(__dirname, 'static/dist/manifest.json');
    const manifestFile = fs.readFileSync(manifestPath);
    config.vite.manifest = JSON.parse(manifestFile)
}

module.exports = config;
