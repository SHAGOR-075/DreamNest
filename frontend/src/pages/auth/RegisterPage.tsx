import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'

interface RegisterForm {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>()
  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true)
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      })
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <i className="bi bi-house-heart-fill text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold font-secondary bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                DreamNest
              </span>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
              Create Account
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Join DreamNest to find your perfect property
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <i className="bi bi-person absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"></i>
                <input
                  type="text"
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-error-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <i className="bi bi-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"></i>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <i className="bi bi-telephone absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"></i>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[+]?[\d\s\-\(\)]{10,}$/,
                      message: 'Invalid phone number'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-error-500">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Password
              </label>
              <div className="relative">
                <i className="bi bi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"></i>
                <input
                  type="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <i className="bi bi-lock-fill absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"></i>
                <input
                  type="password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className="input-field pl-10"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-secondary-600 dark:text-secondary-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
