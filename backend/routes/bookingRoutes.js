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

// User routes
router.post('/', validateBooking, createBooking)
router.get('/my', getUserBookings)
router.get('/:id', getBooking)
router.delete('/:id', cancelBooking)

// Admin routes
router.get('/', adminOnly, getAllBookings)
router.put('/:id/status', adminOnly, updateBookingStatus)
router.get('/stats', adminOnly, getBookingStats)

export default router
