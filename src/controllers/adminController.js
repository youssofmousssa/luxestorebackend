const db = require('../db');

async function dashboardStats(req, res, next) {
  try {
    const [orders, users, products] = await Promise.all([
      db('orders').count('id').as('count'),
      db('users').count('id').as('count'),
      db('products').count('id').as('count')
    ]);
    const totalRevenue = await db('orders').sum('total').first();
    const recentOrders = await db('orders').orderBy('created_at', 'desc').limit(5);
    res.json({
      stats: {
        orders: Number(orders[0].count),
        users: Number(users[0].count),
        products: Number(products[0].count),
        totalRevenue: Number(totalRevenue.sum || 0),
        recentOrders
      }
    });
  } catch (err) { next(err); }
}

async function listUsers(req, res, next) {
  try {
    const users = await db('users').select('id', 'email', 'name', 'role', 'banned');
    res.json({ users });
  } catch (err) { next(err); }
}

async function banUser(req, res, next) {
  try {
    const { id } = req.params;
    const [user] = await db('users').where({ id }).update({ banned: true }).returning(['id', 'email', 'banned']);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) { next(err); }
}

async function getLowStock(req, res, next) {
  try {
    const threshold = Number(req.query.threshold) || 10;
    const products = await db('products').where('stock', '<', threshold).select('id', 'title', 'stock');
    res.json({ lowStock: products });
  } catch (err) { next(err); }
}

module.exports = { dashboardStats, listUsers, banUser, getLowStock };

