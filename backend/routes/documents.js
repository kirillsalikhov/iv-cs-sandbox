const { getAllDocuments, getDocument  } = require('../services/queries');
const { removeDocument } = require('../services/commands');

exports.index = async (ctx) => {
    ctx.body = await getAllDocuments();
}

exports.show = async (ctx) => {
    ctx.body = await getDocument(ctx.params.id);
}

exports.remove = async (ctx) => {
    await removeDocument(ctx.params.id);
    ctx.status = 204;
}
