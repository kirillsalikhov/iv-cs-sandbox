const { layoutVars } = require('../utils/viewHelpers');
const { vite}= require('../config');
const S3Client = require('../utils/S3Client');
const { getAllDocuments, getDocument } = require('../services/queries');
const { createNotFoundError } = require('../middlewares/errors');

const entries = vite.entries;

exports.root = async (ctx) => {
    const documents = await getAllDocuments();
    const forBrowser = {documents};
    return ctx.render('layout', layoutVars({
        appEntry: entries.main,
        forBrowser
    }));
}

exports.viewer = async (ctx) => {
    const document = await getDocument(ctx.params.id);
    if (!document.view_file) {
        createNotFoundError(`View file not found for document with id: ${document.id}`)
    }
    const modelUrl = await S3Client.signForViewer(document.view_file);

    let attributesUrl = null;
    if (document.attributes_file) {
        attributesUrl = await S3Client.signForViewer(document.attributes_file);
    }

    return ctx.render('layout', layoutVars({
        appEntry: entries.viewer,
        forBrowser: {document, modelUrl, attributesUrl}
    }));
}
