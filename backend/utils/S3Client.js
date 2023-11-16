const Minio = require('minio');

const config = require('../config');

class S3Client {

    constructor(config) {
        this.client = new Minio.Client(config);
        this.bucket = config.bucket;
    }

    async uploadFile(key, localPath) {
        return this.client.fPutObject(this.bucket, key, localPath);
    }
}

module.exports =  new S3Client(config.minio);
