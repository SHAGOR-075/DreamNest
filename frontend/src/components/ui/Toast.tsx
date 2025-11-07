import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  isVisible: boolean
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success-500',
          icon: 'bi-check-circle-fill'
        }
      case 'error':
        return {
          bg: 'bg-error-500',
          icon: 'bi-x-circle-fill'
        }
      case 'warning':
        return {
          bg: 'bg-accent-500',
          icon: 'bi-exclamation-triangle-fill'
        }
      default:
        return {
          bg: 'bg-primary-500',
          icon: 'bi-info-circle-fill'
        }
    }
  }

  const styles = getTypeStyles()

  React.useEffect(() => {
    if (isVisible) {
      const timer = window.setTimeout(() => {
        onClose()
      }, 4000)
      return () => window.clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className={`fixed top-4 right-4 z-50 ${styles.bg} text-white px-6 py-4 rounded-lg shadow-lg max-w-sm`}
        >
          <div className="flex items-center space-x-3">
            <i className={`${styles.icon} text-xl`}></i>
            <p className="font-medium">{message}</p>
            <button
              onClick={onClose}
              className="ml-auto text-white hover:text-gray-200 transition-colors duration-200"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
