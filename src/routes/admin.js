const express = require('express');
const router = express.Router();
const { dashboardStats, listUsers, banUser, getLowStock } = require('../controllers/adminController');
const { authenticate, authorizeAdmin, requireAdmin } = require('../middleware/auth');

router.get('/dashboard', requireAdmin, dashboardStats);

// Low stock products
router.get('/low-stock', requireAdmin, getLowStock);
router.get('/users', authenticate, authorizeAdmin, listUsers);
router.put('/users/:id/ban', authenticate, authorizeAdmin, banUser);

module.exports = router;
