const { DefaultApi } = require('cs-open-api');
const FormData = require('form-data');
const config = require('../config');

class CSClient {
    constructor(config) {
        this.client = new DefaultApi({
            basePath: config.host,
            formDataCtor: FormData // needed for node < 18,
        });
    }

    async createConversion(fileUrl, recipe, callback) {
        const { data } = await this.client.createJob(recipe,fileUrl,callback);

        return data;
    }

    async getResultZipUrl(jobId){
        const { data } = await this.client.jobZip(jobId);

        return data[0].url;
    }
}

module.exports = new CSClient(config.conversion);
