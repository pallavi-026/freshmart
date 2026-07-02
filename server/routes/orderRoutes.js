const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All order routes are protected

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);

module.exports = router;
