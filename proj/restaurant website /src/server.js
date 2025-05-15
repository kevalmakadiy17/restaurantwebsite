import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Payment from './models/Payment.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import reservationRoutes from './routes/reservations.js';
import auth from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const isDevelopment = process.env.NODE_ENV === 'development';

// Allow all origins for testing
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());

// Mount user routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);

// Test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: Number,
  items: Array,
  totalAmount: Number,
  status: {
    type: String,
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tableNumber: {
    type: Number,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

// Routes
app.post('/api/orders', auth, async (req, res) => {
  try {
    const { items, totalAmount, pointsUsed, tableNumber } = req.body;
    
    // Validate points
    const pointsToUse = parseInt(pointsUsed) || 0;
    if (isNaN(pointsToUse) || pointsToUse < 0) {
      return res.status(400).json({ error: 'Invalid points value' });
    }

    // Get user and validate points
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (pointsToUse > user.points) {
      return res.status(400).json({ error: 'Not enough points available' });
    }

    const order = new Order({
      orderId: 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5),
      userId: req.user._id,
      items,
      totalAmount: parseFloat(totalAmount) || 0,
      pointsUsed: pointsToUse,
      tableNumber: parseInt(tableNumber)
    });

    await order.save();

    // Update user points
    user.points = Math.max(0, (user.points || 0) - pointsToUse);
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's points
app.get('/api/users/points', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ points: user.points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize payment
app.post('/api/payments/initialize', auth, async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Create a new payment record
    const payment = new Payment({
      orderId: orderId,
      userId: req.user._id,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod,
      status: 'pending',
      transactionId: 'TXN_' + Date.now() + Math.random().toString(36).substr(2, 5)
    });

    await payment.save();

    // Simulate payment gateway integration
    const paymentIntent = {
      id: payment._id,
      clientSecret: 'secret_' + Math.random().toString(36).substr(2),
      amount: amount * 100 // Convert to cents
    };

    res.json({ paymentIntent, paymentId: payment._id });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Complete payment
app.post('/api/payments/complete', auth, async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = 'completed';
    payment.transactionId = transactionId;
    await payment.save();

    // Update order status
    const order = await Order.findOne({ orderId: payment.orderId });
    if (order) {
      order.paymentStatus = 'completed';
      order.status = 'confirmed';
      await order.save();

      // Update user points
      const user = await User.findById(req.user._id);
      if (user) {
        user.points = user.points + order.pointsEarned - order.pointsUsed;
        await user.save();
      }
    }

    res.json({ success: true, payment, order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Dynamic port binding
const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Frontend URL: http://localhost:${process.env.FRONTEND_PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log('Environment Variables:', process.env);
}); 