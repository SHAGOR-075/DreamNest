import express from 'express'
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  togglePropertyAvailability,
  toggleFeaturedStatus,
  getLocationValues
} from '../controllers/propertyController.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validateProperty } from '../middleware/validation.js'

const router = express.Router()

// Public routes
router.get('/', getProperties)
router.get('/featured', getFeaturedProperties)
router.get('/locations', getLocationValues)
router.get('/:id', getProperty)

// Protected routes (Admin only)
router.use(protect, adminOnly)

router.post('/', validateProperty, createProperty)
router.put('/:id', validateProperty, updateProperty)
router.delete('/:id', deleteProperty)
router.patch('/:id/availability', togglePropertyAvailability)
router.patch('/:id/featured', toggleFeaturedStatus)

export default router
