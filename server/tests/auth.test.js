const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// We'll import the app logic. We need to export 'app' from server.js for this to work cleanly.
// For now, I'll assume we can require it.
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('../config/db');

dotenv.config();

// Create a test app instance
const app = express();
app.use(express.json());
app.use('/api/auth', require('../routes/authRoutes'));

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should fail login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@test.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('should return error for missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User'
        // Missing email and password
      });
    
    expect(res.statusCode).toEqual(400);
  });
});
