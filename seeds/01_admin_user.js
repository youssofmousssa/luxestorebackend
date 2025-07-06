const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  await knex('orders').del();
  await knex('products').del();
  await knex('users').del();

  const hash = await bcrypt.hash('admin123', 10);
  await knex('users').insert([
    {
      email: 'admin@luxestore.com',
      password: hash,
      name: 'Admin',
      role: 'admin',
      banned: false
    }
  ]);
};
