exports.up = function(knex) {
  return knex.schema.createTable('coupons', function(table) {
    table.increments('id').primary();
    table.string('code').unique().notNullable();
    table.enu('type', ['percent', 'fixed']).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.boolean('active').defaultTo(true);
    table.integer('usage_limit').defaultTo(0); // 0 = unlimited
    table.integer('used_count').defaultTo(0);
    table.timestamp('expires_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('coupons');
};
