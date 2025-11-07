import React from 'react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actionText?: string
  onAction?: () => void
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className={`${icon} text-4xl text-secondary-400`}></i>
      </div>
      
      <h3 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        {title}
      </h3>
      
      <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  )
}

export default EmptyState
