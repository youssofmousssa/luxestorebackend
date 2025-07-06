const db = require('../db');

// Admin: Create a new coupon
async function createCoupon(req, res, next) {
  try {
    const { code, type, amount, usage_limit, expires_at } = req.body;
    if (!code || !type || !amount) return res.status(400).json({ error: 'Missing fields' });
    const [coupon] = await db('coupons').insert({ code, type, amount, usage_limit, expires_at }).returning('*');
    res.status(201).json({ coupon });
  } catch (err) { next(err); }
}

// Admin: List all coupons
async function listCoupons(req, res, next) {
  try {
    const coupons = await db('coupons').orderBy('created_at', 'desc');
    res.json({ coupons });
  } catch (err) { next(err); }
}

// Admin: Update a coupon
async function updateCoupon(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;
    const [coupon] = await db('coupons').where({ id }).update(fields).returning('*');
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ coupon });
  } catch (err) { next(err); }
}

// Admin: Delete a coupon
async function deleteCoupon(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await db('coupons').where({ id }).del();
    if (!deleted) return res.status(404).json({ error: 'Coupon not found' });
    res.status(204).end();
  } catch (err) { next(err); }
}

// User: Apply coupon (validate and return discount)
async function applyCoupon(req, res, next) {
  try {
    const { code, cartTotal } = req.body;
    if (!code || typeof cartTotal !== 'number') return res.status(400).json({ error: 'Missing fields' });
    const coupon = await db('coupons').where({ code, active: true }).first();
    if (!coupon) return res.status(404).json({ error: 'Coupon not found or inactive' });
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return res.status(400).json({ error: 'Coupon usage limit reached' });
    if (coupon.expires_at && new Date() > new Date(coupon.expires_at)) return res.status(400).json({ error: 'Coupon expired' });
    let discount = 0;
    if (coupon.type === 'percent') {
      discount = Math.round(cartTotal * (coupon.amount / 100));
    } else {
      discount = Math.round(coupon.amount);
    }
    res.json({ valid: true, discount, coupon });
  } catch (err) { next(err); }
}

module.exports = {
  createCoupon,
  listCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon
};
