const { getAllDocuments, getDocument  } = require('../services/queries');

exports.index = async (ctx) => {
    ctx.body = await getAllDocuments();
}

exports.show = async (ctx) => {
    ctx.body = await getDocument(ctx.params.id);
}
