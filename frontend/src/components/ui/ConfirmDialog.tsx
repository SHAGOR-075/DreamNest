import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'bi-exclamation-triangle',
          iconBg: 'bg-error-100 dark:bg-error-900/30',
          iconColor: 'text-error-500',
          confirmBtn: 'bg-error-600 hover:bg-error-700'
        }
      case 'warning':
        return {
          icon: 'bi-exclamation-circle',
          iconBg: 'bg-accent-100 dark:bg-accent-900/30',
          iconColor: 'text-accent-500',
          confirmBtn: 'bg-accent-600 hover:bg-accent-700'
        }
      default:
        return {
          icon: 'bi-info-circle',
          iconBg: 'bg-primary-100 dark:bg-primary-900/30',
          iconColor: 'text-primary-500',
          confirmBtn: 'bg-primary-600 hover:bg-primary-700'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-secondary-800 rounded-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className={`w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <i className={`${styles.icon} text-2xl ${styles.iconColor}`}></i>
              </div>
              
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                {title}
              </h3>
              
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {message}
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-700 dark:hover:bg-secondary-600 text-secondary-700 dark:text-secondary-300 font-medium rounded-lg transition-colors duration-200"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-2 ${styles.confirmBtn} text-white font-medium rounded-lg transition-colors duration-200`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog
