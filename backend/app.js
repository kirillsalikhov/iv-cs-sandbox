const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const serve = require('koa-static');

const config = require('./config');
const router = require('./routes');
const { errors } = require('./middlewares/errors');

const port = 3050;

const app = new Koa()
    .use(errors)
    .use(bodyParser())
    .use(views(path.join(__dirname, '/views'), { extension: 'ejs' }))
    .use(router.routes());

if (!config.vite.devHost) {
    app.use(serve(path.join(__dirname, '/static/dist')));
}

const server = app.listen(port, () => {
    console.log(`Ready to receive requests on ${port}`);
});

['SIGINT', 'SIGTERM'].forEach( (signal) => {
    process.on(signal, function() {
        console.log('Closing server');
        server.close(process.exit);
    });
});


