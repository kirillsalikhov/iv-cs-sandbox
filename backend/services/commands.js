const S3Client = require("../utils/S3Client");
const db = require('../db');
const {getDocument} = require('./queries');

const documentTable = 'documents';

exports.removeDocument = async (id) => {
    const document = await getDocument(id);
    const files = [document.source_file, document.view_file]
        .filter(Boolean);

    if (files) {
        await S3Client.removeObjects(files);
    }

    return db(documentTable).where({id}).del();
}
