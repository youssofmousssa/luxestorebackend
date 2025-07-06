const db = require('../db');

async function getProducts(req, res, next) {
  try {
    const products = await db('products').select('*');
    res.json({ products });
  } catch (err) { next(err); }
}

async function getProduct(req, res, next) {
  try {
    const product = await db('products').where({ id: req.params.id }).first();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) { next(err); }
}

async function createProduct(req, res, next) {
  try {
    const { title, description, price, image, stock, category, variants } = req.body;
    if (!title || !price) return res.status(400).json({ error: 'Missing required fields' });
    const [product] = await db('products').insert({ title, description, price, image, stock, category, variants }).returning('*');
    res.status(201).json({ product });
  } catch (err) { next(err); }
}

async function updateProduct(req, res, next) {
  try {
    const fields = req.body;
    const [product] = await db('products').where({ id: req.params.id }).update(fields).returning('*');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) { next(err); }
}

async function deleteProduct(req, res, next) {
  try {
    const deleted = await db('products').where({ id: req.params.id }).del();
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.status(204).end();
  } catch (err) { next(err); }
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
