const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const router = require('./routes');

const port = 3050;

const app = new Koa()
    .use(bodyParser())
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


