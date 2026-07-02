const express = require('express');
const router = express.Router();
const { register, login, getProfile, addAddress, deleteAddress, firebaseSync } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/firebase-sync', firebaseSync);
router.get('/profile', protect, getProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);

module.exports = router;
