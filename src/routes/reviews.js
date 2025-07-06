const express = require('express');
const router = express.Router();
const { addReview, listReviews, deleteReview } = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/auth');

// Add a review to a product (user)
router.post('/products/:id/reviews', requireAuth, addReview);
// List reviews for a product
router.get('/products/:id/reviews', listReviews);
// Delete a review (user or admin)
router.delete('/reviews/:id', requireAuth, deleteReview);

module.exports = router;
