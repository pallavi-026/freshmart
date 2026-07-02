const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** Generate JWT token */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number and one special character' 
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        addresses: user.addresses || [],
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get user profile
 * @route GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Add a new address to user profile
 * @route POST /api/auth/address
 */
const addAddress = async (req, res) => {
  try {
    const { street, city, state, zip, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.addresses.push({ street, city, state, zip, phone });
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete an address from user profile
 * @route DELETE /api/auth/address/:id
 */
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Sync Firebase user with MongoDB (Login/Register)
 * @route POST /api/auth/firebase-sync
 */
const firebaseSync = async (req, res) => {
  try {
    require('../config/firebase');
    const { getAuth } = require('firebase-admin/auth');
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided' });
    }

    // Verify Firebase token
    const decodedToken = await getAuth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // Find user by Firebase UID or Email
    let user = await User.findOne({ $or: [{ firebaseUid: uid }, { email }] });

    if (!user) {
      // Create new user if they don't exist in MongoDB
      user = await User.create({
        name: name || email.split('@')[0],
        email: email,
        firebaseUid: uid,
        isAdmin: false
      });
    } else {
      let updated = false;
      if (!user.firebaseUid) {
        // Link existing legacy user to Firebase
        user.firebaseUid = uid;
        updated = true;
      }
      
      // If the user's name is just the email prefix, but Google (or Firebase profile) provided a real name, update it
      if (name && user.name === email.split('@')[0]) {
        user.name = name;
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        firebaseUid: user.firebaseUid,
        addresses: user.addresses || []
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid Firebase token: ' + error.message });
  }
};

module.exports = { register, login, getProfile, addAddress, deleteAddress, firebaseSync };
