import Booking from '../models/Booking.js'
import Property from '../models/Property.js'

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { propertyId, message, contactPreference, preferredContactTime } = req.body

    // Check if property exists and is available
    const property = await Property.findById(propertyId)
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      })
    }

    if (!property.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for booking'
      })
    }

    // Check if user already has a booking for this property
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      propertyId
    })

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking request for this property'
      })
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      propertyId,
      message,
      contactPreference,
      preferredContactTime
    })

    await booking.populate([
      { path: 'userId', select: 'name email phone' },
      { path: 'propertyId', select: 'title price district thana area road images type' }
    ])

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      booking
    })
  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error creating booking'
    })
  }
}

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findByUser(req.user._id)

    res.json({
      success: true,
      count: bookings.length,
      bookings
    })
  } catch (error) {
    console.error('Get user bookings error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings'
    })
  }
}

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query

    // Build query
    let query = {}
    if (status) {
      query.status = status
    }

    // Execute query with pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('propertyId', 'title price district thana area road images type')
      .populate('respondedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)

    const total = await Booking.countDocuments(query)

    res.json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      bookings
    })
  } catch (error) {
    console.error('Get all bookings error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings'
    })
  }
}

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('propertyId', 'title price location images type')
      .populate('respondedBy', 'name email')

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    // Check if user owns this booking or is admin
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    // Mark as viewed if admin is viewing
    if (req.user.role === 'admin') {
      await booking.markAsViewed()
    }

    res.json({
      success: true,
      booking
    })
  } catch (error) {
    console.error('Get booking error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking'
    })
  }
}

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNotes, scheduledViewingDate } = req.body

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Pending, Approved, or Rejected'
      })
    }

    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('propertyId', 'title price location images type')

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    // Update booking
    await booking.updateStatus(status, adminNotes, req.user._id)
    
    if (scheduledViewingDate) {
      booking.scheduledViewingDate = scheduledViewingDate
      await booking.save()
    }

    await booking.populate('respondedBy', 'name email')

    res.json({
      success: true,
      message: `Booking ${status.toLowerCase()} successfully`,
      booking
    })
  } catch (error) {
    console.error('Update booking status error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error updating booking status'
    })
  }
}

// @desc    Cancel booking (User)
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    // Only allow cancellation of pending bookings
    if (booking.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be cancelled'
      })
    }

    await Booking.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    })
  } catch (error) {
    console.error('Cancel booking error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking'
    })
  }
}

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (Admin only)
export const getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const totalBookings = await Booking.countDocuments()
    const pendingBookings = stats.find(s => s._id === 'Pending')?.count || 0
    const approvedBookings = stats.find(s => s._id === 'Approved')?.count || 0
    const rejectedBookings = stats.find(s => s._id === 'Rejected')?.count || 0

    res.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        approvedBookings,
        rejectedBookings
      }
    })
  } catch (error) {
    console.error('Get booking stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking statistics'
    })
  }
}
