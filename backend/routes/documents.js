const { getAllDocuments, getDocument  } = require('../services/queries');
const { removeDocument, createConversion, completeConversion, completeAttrsConversion} = require('../services/commands');
const S3Client = require('../utils/S3Client');
const { createNotFoundError } = require('../middlewares/errors');
const { validateConvert } = require('./_validation');
const { createdEvent, updatedEvent, deletedEvent } = require('../utils/channel');


exports.index = async (ctx) => {
    ctx.body = await getAllDocuments();
}

exports.show = async (ctx) => {
    ctx.body = await getDocument(ctx.params.id);
}

exports.sourceDownload = async (ctx) => {
    const document = await getDocument(ctx.params.id);
    if (document.source_file) {
        const downloadUrl =  await S3Client.signForDownload(document.source_file, document.name);
        ctx.redirect(downloadUrl);
    } else {
        throw createNotFoundError(`Source file not found for document with id: ${document.id}`);
    }
}

exports.attributesDownload = async (ctx) => {
    const document = await getDocument(ctx.params.id);
    if (document.source_file) {

        const downloadUrl =  await S3Client.signForDownload(
            document.attributes_file,
            document.name.replace('.ifc', '.json'));

        ctx.redirect(downloadUrl);
    } else {
        throw createNotFoundError(`Source file not found for document with id: ${document.id}`);
    }
}

exports.remove = async (ctx) => {
    const documentId = ctx.params.id;
    await removeDocument(documentId);
    deletedEvent(documentId)
    ctx.status = 204;
}

exports.convert = async (ctx) => {
    const conversionParams = ctx.request.body;
    validateConvert(conversionParams);

    const { documentId, ivJobId, attrsJobId } = await createConversion(conversionParams);

    console.log(`Conversion jobs (iv: ${ivJobId}, attrs: ${attrsJobId}) for document ${documentId} created`);

    createdEvent(documentId);

    ctx.body = documentId;
}

exports.conversionComplete = async (ctx) => {
    const documentId = ctx.params.id;
    try {
        await getDocument(documentId);
    } catch (e) {
        if (e.name === 'NotFoundError') {
            console.log(`Conversion is complete, but document ${documentId} has most likely already been deleted`);
            ctx.status = 204;
            return;
        } else {
            throw e;
        }
    }
    const {job_id, status} = ctx.request.body;
    await completeConversion(documentId, job_id, status);

    updatedEvent(documentId);

    ctx.status = 204;
}

exports.attrsConversionComplete = async (ctx) => {
    const documentId = ctx.params.id;
    try {
        await getDocument(documentId);
    } catch (e) {
        if (e.name === 'NotFoundError') {
            console.log(`Attributes Conversion is complete, but document ${documentId} has most likely already been deleted`);
            ctx.status = 204;
            return;
        } else {
            throw e;
        }
    }
    const {job_id, status} = ctx.request.body;

    await completeAttrsConversion(documentId, job_id, status);

    updatedEvent(documentId);

    ctx.status = 204;
}
