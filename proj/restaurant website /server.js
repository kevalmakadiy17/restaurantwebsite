import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/users.js';
import orderRoutes from './src/routes/orders.js';
import paymentRoutes from './src/routes/payments.js';
import Order from './src/models/Order.js';
import User from './src/models/User.js';
import PointsHistory from './src/models/PointsHistory.js';

const app = express();
dotenv.config();

// CORS configuration with more specific options
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

// Middleware to parse JSON bodies with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Test route to verify server is working
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Get order history for a user
app.get('/api/orders/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .populate('items.itemId');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Error fetching order history' });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const {
      orderId,
      userId,
      items,
      tableNumber,
      totalAmount,
      pointsUsed,
      pointsEarned,
      paymentMethod,
      specialInstructions,
      status
    } = req.body;

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the order
      const order = new Order({
        orderId,
        userId,
        items,
        tableNumber,
        totalAmount,
        pointsUsed,
        pointsEarned,
        paymentMethod,
        specialInstructions,
        status: status || 'completed' // Set to completed since payment is already done
      });

      await order.save({ session });

      // Update user points
      const user = await User.findById(userId);
      if (user) {
        // Calculate new points balance
        const currentPoints = user.points || 0;
        const newPoints = currentPoints + pointsEarned - pointsUsed;
        
        // Update user points
        user.points = Math.max(0, newPoints); // Ensure points don't go below 0
        await user.save({ session });

        // Create points history record
        const pointsHistory = new PointsHistory({
          userId: user._id,
          points: pointsEarned - pointsUsed,
          type: pointsEarned > pointsUsed ? 'earned' : 'used',
          description: 'Points from order completion',
          orderId: order._id
        });
        await pointsHistory.save({ session });
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        success: true,
        order,
        message: 'Order created successfully'
      });
    } catch (error) {
      // If an error occurred, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ 
      success: false,
      error: 'Error creating order',
      message: error.message 
    });
  }
});

// Update order status
app.patch('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ error: 'Error updating order status' });
  }
});

// Get single order
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// MongoDB connection with improved error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    console.log('Attempting to connect to MongoDB...');

    // Set connection options with improved settings
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000, // Socket timeout
      family: 4, // Force IPv4
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 5, // Minimum number of connections in the pool
      dbName: 'restaurant_db'
    };

    // Connect to MongoDB with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('MongoDB connected successfully');
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        console.log(`Connection failed. Retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }

    // Verify connection
    const db = mongoose.connection;
    
    // Connection event handlers
    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    db.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    db.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Test database connection
    await testDatabaseConnection();

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  }
};

// Test database connection function
async function testDatabaseConnection() {
  try {
    const db = mongoose.connection;
    console.log('MongoDB connection status:', db.readyState === 1 ? 'Connected' : 'Not Connected');
    console.log('Database name:', db.name);
    console.log('Database host:', db.host);
    console.log('Database port:', db.port);

    // List all collections
    const collections = await db.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    throw error;
  }
}

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
}); 