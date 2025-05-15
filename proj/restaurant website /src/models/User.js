import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  birthday: {
    type: Date,
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Birthday cannot be in the future'
    }
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number']
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
  },
  dietaryPreferences: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Halal', 'Kosher', 'None']
  }],
  allergies: [{
    type: String,
    trim: true
  }],
  points: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  totalPointsEarned: {
    type: Number,
    default: 0
  },
  totalPointsUsed: {
    type: Number,
    default: 0
  },
  lastPointsUpdate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
  collection: 'users' // Explicitly set collection name
});

// Method to update points
userSchema.methods.updatePoints = async function(pointsEarned = 0, pointsUsed = 0) {
  // Calculate new points total
  const currentPoints = this.points || 0;
  const newPoints = Math.max(0, currentPoints + pointsEarned - pointsUsed);
  
  // Update points and totals
  this.points = newPoints;
  this.totalPointsEarned = (this.totalPointsEarned || 0) + pointsEarned;
  this.totalPointsUsed = (this.totalPointsUsed || 0) + pointsUsed;
  this.lastPointsUpdate = new Date();
  
  // Save changes
  await this.save();
  
  return {
    newPoints,
    pointsEarned,
    pointsUsed,
    totalPointsEarned: this.totalPointsEarned,
    totalPointsUsed: this.totalPointsUsed
  };
};

// Method to check if user has enough points
userSchema.methods.hasEnoughPoints = function(pointsNeeded) {
  return (this.points || 0) >= pointsNeeded;
};

// Method to get points summary
userSchema.methods.getPointsSummary = function() {
  return {
    currentPoints: this.points || 0,
    totalEarned: this.totalPointsEarned || 0,
    totalUsed: this.totalPointsUsed || 0,
    lastUpdate: this.lastPointsUpdate
  };
};

// Create the model with explicit collection name
const User = mongoose.model('User', userSchema);

// Test the model
User.on('index', function(error) {
  if (error) {
    console.error('Error creating indexes:', error);
  } else {
    console.log('User model indexes created successfully');
  }
});

export default User; 