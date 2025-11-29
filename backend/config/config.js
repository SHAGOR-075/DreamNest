import dotenv from 'dotenv'

// Load environment variables from .env file (if present)
dotenv.config()

export const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://DreamNest:DreamNest2025@dreamnest.spbj9ol.mongodb.net/?appName=DreamNest',
  JWT_SECRET: process.env.JWT_SECRET || '061c3ce451bc7762f794fc766251819074bdc2e5b58e6e7bd7536dcd9ac744a3',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Email Configuration (Optional)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@dreamnest.com',
  
  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // File Upload
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads'
}
