const { DefaultApi } = require('cs-open-api');

const config = require('../config');

class CSClient {
    constructor(config) {
        this.client = new DefaultApi({
            basePath: config.host
        });
    }

    async createConversion(fileUrl, recipe, conversion_parameters, callback) {
        const { data } = await this.client.createJob({
            recipe,
            callback,
            // TODO remove when JSON.stringify is not needed
            conversion_parameters: conversion_parameters ? JSON.stringify(conversion_parameters) : null,
            input: fileUrl
        });

        return data;
    }

    async getResultZipUrl(jobId){
        // TODO add filter iv
        const { data } = await this.client.jobZip(jobId);

        return data[0].url;
    }
}

module.exports = new CSClient(config.conversion);
