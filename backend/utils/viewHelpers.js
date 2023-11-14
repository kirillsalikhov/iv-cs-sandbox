const config = require('../config');

exports.layoutVars = (vars= {}) => {
    const global = {
        vite: config.vite
    }

    return {...global,...vars};
}
