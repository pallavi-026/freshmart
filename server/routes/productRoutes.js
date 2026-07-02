const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getCategories, createProduct, updateProduct, deleteProduct, getRecommendations } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/categories/list', getCategories);
router.get('/', getProducts);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id', getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
