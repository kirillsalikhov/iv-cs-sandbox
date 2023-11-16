const fs = require('fs');
const path = require("path");

const config = {
    vite: {
        devHost: process.env.VITE_DEV_HOST || '',
        manifest: {}
    },
    minio: {
        endPoint: process.env.MINIO_HOST,
        accessKey: process.env.MINIO_ROOT_USER,
        secretKey: process.env.MINIO_ROOT_PASSWORD,
        port: 10000,
        useSSL: false,

        bucket: 'default-bucket'
    }
}

if (!config.vite.devHost) {
    const manifestPath = path.join(__dirname, 'static/dist/manifest.json');
    const manifestFile = fs.readFileSync(manifestPath);
    config.vite.manifest = JSON.parse(manifestFile)
}

module.exports = config;
