const path = require('path');
const {v4: uuid} = require('uuid');

const S3Client = require('../../utils/S3Client');

const seedFile = (name) => path.join(__dirname, '../seed-files', name);

const docsData = [
    {
        name: "Wellness center Sama.ifc",
        status: "finished",
        ifcFile: seedFile("Wellness center Sama.ifc"),
        zipFile: seedFile("Wellness center Sama.zip")
    },
    {
        name: "failed.ifc",
        status: "failed",
        ifcFile: seedFile("failed.ifc")
    },
    {
        name: "inProgress.ifc",
        status: "inProgress",
        ifcFile: seedFile("inProgress.ifc")
    },
]

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await Promise.all([
        knex('documents').del(),
        S3Client.removeAllObjects()
    ]);

    return Promise.all(docsData.map((data) => {
        const docPromisses = [];

        const doc = {
            name: data.name,
            status: data.status,
            created_at: Date.now(),
            updated_at: Date.now(),
        };

        if (data.ifcFile) {
            doc.source_file = uuid();
            docPromisses.push(
                S3Client.uploadFile(
                    doc.source_file,
                    data.ifcFile));
        }
        if (data.zipFile) {
            doc.view_file = uuid();
            docPromisses.push(
                S3Client.uploadFile(
                    doc.view_file,
                    data.zipFile));
        }

        docPromisses.push(knex('documents').insert(doc));
        return Promise.all(docPromisses);
    }));
};
