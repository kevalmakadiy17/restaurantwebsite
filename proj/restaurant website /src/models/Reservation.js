import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  tableNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  partySize: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  specialRequests: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add validation for date (must be in the future)
reservationSchema.pre('save', async function(next) {
  const reservationDate = new Date(this.date);
  const now = new Date();
  
  if (reservationDate < now) {
    return next(new Error('Reservation date must be in the future'));
  }

  // Check for existing reservation at the same time and table
  const existingReservation = await this.constructor.findOne({
    date: this.date,
    time: this.time,
    tableNumber: this.tableNumber,
    status: { $ne: 'cancelled' },
    _id: { $ne: this._id }
  });

  if (existingReservation) {
    return next(new Error('This table is already reserved for the selected time'));
  }

  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation; 