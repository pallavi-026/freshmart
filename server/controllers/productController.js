const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * @desc Get all products with filtering, search, and pagination
 * @route GET /api/products
 */
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    
    let query = { isAvailable: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get single product
 * @route GET /api/products/:id
 */
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get product categories
 * @route GET /api/products/categories/list
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Create product (Admin)
 * @route POST /api/products
 */
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update product (Admin)
 * @route PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete product (Admin)
 * @route DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get product recommendations
 * @route GET /api/products/:id/recommendations
 */
const getRecommendations = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let recommendedIds = new Set();

    // Strategy 1: Find products bought together in orders
    try {
      const orders = await Order.find({ 'items.product': product._id }).limit(50);
      orders.forEach(order => {
        order.items.forEach(item => {
          if (item.product.toString() !== product._id.toString()) {
            recommendedIds.add(item.product.toString());
          }
        });
      });
    } catch (e) { /* Orders might not exist yet */ }

    // Strategy 2: Fill remaining with same category products
    const categoryProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isAvailable: true
    }).limit(8);

    categoryProducts.forEach(p => recommendedIds.add(p._id.toString()));

    // Fetch final recommendations (max 4)
    const recommendations = await Product.find({
      _id: { $in: [...recommendedIds] },
      isAvailable: true
    }).limit(4);

    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProduct, getCategories, createProduct, updateProduct, deleteProduct, getRecommendations };
