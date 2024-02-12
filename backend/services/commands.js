const {v4: uuid} = require('uuid');

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

const updateDocument = async (id, params) => {
    return db(documentTable)
        .where({ id })
        .update({...params, ...{updated_at: Date.now()}});
}

exports.createConversion = async ({fileKey, fileName, conversionType}) => {
    const documentId = await createDocument({name: fileName, source_file: fileKey});

    const fileUrl = await S3Client.signForConversion(fileKey);

    const completeHook = `${config.host}/api/documents/${documentId}/conversion-complete`;
    const [ivJob, attrsJob] = await Promise.all([
        CSClient.createConversion(
            fileUrl,
            conversionType,
            {serializer: "min"},
            completeHook),
        // TODO hook
        CSClient.createConversion(
            fileUrl,
            "ifc_attributes",
            {serializer: "erp"},
        )
    ]);

    return {documentId, jobId: ivJob.id, attrsJobId: attrsJob.id};
}

exports.completeConversion = async (documentId, jobId, status ) => {
    if (status === "finished") {
        const view_file = uuid();
        const resultFileUrl = await CSClient.getResultZipUrl(jobId);
        await S3Client.uploadUrl(view_file, resultFileUrl);
        await updateDocument(documentId, {view_file, status:"finished"});
    } else {
        await updateDocument(documentId, {status:"failed"});
    }
}
