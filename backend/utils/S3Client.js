const Minio = require('minio');
const axios = require('axios');

const config = require('../config');

const expireDirectUpload = 5*60 // 5 min

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

    async uploadUrl(key, url) {
        const response = await axios({method: 'get', url, responseType: 'stream'});
        return await this.client.putObject(this.bucket, key, response.data);
    }

    async signForDirectUpload(key) {
        return this.client.presignedPutObject(this.bucket, key, expireDirectUpload);
    }

    async signForConversion(key) {
        return this.client.presignedGetObject(this.bucket, key, expireConversion);
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

    async removeAllObjects() {

        const objectKeys = await new Promise((resolve, reject) => {
            const keys = [];
            const stream = this.client.listObjects(this.bucket, '');

            stream.on('data', obj => keys.push(obj.name));
            stream.on('error', reject);
            stream.on('end', () => {
                resolve(keys);
            });
        });
        return this.removeObjects(objectKeys);
    }
}

module.exports = new S3Client(config.minio);
