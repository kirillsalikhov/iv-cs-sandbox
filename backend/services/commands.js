const {v4: uuid} = require('uuid');

const S3Client = require("../utils/S3Client");
const CSClient = require('../utils/CSClient');
const db = require('../db');
const config = require('../config');
const { getDocument } = require('./queries');

const documentTable = 'documents';

exports.removeDocument = async (id) => {
    const document = await getDocument(id);
    const files = [document.source_file, document.view_file, document.attributes_file]
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
    const attrsCompleteHook =`${config.host}/api/documents/${documentId}/attrs-complete`;

    const [ivJob, attrsJob] = await Promise.all([
        CSClient.createConversion(
            fileUrl,
            conversionType,
            {serializer: "min"},
            completeHook),

        CSClient.createConversion(
            fileUrl,
            "ifc_attributes",
            {serializer: "erp"},
            attrsCompleteHook
        )
    ]);

    return {documentId, jobId: ivJob.id, attrsJobId: attrsJob.id};
}

exports.completeConversion = async (documentId, jobId, status ) => {
    if (status === "finished") {
        const view_file = uuid();
        const resultFileUrl = await CSClient.getResultZipUrl(jobId);
        await S3Client.uploadUrl(view_file, resultFileUrl);
        await updateDocument(documentId, {view_file});
        await _updateStatus(documentId, "finished");
    } else {
        await _updateStatus(documentId, "failed");
    }
}

exports.completeAttrsConversion = async (documentId, jobId, status) => {
    if (status === "finished") {
        const attributes_file = uuid();
        const resultFileUrl = await CSClient.getFirstResultFile(jobId);
        await S3Client.uploadUrl(attributes_file, resultFileUrl);
        await updateDocument(documentId, {attributes_file});
        await _updateStatus(documentId, "finished");
    } else {
        await _updateStatus(documentId, "failed");
    }

}

// We have TWO conversion Jobs and only one status
// this func sets finished only if two files exist and lastJobStatus = "finished
const _updateStatus = async (id, newJobStatus) => {
    // we reload document here to lower race mutation probability
    const document = await getDocument(id);
    const oldStatus = document.status

    // we do nothing if first conversion was already failed
    if (oldStatus === "failed") {
        return;
    }
    // we fail document if this job is failed
    if (newJobStatus === "failed") {
        await updateDocument(id, {status:"failed"});
    }

    // we use this condition to determine that both jobs finished
    // in prod better use explicit fields
    const allFileFieldsAreSet = document.view_file && document.attributes_file;
    if (newJobStatus === "finished" && allFileFieldsAreSet) {
        await updateDocument(id, {status:"finished"});
    }
}
