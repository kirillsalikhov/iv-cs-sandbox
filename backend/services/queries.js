const db = require('../db');
const {createNotFoundError} = require('../middlewares/errors');

const documentTable = 'documents';

exports.getAllDocuments = async () => {
    return db(documentTable).orderBy('id', 'desc');
}

exports.getDocument = async (id) => {
    const documents = await db(documentTable).where({id});

    if (documents.length === 0) {
        throw createNotFoundError(`Document with id: ${id} not found`);
    }
    return documents[0];
}
