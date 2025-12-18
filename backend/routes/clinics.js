const express = require('express');
const Clinic = require('../models/Clinic');

const router = express.Router();

// @route   GET /api/clinics
// @desc    Get all clinics
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filters = {
      isActive: true,
    };

    if (category) {
      filters.category = category;
    }

    const clinics = Clinic.findAll(filters);

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

// @route   GET /api/clinics/:id
// @desc    Get single clinic
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const clinic = Clinic.findById(req.params.id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic not found',
      });
    }

    res.json({
      success: true,
      clinic,
    });
  } catch (error) {
    console.error('Get clinic error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
