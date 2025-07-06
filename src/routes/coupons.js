const express = require('express');
const router = express.Router();
const {
  createCoupon,
  listCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon
} = require('../controllers/couponController');
const { requireAdmin, requireAuth } = require('../middleware/auth');

// Admin routes
router.post('/', requireAdmin, createCoupon);
router.get('/', requireAdmin, listCoupons);
router.patch('/:id', requireAdmin, updateCoupon);
router.delete('/:id', requireAdmin, deleteCoupon);

// User route
router.post('/apply', requireAuth, applyCoupon);

module.exports = router;
