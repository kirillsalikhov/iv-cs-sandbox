/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('documents').del();
  // TODO add oss files
  // TODO updated, created
  await knex('documents').insert([
    {id: 1, name: "file-1.ifc", status: "finished"},
    {id: 2, name: "file-2.ifc", status: "finished"},
    {id: 3, name: "file-3-failed.ifc", status: "failed"},
    {id: 4, name: "file-4.ifc", status: "inProgress"},
  ]);
};
