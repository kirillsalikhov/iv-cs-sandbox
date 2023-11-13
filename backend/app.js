const Koa = require('koa');

const port = 3050;

const app = new Koa()

app.use(async ctx => {
        ctx.body = `Page`;
    });

const server = app.listen(port, () => {
    console.log(`Ready to receive requests on ${port}`);
});

['SIGINT', 'SIGTERM'].forEach( (signal) => {
    process.on(signal, function() {
        console.log('Closing server');
        server.close(process.exit);
    });
});


