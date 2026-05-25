exports.up = async function (knex) {
    await knex.schema.alterTable('users', (t) => {
        t.string('oauth_provider').nullable();
        t.string('oauth_id').nullable();
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable('users', (t) => {
        t.dropColumn('oauth_provider');
        t.dropColumn('oauth_id');
    });
};
