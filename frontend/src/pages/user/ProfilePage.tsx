import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'

interface ProfileForm {
  name: string
  email: string
  phone: string
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  })

  const onSubmit = async (data: ProfileForm) => {
    try {
      setLoading(true)
      await updateProfile(data)
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen pt-16 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-secondary text-secondary-900 dark:text-secondary-100 mb-2">
              My Profile
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-person-fill text-3xl text-white"></i>
                </div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                  {user?.name}
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400 mb-2">
                  {user?.email}
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === 'admin' 
                    ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400' 
                    : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                }`}>
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                    Personal Information
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <i className="bi bi-pencil"></i>
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

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
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-secondary-50 dark:bg-secondary-800 cursor-not-allowed' : ''}`}
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
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-secondary-50 dark:bg-secondary-800 cursor-not-allowed' : ''}`}
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
                        disabled={!isEditing}
                        className={`input-field pl-10 ${!isEditing ? 'bg-secondary-50 dark:bg-secondary-800 cursor-not-allowed' : ''}`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-error-500">{errors.phone.message}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <>
                            <i className="bi bi-check-lg mr-2"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-secondary"
                      >
                        <i className="bi bi-x-lg mr-2"></i>
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
