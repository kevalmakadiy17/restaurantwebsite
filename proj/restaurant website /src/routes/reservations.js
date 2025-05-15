import express from 'express';
import Reservation from '../models/Reservation.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get user's reservations
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

    // Verify the requesting user has permission to view these reservations
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these reservations'
      });
    }

    // Find reservations with proper error handling
    const reservations = await Reservation.find({ userId })
      .sort({ date: 1, time: 1 })
      .lean();

    // Format the response
    const formattedReservations = reservations.map(reservation => ({
      ...reservation,
      _id: reservation._id.toString(),
      userId: reservation.userId.toString(),
      date: new Date(reservation.date).toISOString(),
      createdAt: new Date(reservation.createdAt).toISOString()
    }));

    res.json({
      success: true,
      reservations: formattedReservations
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reservations',
      error: error.message
    });
  }
});

// Create new reservation
router.post('/', async (req, res) => {
  try {
    const { date, time, tableNumber, partySize, name, phoneNumber, specialRequests, userId } = req.body;

    // Validate required fields
    if (!date || !time || !tableNumber || !partySize || !name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate party size
    if (partySize < 1 || partySize > 20) {
      return res.status(400).json({
        success: false,
        message: 'Party size must be between 1 and 20'
      });
    }

    // Validate table number
    if (tableNumber < 1 || tableNumber > 50) {
      return res.status(400).json({
        success: false,
        message: 'Invalid table number'
      });
    }

    // Check if table is available
    const existingReservation = await Reservation.findOne({
      date,
      time,
      tableNumber,
      status: { $ne: 'cancelled' }
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: 'This table is already reserved for the selected time'
      });
    }

    // Create reservation
    const reservation = new Reservation({
      userId: userId || null, // Make userId optional
      date: new Date(date), // Ensure this is a Date object
      time,
      tableNumber,
      partySize,
      name,
      phoneNumber,
      specialRequests
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      reservation: {
        ...reservation.toObject(),
        _id: reservation._id.toString(),
        userId: reservation.userId ? reservation.userId.toString() : null,
        date: new Date(reservation.date).toISOString(),
        createdAt: new Date(reservation.createdAt).toISOString()
      },
      message: 'Reservation created successfully'
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating reservation',
      error: error.message
    });
  }
});

// Update reservation status
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Find and update the reservation
    const reservation = await Reservation.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { status },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found or unauthorized'
      });
    }

    res.json({
      success: true,
      reservation: {
        ...reservation.toObject(),
        _id: reservation._id.toString(),
        userId: reservation.userId.toString(),
        date: new Date(reservation.date).toISOString(),
        createdAt: new Date(reservation.createdAt).toISOString()
      },
      message: 'Reservation updated successfully'
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reservation',
      error: error.message
    });
  }
});

// Cancel reservation
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the reservation
    const reservation = await Reservation.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling reservation',
      error: error.message
    });
  }
});

export default router; 