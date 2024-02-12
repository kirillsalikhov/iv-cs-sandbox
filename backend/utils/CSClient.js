const { DefaultApi } = require('cs-open-api');

const config = require('../config');

class CSClient {
    constructor(config) {
        this.client = new DefaultApi({
            basePath: config.host
        });
    }

    async createConversion(fileUrl, recipe, conversion_parameters = null, callback) {
        const { data } = await this.client.createJob({
            recipe,
            callback,
            // TODO remove when JSON.stringify is not needed
            conversion_parameters,
            input: fileUrl
        });

        return data;
    }

    async getResultZipUrl(jobId){
        const { data } = await this.client.jobZip(jobId, "iv");

        return data[0].url;
    }

    async getFirstResultFile(jobId) {
        const { data } = await this.client.jobFiles(jobId)
        return data[0].url;
    }

}

module.exports = new CSClient(config.conversion);
