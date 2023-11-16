const Minio = require('minio');

const config = require('../config');

const expireDownload = 5*60; // 5 min
const expireViewer = 5*60 // 5 min
const expireConversion = 5*60*60 // 5 hour

class S3Client {

    constructor(config) {
        this.client = new Minio.Client(config);
        this.bucket = config.bucket;
    }

    async uploadFile(key, localPath) {
        return this.client.fPutObject(this.bucket, key, localPath);
    }

    async signForConversion(key) {

    }

    async signForViewer(key) {
        return this.client.presignedGetObject(this.bucket, key, expireViewer);
    }

    async signForDownload(key, filename){
        return this.client.presignedGetObject(
            this.bucket,
            key,
            expireDownload,
            {'Response-Content-Disposition': `attachment; filename="${filename}"`});
    }

    async removeObjects(keys) {
        return this.client.removeObjects(this.bucket, keys);
    }


}

module.exports = new S3Client(config.minio);
