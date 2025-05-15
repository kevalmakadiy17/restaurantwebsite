import mongoose from 'mongoose';

const pointsHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['earned', 'used'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  orderId: {
    type: String,
    ref: 'Order'
  }
});

pointsHistorySchema.index({ userId: 1, date: -1 });

export default mongoose.model('PointsHistory', pointsHistorySchema); 