const Router = require('koa-router');
const pages = require('./pages');
const documents = require('./documents');
const files = require('./files');

const router = new Router();

router.get('/', pages.root);
router.get('/:id/viewer', pages.viewer);

const apiRouter = new Router({
    prefix: '/api'
})
    // documents
    .get('/documents', documents.index)
    .get('/documents/:id', documents.show)
    .get('/documents/:id/source', documents.sourceDownload)
    .post('/documents/convert', documents.convert)
    .post('/documents/:id/conversion-complete', documents.conversionComplete)
    .delete('/documents/:id', documents.remove)
    // files
    .post('/files/create-upload', files.createDirectUpload);

router.use(apiRouter.routes());


module.exports = router;
