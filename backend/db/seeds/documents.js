const path = require('path');
const {v4: uuid} = require('uuid');

const S3Client = require('../../utils/S3Client');

const seedFile = (name) => path.join(__dirname, '../seed-files', name);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('documents').del();

    const docsData = [
        {
            name: "Wellness center Sama.ifc",
            status: "finished",
            ifcFile: "Wellness center Sama.ifc",
            zipFile: "Wellness center Sama.zip"
        },
        {
            name: "failed.ifc",
            status: "failed",
            ifcFile: "failed.ifc"
        },
        {
            name: "inProgress.ifc",
            status: "inProgress",
            ifcFile: "inProgress.ifc"
        },
    ]

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
                    seedFile(data.ifcFile)));
        }
        if (data.zipFile) {
            doc.view_file = uuid();
            docPromisses.push(
                S3Client.uploadFile(
                    doc.view_file,
                    seedFile(data.zipFile)));
        }

        docPromisses.push(knex('documents').insert(doc));
        return Promise.all(docPromisses);
    }));
};
