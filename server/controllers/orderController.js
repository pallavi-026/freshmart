const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @desc Place a new order
 * @route POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Validate shipping address (Flexible for zip or zipCode)
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || (!shippingAddress.zip && !shippingAddress.zipCode) || !shippingAddress.phone) {
      return res.status(400).json({ success: false, message: 'Complete shipping address and phone are required' });
    }

    // Normalize zip field for consistency
    const normalizedAddress = {
      ...shippingAddress,
      zip: shippingAddress.zip || shippingAddress.zipCode
    };

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Verify stock for all items first
    for (const item of cart.items) {
      if (!item.product || item.product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.product?.name || 'an item'}. Available: ${item.product?.stock || 0}` 
        });
      }
    }

    // Build order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.image
    }));

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Atomic Stock Deduction
    // We attempt to decrement stock only if it's still sufficient.
    const stockUpdates = cart.items.map(async (item) => {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updatedProduct) {
        throw new Error(`Stock changed for ${item.product.name}. Please try again.`);
      }
    });

    try {
      await Promise.all(stockUpdates);
    } catch (error) {
      // Rollback logic would be complex here without transactions.
      // For now, we inform the user.
      return res.status(400).json({ success: false, message: error.message });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: normalizedAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery'
    });

    // Clear cart after ordering
    cart.items = [];
    await cart.save();

    // 4. Save address to user profile if not exists
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (user) {
      const addressExists = user.addresses.some(a => 
        a.street === normalizedAddress.street && 
        (a.zip === normalizedAddress.zip || a.zip === normalizedAddress.zipCode)
      );
      if (!addressExists) {
        user.addresses.push(normalizedAddress);
        await user.save();
      }
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get user's orders
 * @route GET /api/orders
 */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get single order
 * @route GET /api/orders/:id
 */
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name image');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    // Ensure user owns this order
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all orders (Admin)
 * @route GET /api/admin/orders
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.product', 'name image');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update order status (Admin)
 * @route PUT /api/admin/orders/:id
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrder, getAllOrders, updateOrderStatus };
