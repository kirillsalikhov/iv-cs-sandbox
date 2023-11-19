const { getAllDocuments, getDocument  } = require('../services/queries');
const { removeDocument, createConversion } = require('../services/commands');
const S3Client = require('../utils/S3Client');
const { createNotFoundError } = require('../middlewares/errors');

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

exports.remove = async (ctx) => {
    await removeDocument(ctx.params.id);
    ctx.status = 204;
}

exports.convert = async (ctx) => {
    // TODO validation
    // TODO validate extentsion
    // TODO validate requiredFields
    // TODO validate select

    const conversionParams = ctx.request.body;
    const { documentId, jobId } = await createConversion(conversionParams);

    console.log(`Conversion job ${jobId} for document ${documentId} created`);

    ctx.body = documentId;
}

exports.conversionComplete = async (ctx) => {
    console.log('--- CONVERSION ENDED ---');
    console.log(ctx.params.id, 'ID');
    console.log(ctx.request.body);
    ctx.status = 204;
}
