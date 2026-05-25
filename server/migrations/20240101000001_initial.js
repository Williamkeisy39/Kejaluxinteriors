exports.up = async function (knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // ── users ──
    await knex.schema.createTable('users', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        t.string('fullname').notNullable();
        t.string('email').notNullable().unique();
        t.string('password').notNullable();
        t.integer('cart_total_items').defaultTo(0);
        t.decimal('cart_total_price', 14, 2).defaultTo(0);
        t.jsonb('cart_items').defaultTo('{}');   // { "<productId>": { quantity, color: {name,value} } }
        t.specificType('wishlist', 'text[]').defaultTo('{}');
        t.timestamps(true, true);
    });

    // ── products ──
    await knex.schema.createTable('products', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        t.string('product_name').notNullable();
        t.decimal('product_price', 14, 2).notNullable();
        t.string('category').notNullable();
        t.specificType('subcategory', 'text[]').defaultTo('{}');
        t.specificType('color', 'text[]').defaultTo('{}');
        t.specificType('color_value', 'text[]').defaultTo('{}');
        t.decimal('width', 8, 2).defaultTo(0);
        t.decimal('length', 8, 2).defaultTo(0);
        t.decimal('height', 8, 2).defaultTo(0);
        t.specificType('images', 'text[]').defaultTo('{}');
        t.text('description').defaultTo('');
        t.timestamps(true, true);
    });

    await knex.raw(`
        CREATE INDEX idx_products_category ON products (category);
        CREATE INDEX idx_products_created ON products (created_at);
    `);

    // ── orders ──
    await knex.schema.createTable('orders', (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        t.string('status').defaultTo('Pending');
        t.decimal('total_price', 14, 2).notNullable();
        t.string('phone');
        t.string('email');
        t.string('fullname');
        t.string('state');
        t.string('city');
        t.jsonb('items').defaultTo('[]');   // array of order-item objects
        t.timestamps(true, true);
    });

    await knex.raw('CREATE INDEX idx_orders_user ON orders (user_id)');

    // ── search index (inverted index) ──
    await knex.schema.createTable('search_index', (t) => {
        t.increments('id').primary();
        t.string('term').notNullable().unique();
        t.specificType('doc_ids', 'text[]').defaultTo('{}');
    });

    await knex.raw('CREATE INDEX idx_search_term ON search_index (term)');
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('search_index');
    await knex.schema.dropTableIfExists('orders');
    await knex.schema.dropTableIfExists('products');
    await knex.schema.dropTableIfExists('users');
};
