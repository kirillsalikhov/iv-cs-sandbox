const S3Client = require("../utils/S3Client");
const CSClient = require('../utils/CSClient');
const db = require('../db');
const config = require('../config');
const { getDocument } = require('./queries');

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

const createDocument = async (params) => {
    // TODO add validation
    // name, extension, source_file
    const data = await db(documentTable)
        .returning('id')
        .insert({
            name: params.name,
            source_file: params.source_file,
            status: "inProgress",
            created_at: Date.now(),
            updated_at: Date.now()
        });
    return data[0].id;
}

exports.createConversion = async ({fileKey, fileName, conversionType}) => {
    const documentId = await createDocument({name: fileName, source_file: fileKey});

    const fileUrl = await S3Client.signForConversion(fileKey);

    const completeHook = `${config.host}/api/documents/${documentId}/conversion-complete`;
    // TODO add validation on convertionType
    const job = await CSClient.createConversion(
        fileUrl,
        conversionType,
        completeHook);

    return {documentId, jobId: job.id};
}
