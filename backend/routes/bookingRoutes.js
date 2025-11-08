import express from 'express'
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} from '../controllers/bookingController.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validateBooking } from '../middleware/validation.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// User routes - specific routes must come before parameterized routes
router.post('/', validateBooking, createBooking)
router.get('/my', getUserBookings)

// Admin routes - specific routes must come before parameterized routes
router.get('/stats', adminOnly, getBookingStats)
router.get('/', adminOnly, getAllBookings) // Must come before /:id
router.put('/:id/status', adminOnly, updateBookingStatus)

// User routes - parameterized routes come last
router.get('/:id', getBooking)
router.delete('/:id', cancelBooking)

export default router
