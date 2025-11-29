import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'

interface VerifyForm {
  email: string
  otp: string
}

const VerifyEmailPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyEmail } = useAuth()
  const [loading, setLoading] = useState(false)

  const searchParams = new URLSearchParams(location.search)
  const initialEmail = searchParams.get('email') || ''

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<VerifyForm>({
    defaultValues: {
      email: initialEmail,
      otp: ''
    }
  })

  useEffect(() => {
    if (initialEmail) {
      setValue('email', initialEmail)
    }
  }, [initialEmail, setValue])

  const onSubmit = async (data: VerifyForm) => {
    try {
      setLoading(true)
      await verifyEmail(data.email, data.otp)
      navigate('/')
    } catch (error) {
      console.error('Verify email error:', error)
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
                <i className="bi bi-shield-lock text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold font-secondary bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Verify Email
              </span>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400">
              Enter the verification code sent to your email.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                Verification Code (OTP)
              </label>
              <div className="relative">
                <i className="bi bi-key absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"></i>
                <input
                  type="text"
                  maxLength={6}
                  {...register('otp', { 
                    required: 'Verification code is required',
                    pattern: {
                      value: /^[0-9]{4,6}$/,
                      message: 'Code must be 4–6 digits'
                    }
                  })}
                  className="input-field pl-10 tracking-widest text-center text-lg"
                  placeholder="••••••"
                />
              </div>
              {errors.otp && (
                <p className="mt-1 text-sm text-error-500">{errors.otp.message}</p>
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
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default VerifyEmailPage


