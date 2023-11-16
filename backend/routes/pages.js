const { layoutVars } = require('../utils/viewHelpers');
const {vite}= require('../config');

const entries = vite.entries;

exports.root = async (ctx) => {
    return ctx.render('layout', layoutVars({appEntry: entries.main}));
}

exports.viewer = async (ctx) => {
    return ctx.render('layout', layoutVars({appEntry: entries.viewer}));
}
