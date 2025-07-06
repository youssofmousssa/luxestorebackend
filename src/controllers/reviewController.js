const db = require('../db');

// Add a review for a product (user)
async function addReview(req, res, next) {
  try {
    const { id: product_id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });
    // Check if already reviewed
    const existing = await db('reviews').where({ product_id, user_id }).first();
    if (existing) return res.status(409).json({ error: 'Already reviewed' });
    const [review] = await db('reviews').insert({ product_id, user_id, rating, comment }).returning('*');
    res.status(201).json({ review });
  } catch (err) { next(err); }
}

// List reviews for a product
async function listReviews(req, res, next) {
  try {
    const { id: product_id } = req.params;
    const reviews = await db('reviews').where({ product_id }).orderBy('created_at', 'desc');
    res.json({ reviews });
  } catch (err) { next(err); }
}

// Delete a review (user can delete own, admin can delete any)
async function deleteReview(req, res, next) {
  try {
    const { id } = req.params; // review id
    const review = await db('reviews').where({ id }).first();
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (req.user.role !== 'admin' && review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await db('reviews').where({ id }).del();
    res.status(204).end();
  } catch (err) { next(err); }
}

module.exports = { addReview, listReviews, deleteReview };
