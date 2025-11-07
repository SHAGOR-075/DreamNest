import express from 'express'
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import {
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate
} from '../middleware/validation.js'

const router = express.Router()

// Public routes
router.post('/register', validateUserRegistration, registerUser)
router.post('/login', validateUserLogin, loginUser)

// Protected routes
router.use(protect) // All routes below require authentication

router.post('/logout', logoutUser)
router.get('/profile', getUserProfile)
router.put('/profile', validateProfileUpdate, updateUserProfile)
router.put('/change-password', changePassword)

export default router
