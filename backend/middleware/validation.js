import { body, validationResult } from 'express-validator'

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg)
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    })
  }
  next()
}

// User registration validation
export const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('phone')
    .matches(/^[+]?[\d\s\-\(\)]{10,}$/)
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
]

// User login validation
export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
]

// Property validation
export const validateProperty = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  
  body('price')
    .isNumeric()
    .isFloat({ min: 0, max: 100000000 })
    .withMessage('Price must be a valid number between 0 and 100,000,000'),
  
  body('type')
    .isIn(['flat', 'land'])
    .withMessage('Type must be either flat or land'),
  
  body('district')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('District must be between 2 and 100 characters'),
  
  body('thana')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Thana must be between 2 and 100 characters'),
  
  body('area')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Area must be between 2 and 100 characters'),
  
  body('road')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Road must be between 2 and 100 characters'),
  
  handleValidationErrors
]

// Booking validation
export const validateBooking = [
  body('propertyId')
    .isMongoId()
    .withMessage('Please provide a valid property ID'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  
  handleValidationErrors
]

// Profile update validation
export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .optional()
    .matches(/^[+]?[\d\s\-\(\)]{10,}$/)
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
]
