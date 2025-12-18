const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { db } = require('../config/database');

const router = express.Router();

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Public (can be made private)
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('area').notEmpty().withMessage('Area is required'),
    body('clinic').notEmpty().withMessage('Clinic is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('date').notEmpty().withMessage('Date is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const appointmentData = {
        ...req.body,
        user_id: null,
        clinic_id: null,
      };

      // If user is logged in, associate appointment with user
      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
          const user = User.findById(decoded.id);
          if (user) {
            appointmentData.user_id = user.id;
          }
        } catch (error) {
          // If token is invalid, continue without user association
        }
      }

      // Find clinic by name and link appointment to clinic_id
      if (appointmentData.clinic) {
        const Clinic = require('../models/Clinic');
        const clinic = Clinic.findByName(appointmentData.clinic);
        if (clinic) {
          appointmentData.clinic_id = clinic.id;
        }
      }

      const appointment = Appointment.create(appointmentData);

      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        appointment,
      });
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  }
);

// @route   GET /api/appointments
// @desc    Get all appointments (for logged-in user)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const appointments = Appointment.findByUserId(req.user.id);

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if appointment belongs to user
    if (appointment.user_id && appointment.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this appointment',
      });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if appointment belongs to user
    if (appointment.user_id && appointment.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment',
      });
    }

    const updatedAppointment = Appointment.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel/Delete appointment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if appointment belongs to user
    if (appointment.user_id && appointment.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this appointment',
      });
    }

    Appointment.delete(req.params.id);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/appointments/:id/reschedule
// @desc    Reschedule an appointment (user) and auto-confirm it
// @access  Private
router.put('/:id/reschedule', protect, async (req, res) => {
  try {
    const { date, reason } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'New date is required to reschedule the appointment',
      });
    }

    const appointment = Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Only the owner of the appointment can reschedule it (if linked to a user)
    if (appointment.user_id && appointment.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reschedule this appointment',
      });
    }

    // Optional: validate that new date is not in the past
    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate < today) {
      return res.status(400).json({
        success: false,
        message: 'New appointment date must be today or in the future',
      });
    }

    // Save reschedule history
    const historyStmt = db.prepare(`
      INSERT INTO appointment_reschedules (appointment_id, old_date, new_date, reason)
      VALUES (?, ?, ?, ?)
    `);
    historyStmt.run(appointment.id, appointment.date, date, reason || null);

    // Update appointment date and auto-confirm
    const updatedAppointment = Appointment.update(req.params.id, {
      date,
      status: 'confirmed',
    });

    res.json({
      success: true,
      message: 'Appointment rescheduled and confirmed successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
