exports.errors = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        if (e.name === 'NotFoundError') {
            ctx.status = 404;
        } else {
            ctx.status = 500;
            console.error(e.message, e.stack);
        }
    }
};

const createError = (message, name) => {
    const e = new Error(message);
    e.name = name;
    return e;
}

exports.createNotFoundError = (message) => createError(message, 'NotFoundError');


