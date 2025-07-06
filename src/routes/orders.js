const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);
router.put('/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

module.exports = router;
