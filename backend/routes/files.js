const {v4: uuid} = require('uuid');
const S3Client = require('../utils/S3Client');

exports.createDirectUpload = async (ctx) => {
    ctx.body = await S3Client.signForDirectUpload(uuid())
}
