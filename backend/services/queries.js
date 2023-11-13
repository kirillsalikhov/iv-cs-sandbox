const db = require('../db');

const documentTable = 'documents';

module.exports = {
    getAllDocuments: async () => {
        return db(documentTable);
    },
    getDocument: async (id) => {
        return db(documentTable).where({id});
    }
}
