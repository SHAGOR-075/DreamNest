import express from 'express'
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  verifyEmailOtp,
  verifyLoginOtp
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import {
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate,
  validateEmailOtp
} from '../middleware/validation.js'

const router = express.Router()

// Public routes
router.post('/register', validateUserRegistration, registerUser)
router.post('/login', validateUserLogin, loginUser)
router.post('/verify-email', verifyEmailOtp)
router.post('/login/verify-otp', validateEmailOtp, verifyLoginOtp)

// Protected routes
router.use(protect) // All routes below require authentication

router.post('/logout', logoutUser)
router.get('/profile', getUserProfile)
router.put('/profile', validateProfileUpdate, updateUserProfile)
router.put('/change-password', changePassword)

export default router
