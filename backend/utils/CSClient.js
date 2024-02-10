const { DefaultApi } = require('cs-open-api');
// TODO remove
const FormData = require('form-data');
const config = require('../config');

class CSClient {
    constructor(config) {
        this.client = new DefaultApi({
            basePath: config.host
        });
    }

    async createConversion(fileUrl, recipe, callback) {
        const { data } = await this.client.createJob(recipe,fileUrl,null, callback);

        return data;
    }

    async getResultZipUrl(jobId){
        const { data } = await this.client.jobZip(jobId);

        return data[0].url;
    }
}

module.exports = new CSClient(config.conversion);
