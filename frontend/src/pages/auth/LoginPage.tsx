import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'

interface LoginForm {
  email: string
  password: string
}

interface OtpForm {
  otp: string
}

const LoginPage: React.FC = () => {
  const { login, verifyLoginOtp } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [stage, setStage] = useState<'credentials' | 'otp'>('credentials')
  const [emailForOtp, setEmailForOtp] = useState('')
  const [otpInfo, setOtpInfo] = useState('Enter the verification code sent to your email.')
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const { register: registerOtp, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors }, reset: resetOtpForm } = useForm<OtpForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true)
      const result = await login(data.email, data.password)

      // If backend started 2FA flow, switch to OTP stage
      if (result?.otpRequired) {
        setEmailForOtp(data.email)
        setOtpInfo(result.message || 'We sent a login verification code to your email.')
        setStage('otp')
        resetOtpForm()
        return
      }

      // No 2FA – we are already logged in
      navigate('/')
    } catch (error: any) {
      console.error('Login error:', error)
      const status = error?.response?.status
      const message: string | undefined = error?.response?.data?.message

      // If backend says email not verified, send user to OTP page
      if (status === 403 && message && message.toLowerCase().includes('not verified')) {
        navigate(`/verify-email?email=${encodeURIComponent(data.email)}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const onOtpSubmit = async (data: OtpForm) => {
    if (!emailForOtp) return
    try {
      setOtpLoading(true)
      await verifyLoginOtp(emailForOtp, data.otp)
      navigate('/')
    } catch (error) {
      console.error('Login OTP verification error:', error)
    } finally {
      setOtpLoading(false)
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
              Welcome Back
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          {stage === 'credentials' ? (
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

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-6">
              <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg text-sm text-secondary-600 dark:text-secondary-300">
                <p>{otpInfo}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Login Verification Code
                </label>
                <div className="relative">
                  <i className="bi bi-shield-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"></i>
                  <input
                    type="text"
                    maxLength={6}
                    {...registerOtp('otp', {
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
                {otpErrors.otp && (
                  <p className="mt-1 text-sm text-error-500">{otpErrors.otp.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify & Sign In'
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-secondary-600 dark:text-secondary-400">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
            <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Demo Credentials:
            </h3>
            <div className="text-xs text-secondary-600 dark:text-secondary-400 space-y-1">
              <p><strong>Admin:</strong> admin@dreamnest.com / admin123</p>
              <p><strong>User:</strong> user@dreamnest.com / user123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
