exports.up = async function (knex) {
    await knex.schema.createTable('settings', (t) => {
        t.string('key').primary();
        t.jsonb('value').notNullable().defaultTo('{}');
        t.timestamps(true, true);
    });

    // Seed default hero settings
    await knex('settings').insert({
        key: 'hero',
        value: JSON.stringify({
            badge: "Kenya's Finest Furniture",
            headline: "Elevate Every Room with Kejalux",
            subtitle: "Interior decor, business furniture, and outdoor pallet pieces — handcrafted for comfort, built to last.",
            ctaPrimary: "Explore Collection",
            ctaSecondary: "Get a Quote",
            features: ["Free Delivery in Nairobi", "6-Month Warranty", "Custom Orders"]
        })
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('settings');
};
