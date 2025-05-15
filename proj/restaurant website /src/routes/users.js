import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import PointsHistory from '../models/PointsHistory.js';

const router = express.Router();

// Get current user data
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      points: 0,
      createdAt: new Date()
    });

    console.log('Attempting to save user:', { name, email });

    // Save user to database
    const savedUser = await user.save();

    console.log('User saved successfully:', {
      userId: savedUser._id,
      name: savedUser.name,
      email: savedUser.email
    });

    // Generate token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send success response
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        points: savedUser.points
      }
    });

  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: {
        message: error.message,
        code: error.code
      }
    });
  }
});

// Update user points
router.patch('/points', auth, async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Calculate new points total
    const currentPoints = user.points || 0;
    const newPoints = Math.max(0, currentPoints + points); // Ensure points don't go below 0
    
    // Update user points
    user.points = newPoints;
    await user.save();
    
    // Create points history record
    const pointsHistory = new PointsHistory({
      userId: user._id,
      points: points,
      type: points > 0 ? 'earned' : 'used',
      description: points > 0 ? 'Points earned from order' : 'Points used for order'
    });
    await pointsHistory.save();
    
    res.json({
      success: true,
      points: user.points,
      message: 'Points updated successfully'
    });
  } catch (error) {
    console.error('Points update error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating points',
      error: error.message
    });
  }
});

// Get points history
router.get('/:userId/points-history', auth, async (req, res) => {
  try {
    const pointsHistory = await PointsHistory.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(20);
    res.json(pointsHistory);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching points history' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);
    
    Object.keys(updates).forEach(key => {
      if (key !== 'email' && key !== 'password') { // Prevent email/password updates
        user[key] = updates[key];
      }
    });
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error updating profile' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt received:', { email: req.body.email });
    
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user
    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('User found:', { userId: user._id, email: user.email });

    // Compare password
    console.log('Comparing password for user:', user.email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', user.email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('Password verified for user:', user.email);

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Generate JWT token
    console.log('Generating JWT token for user:', user.email);
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    console.log('Setting authentication cookie for user:', user.email);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send success response
    console.log('Login successful for user:', user.email);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        points: user.points || 0
      }
    });

  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    
    if (error.name === 'MongoError') {
      res.status(500).json({
        success: false,
        message: 'Database error during login'
      });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(500).json({
        success: false,
        message: 'Token generation error'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred during login'
      });
    }
  }
});

// Update user birthday
router.patch('/birthday', auth, async (req, res) => {
  try {
    const { birthday } = req.body;
    
    if (!birthday) {
      return res.status(400).json({
        success: false,
        message: 'Birthday is required'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.birthday = new Date(birthday);
    await user.save();

    res.json({
      success: true,
      message: 'Birthday updated successfully',
      birthday: user.birthday
    });
  } catch (error) {
    console.error('Birthday update error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating birthday',
      error: error.message
    });
  }
});

// Update personal information
router.patch('/personal-info', auth, async (req, res) => {
  try {
    const {
      phoneNumber,
      address,
      dietaryPreferences,
      allergies,
      birthday
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if they are provided
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address !== undefined) user.address = address;
    if (dietaryPreferences !== undefined) user.dietaryPreferences = dietaryPreferences;
    if (allergies !== undefined) user.allergies = allergies;
    if (birthday !== undefined) user.birthday = new Date(birthday);

    await user.save();

    res.json({
      success: true,
      message: 'Personal information updated successfully',
      user: {
        phoneNumber: user.phoneNumber,
        address: user.address,
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies,
        birthday: user.birthday
      }
    });
  } catch (error) {
    console.error('Personal info update error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating personal information',
      error: error.message
    });
  }
});

// Get personal information
router.get('/personal-info', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('phoneNumber address dietaryPreferences allergies birthday');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      personalInfo: {
        phoneNumber: user.phoneNumber,
        address: user.address,
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies,
        birthday: user.birthday
      }
    });
  } catch (error) {
    console.error('Error fetching personal info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching personal information',
      error: error.message
    });
  }
});

export default router; 