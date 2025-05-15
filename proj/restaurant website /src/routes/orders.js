import express from 'express';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import PointsHistory from '../models/PointsHistory.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get user's orders
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    // Verify the requesting user has permission to view these orders
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these orders'
      });
    }

    // Find orders with proper error handling
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance since we don't need Mongoose documents

    // Format the response
    const formattedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      userId: order.userId.toString(),
      createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
      completedAt: order.completedAt ? new Date(order.completedAt).toISOString() : null
    }));

    res.json({
      success: true,
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    
    // Handle specific error types
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get user's completed orders
router.get('/user/:userId/completed', auth, async (req, res) => {
  try {
    const orders = await Order.find({ 
      userId: req.params.userId,
      status: 'completed'
    })
    .sort({ completedAt: -1 })
    .limit(10);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching completed orders' });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, totalAmount, pointsUsed, tableNumber, specialInstructions } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid total amount'
      });
    }

    // Get user and validate points
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate points earned (10 points per dollar)
    const pointsEarned = Math.floor(totalAmount * 10);
    const pointsToUse = parseInt(pointsUsed) || 0;

    // Check if user has enough points
    if (pointsToUse > 0 && !user.hasEnoughPoints(pointsToUse)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Not enough points available'
      });
    }

    // Calculate bonus points
    const bonusPoints = calculateBonusPoints(totalAmount, tableNumber);
    const totalPointsEarned = pointsEarned + bonusPoints;

    // Create order
    const order = new Order({
      userId,
      items,
      totalAmount,
      pointsUsed: pointsToUse,
      pointsEarned: totalPointsEarned,
      tableNumber,
      specialInstructions,
      status: 'pending'
    });

    await order.save({ session });

    // Update user points and get updated totals
    const pointsUpdate = await user.updatePoints(totalPointsEarned, pointsToUse);

    // Create points history records
    const pointsHistoryRecords = [];

    // Record base points earned
    if (pointsEarned > 0) {
      pointsHistoryRecords.push(new PointsHistory({
        userId,
        orderId: order._id,
        points: pointsEarned,
        type: 'earned',
        description: `Base points earned from order #${order._id}`,
        balance: pointsUpdate.newPoints
      }));
    }

    // Record bonus points
    if (bonusPoints > 0) {
      pointsHistoryRecords.push(new PointsHistory({
        userId,
        orderId: order._id,
        points: bonusPoints,
        type: 'earned',
        description: `Bonus points earned from order #${order._id}`,
        balance: pointsUpdate.newPoints
      }));
    }

    // Record points used
    if (pointsToUse > 0) {
      pointsHistoryRecords.push(new PointsHistory({
        userId,
        orderId: order._id,
        points: -pointsToUse,
        type: 'used',
        description: `Points used for order #${order._id}`,
        balance: pointsUpdate.newPoints
      }));
    }

    // Save all points history records
    await PointsHistory.insertMany(pointsHistoryRecords, { session });

    // Commit transaction
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      order,
      points: pointsUpdate.newPoints,
      pointsEarned: totalPointsEarned,
      pointsUsed: pointsToUse,
      pointsSummary: {
        currentPoints: pointsUpdate.newPoints,
        totalEarned: pointsUpdate.totalPointsEarned,
        totalUsed: pointsUpdate.totalPointsUsed,
        lastUpdate: user.lastPointsUpdate
      },
      message: 'Order created successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

// Complete payment for an order
router.post('/:orderId/complete', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { paymentMethod, cardDetails } = req.body;

    // Find order and validate ownership
    const order = await Order.findOne({ _id: orderId, userId: req.user._id }).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Order not found or unauthorized'
      });
    }

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      userId: req.user._id,
      amount: order.totalAmount,
      paymentMethod,
      cardDetails: paymentMethod === 'card' ? cardDetails : null,
      status: 'completed'
    });

    await payment.save({ session });

    // Update order status
    order.status = 'completed';
    order.paymentId = payment._id;
    order.completedAt = new Date();
    await order.save({ session });

    // Get user to return current points
    const user = await User.findById(req.user._id).session(session);
    
    // Commit transaction
    await session.commitTransaction();

    res.json({
      success: true,
      order,
      payment,
      points: user?.points || 0,
      message: 'Payment completed successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Payment completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing payment',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

// Helper function to calculate bonus points
function calculateBonusPoints(total, tableNumber) {
  let bonusPoints = 0;
  
  // Bonus points for higher spending
  if (total >= 100) bonusPoints += 500;
  else if (total >= 50) bonusPoints += 200;
  
  // Bonus points for VIP tables
  const vipTables = [1, 2, 3, 4, 5];
  if (vipTables.includes(parseInt(tableNumber))) {
    bonusPoints += 100;
  }
  
  return bonusPoints;
}

// Get order with payment details
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('paymentId')
      .populate('userId', 'name email points');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find and update the order
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order'
    });
  }
});

export default router; 