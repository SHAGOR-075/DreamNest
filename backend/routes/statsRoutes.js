import express from 'express'
import User from '../models/User.js'
import Property from '../models/Property.js'
import Booking from '../models/Booking.js'

const router = express.Router()

// @desc    Get public statistics
// @route   GET /api/stats
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [totalProperties, totalUsers, totalBookings] = await Promise.all([
      Property.countDocuments({ isAvailable: true }),
      User.countDocuments({ role: 'user', isActive: true }),
      Booking.countDocuments({ status: 'Approved' })
    ])

    res.json({
      success: true,
      totalProperties,
      totalUsers,
      totalBookings
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    })
  }
})

export default router
