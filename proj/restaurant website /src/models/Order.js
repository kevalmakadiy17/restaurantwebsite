import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: () => `ORD${Date.now()}${Math.random().toString(36).substr(2, 5)}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  pointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  pointsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add validation for total amount
orderSchema.pre('save', function(next) {
  // Calculate total amount from items
  const calculatedTotal = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Round to 2 decimal places
  this.totalAmount = Math.round(calculatedTotal * 100) / 100;
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order; 