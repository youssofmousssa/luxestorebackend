const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, getProfile);

module.exports = router;
