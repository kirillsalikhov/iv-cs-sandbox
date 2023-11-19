const axios = require('axios');

const config = require('../config');

class CSClient {
    constructor(config) {
        this.client = axios.create({
            baseURL: config.host
        });
    }

    async createConversion(fileUrl, recipe, callback) {
        const { data } = await this.client.post('/jobs',{
            input: fileUrl,
            recipe,
            callback
        })
        return data;
    }
}

module.exports = new CSClient(config.conversion);
