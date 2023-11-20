

exports.errors = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        if (e.name === 'NotFoundError') {
            ctx.status = 404;
        }
        else if (e.name === 'ValidationError') {
            ctx.body = validationSerializer(e);
            ctx.status = 422;
        }
        else {
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

function validationSerializer(e) {
    const detailSerializer = (d) => { return {
        key: d.path.join('/'),
        message: d.message
    }};

    return {
        errors: e.details.map(detailSerializer)
    }
}

exports.createNotFoundError = (message) => createError(message, 'NotFoundError');


