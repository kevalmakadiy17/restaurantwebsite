import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'cash']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  cardDetails: {
    last4: String,
    expiry: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
paymentSchema.index({ orderId: 1 }, { unique: true });
paymentSchema.index({ userId: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment; 