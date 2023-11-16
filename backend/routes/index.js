const Router = require('koa-router');
const pages = require('./pages');
const documents = require('./documents');

const router = new Router();

router.get('/', pages.root);
router.get('/:id/viewer', pages.viewer);

const apiRouter = new Router({
    prefix: '/api'
})
    .get('/documents', documents.index)
    .get('/documents/:id', documents.show)
    .delete('/documents/:id', documents.remove);


router.use(apiRouter.routes());


module.exports = router;
