const Router = require('koa-router');
const { createSession } = require('better-sse');

const pages = require('./pages');
const documents = require('./documents');
const files = require('./files');

const { documentChannel } = require('../utils/channel');

const router = new Router();

router.get('/', pages.root);
router.get('/:id/viewer', pages.viewer);

router.get('/sse', async (ctx, next) => {
    ctx.respond = false;

    const session = await createSession(ctx.req, ctx.res);
    documentChannel.register(session);

    return next();
});

const apiRouter = new Router({
    prefix: '/api'
})
    // documents
    .get('/documents', documents.index)
    .get('/documents/:id', documents.show)
    .get('/documents/:id/source', documents.sourceDownload)
    .get('/documents/:id/attributes', documents.attributesDownload)
    .post('/documents/convert', documents.convert)
    .post('/documents/:id/conversion-complete', documents.conversionComplete)
    .post('/documents/:id/attrs-complete', documents.attrsConversionComplete)
    .delete('/documents/:id', documents.remove)
    // files
    .post('/files/create-upload', files.createDirectUpload);

router.use(apiRouter.routes());


module.exports = router;
