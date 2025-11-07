import express from 'express'
import User from '../models/User.js'
import Property from '../models/Property.js'
import Booking from '../models/Booking.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// All routes require admin authentication
router.use(protect, adminOnly)

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
router.get('/stats', async (req, res) => {
  try {
    const [
      totalProperties,
      totalUsers,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings
    ] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Approved' }),
      Booking.countDocuments({ status: 'Rejected' })
    ])

    res.json({
      success: true,
      totalProperties,
      totalUsers,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings
    })
  } catch (error) {
    console.error('Get admin stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching admin statistics'
    })
  }
})

// @desc    Get recent bookings
// @route   GET /api/admin/recent-bookings
// @access  Private (Admin only)
router.get('/recent-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('propertyId', 'title price')
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({
      success: true,
      bookings
    })
  } catch (error) {
    console.error('Get recent bookings error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching recent bookings'
    })
  }
})

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive
    } = req.query

    // Build query
    let query = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (role) {
      query.role = role
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true'
    }

    // Execute query with pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      users
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    })
  }
})

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
router.patch('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      })
    }

    user.isActive = !user.isActive
    await user.save()

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.getPublicProfile()
    })
  } catch (error) {
    console.error('Toggle user status error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error updating user status'
    })
  }
})

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      })
    }

    // Check if user has bookings
    const bookings = await Booking.find({ userId: req.params.id })
    if (bookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with existing bookings'
      })
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    })
  }
})

export default router
