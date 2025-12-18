/**
 * Clinic Routes
 * Routes for clinic users to manage their appointments
 */

const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Clinic = require('../models/Clinic');

const router = express.Router();

// All routes require clinic role
router.use(protect);

// Middleware to check if user is a clinic user
const isClinicUser = (req, res, next) => {
  if (req.user.role !== 'clinic') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Clinic role required.',
    });
  }
  if (!req.user.clinic_id) {
    return res.status(400).json({
      success: false,
      message: 'User is not associated with a clinic',
    });
  }
  next();
};

// @route   GET /api/clinic/appointments
// @desc    Get all appointments for the clinic
// @access  Private/Clinic
router.get('/appointments', isClinicUser, async (req, res) => {
  try {
    const appointments = Appointment.findByClinicId(req.user.clinic_id);

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('Get clinic appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/clinic/stats
// @desc    Get clinic statistics
// @access  Private/Clinic
router.get('/stats', isClinicUser, async (req, res) => {
  try {
    const { db } = require('../config/database');
    const clinicId = req.user.clinic_id;
    
    const totalAppointments = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE clinic_id = ?').get(clinicId).count;
    const pendingAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE clinic_id = ? AND status = 'pending'").get(clinicId).count;
    const confirmedAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE clinic_id = ? AND status = 'confirmed'").get(clinicId).count;
    const cancelledAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE clinic_id = ? AND status = 'cancelled'").get(clinicId).count;

    const clinic = Clinic.findById(clinicId);

    res.json({
      success: true,
      stats: {
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        cancelledAppointments,
      },
      clinic: {
        id: clinic.id,
        name: clinic.name,
        category: clinic.category,
      },
    });
  } catch (error) {
    console.error('Get clinic stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/clinic/appointments/:id/status
// @desc    Update appointment status (clinic can confirm/cancel)
// @access  Private/Clinic
router.put('/appointments/:id/status', isClinicUser, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Verify appointment belongs to this clinic
    if (appointment.clinic_id !== req.user.clinic_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment',
      });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, confirmed, cancelled, or completed',
      });
    }

    const updatedAppointment = Appointment.update(req.params.id, { status });

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/clinic/profile
// @desc    Get clinic profile information
// @access  Private/Clinic
router.get('/profile', isClinicUser, async (req, res) => {
  try {
    const clinic = Clinic.findById(req.user.clinic_id);
    const user = User.findById(req.user.id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    res.json({
      success: true,
      clinic,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Get clinic profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;

