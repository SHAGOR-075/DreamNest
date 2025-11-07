import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-secondary-900">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <i className="bi bi-house-heart-fill text-white text-sm"></i>
          </div>
          <span className="text-lg font-semibold font-secondary bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            DreamNest
          </span>
        </motion.div>
        <p className="text-secondary-500 dark:text-secondary-400 mt-2">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
