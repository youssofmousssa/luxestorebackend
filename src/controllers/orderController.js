const db = require('../db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createOrder(req, res, next) {
  try {
    const { items, total, paymentIntentId, shippingAddress, couponCode } = req.body;
    if (!items || !total || !paymentIntentId) return res.status(400).json({ error: 'Missing fields' });
    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent || paymentIntent.status !== 'succeeded') return res.status(400).json({ error: 'Payment not completed' });

    // Coupon logic
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await db('coupons').where({ code: couponCode, active: true }).first();
      if (!coupon) return res.status(400).json({ error: 'Invalid coupon' });
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return res.status(400).json({ error: 'Coupon usage limit reached' });
      if (coupon.expires_at && new Date() > new Date(coupon.expires_at)) return res.status(400).json({ error: 'Coupon expired' });
      if (coupon.type === 'percent') {
        discount = Math.round(total * (coupon.amount / 100));
      } else {
        discount = Math.round(coupon.amount);
      }
      appliedCoupon = coupon;
    }
    const finalTotal = total - discount;
    if (finalTotal < 0) return res.status(400).json({ error: 'Total after discount is negative' });

    // Inventory check & decrement
    for (const item of items) {
      const product = await db('products').where({ id: item.product_id }).first();
      if (!product) return res.status(404).json({ error: `Product not found: ${item.product_id}` });
      if (product.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for product: ${product.title}` });
    }
    for (const item of items) {
      await db('products').where({ id: item.product_id }).decrement('stock', item.quantity);
    }

    // Create order
    const [order] = await db('orders').insert({
      user_id: req.user.id,
      items: JSON.stringify(items),
      total: finalTotal,
      payment_intent_id: paymentIntentId,
      shipping_address: JSON.stringify(shippingAddress),
      status: 'Processing',
      coupon_code: couponCode || null,
      discount
    }).returning('*');

    // Update coupon usage
    if (appliedCoupon) {
      await db('coupons').where({ id: appliedCoupon.id }).increment('used_count', 1);
    }

    res.status(201).json({ order });
  } catch (err) { next(err); }
}

async function getOrders(req, res, next) {
  try {
    const orders = req.user.role === 'admin'
      ? await db('orders').select('*')
      : await db('orders').where({ user_id: req.user.id });
    res.json({ orders });
  } catch (err) { next(err); }
}

async function getOrder(req, res, next) {
  try {
    const order = await db('orders').where({ id: req.params.id }).first();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    res.json({ order });
  } catch (err) { next(err); }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const [order] = await db('orders').where({ id: req.params.id }).update({ status }).returning('*');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) { next(err); }
}

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus };
