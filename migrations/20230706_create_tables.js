exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('name').notNullable();
      table.string('role').defaultTo('user');
      table.boolean('banned').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('products', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.decimal('price', 10, 2).notNullable();
      table.string('image');
      table.integer('stock').defaultTo(0);
      table.string('category');
      table.jsonb('variants');
      table.timestamps(true, true);
    })
    .createTable('orders', function(table) {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.jsonb('items').notNullable();
      table.decimal('total', 10, 2).notNullable();
      table.string('payment_intent_id');
      table.jsonb('shipping_address');
      table.string('status').defaultTo('Processing');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('orders')
    .dropTableIfExists('products')
    .dropTableIfExists('users');
};
