const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin); // All admin routes require admin

router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

module.exports = router;
