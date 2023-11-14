const { layoutVars } = require('../utils/viewHelpers');

exports.root = async (ctx) => {
    return ctx.render('layout', layoutVars({appEntry: 'src/index.tsx'}));
}
