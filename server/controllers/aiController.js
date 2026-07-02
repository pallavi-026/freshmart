const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @desc AI Shopping Chatbot
 * @route POST /api/ai/chat
 */
const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Get available products to give Gemini context
    const products = await Product.find({ isAvailable: true }).select('name category price unit description').limit(100);
    const productList = products.map(p => `${p.name} (${p.category}) - $${p.price}/${p.unit}`).join('\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are FreshMart's friendly AI shopping assistant. FreshMart is an online grocery store.

Here are the products currently available in our store:
${productList}

Your job is to:
- Help customers find products they need
- Suggest healthy food options and alternatives
- Answer questions about products, nutrition, and recipes
- Keep responses concise, friendly, and helpful
- Only recommend products that are actually in our store list above
- Format product suggestions clearly with name and price

If asked about something unrelated to groceries or shopping, politely redirect to grocery topics.`;

    // Build conversation history for Gemini
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Hello! I\'m FreshMart\'s AI shopping assistant. I\'m here to help you find fresh groceries, suggest healthy options, and answer any questions about our products. How can I help you today?' }] },
        ...chatHistory
      ]
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    res.json({ success: true, data: { reply: response } });
  } catch (error) {
    console.error('AI Chat error:', error.message);
    res.status(500).json({ success: false, message: 'AI service temporarily unavailable. Please try again.' });
  }
};

module.exports = { chat };
