exports.up = async function (knex) {
    await knex.schema.createTable('banners', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        t.string('image_url').notNullable();
        t.integer('sort_order').defaultTo(0);
        t.timestamps(true, true);
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('banners');
};
