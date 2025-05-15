import express from 'express';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create payment route
router.post('/create', auth, async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, userId } = req.body;

    // Validate required fields
    if (!orderId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Create new payment
    const payment = new Payment({
      orderId,
      userId,
      amount,
      paymentMethod,
      status: 'completed',
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`
    });

    await payment.save();

    // Update order status
    await Order.findByIdAndUpdate(orderId, {
      status: 'completed',
      paymentId: payment._id,
      completedAt: new Date()
    });

    res.json({
      success: true,
      paymentId: payment._id,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(400).json({
      success: false,
      error: 'Payment processing failed'
    });
  }
});

// Get payment status
router.get('/:paymentId', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment' });
  }
});

export default router; 