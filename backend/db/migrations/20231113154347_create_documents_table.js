/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('documents', function (table) {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.string('status', 255);
            table.uuid('source_file');
            table.uuid('view_file');
            table.timestamps();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable('documents');
};
