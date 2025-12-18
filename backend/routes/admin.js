/**
 * Admin Routes
 * Example routes showing how to use role-based authorization
 * All routes require admin role
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Clinic = require('../models/Clinic');

const router = express.Router();

// All routes in this file require admin role
router.use(protect, authorize('admin'));

// @route   GET /api/admin/appointments
// @desc    Get all appointments (admin only)
// @access  Private/Admin
router.get('/appointments', async (req, res) => {
  try {
    const appointments = Appointment.findAll();

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    // Get all users (excluding passwords)
    const stmt = require('../config/database').db.prepare(
      'SELECT id, name, email, phone, role, clinic_id, created_at FROM users ORDER BY created_at DESC'
    );
    const users = stmt.all();

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const { db } = require('../config/database');
    
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalClinics = db.prepare('SELECT COUNT(*) as count FROM clinics').get().count;
    const totalAppointments = db.prepare('SELECT COUNT(*) as count FROM appointments').get().count;
    const pendingAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'").get().count;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalClinics,
        totalAppointments,
        pendingAppointments,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/admin/clinics
// @desc    Get all clinics (admin)
// @access  Private/Admin
router.get('/clinics', async (req, res) => {
  try {
    const clinics = Clinic.findAll({});

    res.json({
      success: true,
      count: clinics.length,
      clinics,
    });
  } catch (error) {
    console.error('Get clinics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/admin/clinics
// @desc    Create a new clinic (admin only)
// @access  Private/Admin
router.post(
  '/clinics',
  [
    body('name').trim().notEmpty().withMessage('Clinic name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
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

      const { name, category, description, address, phone, email, image, rating, isActive } = req.body;

      // Check if clinic with same name already exists
      const existingClinic = Clinic.findByName(name);
      if (existingClinic) {
        return res.status(400).json({
          success: false,
          message: 'A clinic with this name already exists',
        });
      }

      const clinic = Clinic.create({
        name,
        category,
        description,
        address,
        phone,
        email,
        image,
        rating: rating || 0,
        isActive: isActive !== undefined ? isActive : true,
      });

      res.status(201).json({
        success: true,
        message: 'Clinic created successfully',
        clinic,
      });
    } catch (error) {
      console.error('Create clinic error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
        error: error.message,
      });
    }
  }
);

// @route   PUT /api/admin/clinics/:id
// @desc    Update a clinic (admin only)
// @access  Private/Admin
router.put('/clinics/:id', async (req, res) => {
  try {
    const clinic = Clinic.findById(req.params.id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    const updatedClinic = Clinic.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Clinic updated successfully',
      clinic: updatedClinic,
    });
  } catch (error) {
    console.error('Update clinic error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   DELETE /api/admin/clinics/:id
// @desc    Delete a clinic (admin only)
// @access  Private/Admin
router.delete('/clinics/:id', async (req, res) => {
  try {
    const clinic = Clinic.findById(req.params.id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    Clinic.delete(req.params.id);

    res.json({
      success: true,
      message: 'Clinic deleted successfully',
    });
  } catch (error) {
    console.error('Delete clinic error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/admin/clinic-appointments
// @desc    Get appointments for a specific clinic (for clinic users)
// @access  Private/Admin or Clinic
router.get('/clinic-appointments/:clinicId', async (req, res) => {
  try {
    const { clinicId } = req.params;
    const appointments = Appointment.findByClinicId(clinicId);

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

module.exports = router;

