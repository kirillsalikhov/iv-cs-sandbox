const { createChannel } = require("better-sse");

const documentChannel = createChannel();

const evtSender = (name) => (id) => documentChannel.broadcast({id}, name);

exports.createdEvent = evtSender('document_created');
exports.updatedEvent = evtSender('document_update');
exports.deletedEvent = evtSender('document_delete');

exports.documentChannel = documentChannel;
