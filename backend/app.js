const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');

const router = require('./routes');
const viteDevAssets = require('./middlewares/vite-dev-assets');

const port = 3050;

const app = new Koa()
    .use(bodyParser())
    .use(views(path.join(__dirname, '/views'), { extension: 'ejs' }))
    .use(router.routes());


const server = app.listen(port, () => {
    console.log(`Ready to receive requests on ${port}`);
});

['SIGINT', 'SIGTERM'].forEach( (signal) => {
    process.on(signal, function() {
        console.log('Closing server');
        server.close(process.exit);
    });
});


