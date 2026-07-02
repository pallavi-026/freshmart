const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('../config/firebase');
const { getAuth } = require('firebase-admin/auth');

/**
 * Protect routes - verify Firebase or JWT token
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      try {
        // 1. Try Firebase Token Verification
        const decodedToken = await getAuth().verifyIdToken(token);
        req.user = await User.findOne({ 
          $or: [{ firebaseUid: decodedToken.uid }, { email: decodedToken.email }] 
        }).select('-password');
      } catch (fbError) {
        // 2. Fallback to custom JWT (for existing logged-in users)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

/**
 * Admin middleware - check if user is admin
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };
