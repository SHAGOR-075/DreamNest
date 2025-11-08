import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

interface Booking {
  _id: string
  propertyId: {
    _id: string
    title: string
    price: number
    district: string
    thana: string
    area: string
    road: string
    images: string[]
    type: 'flat' | 'land'
  }
  status: 'Pending' | 'Approved' | 'Rejected'
  createdAt: string
}

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await axios.get('/api/bookings/my')
      
      // Validate response structure
      if (response.data && Array.isArray(response.data.bookings)) {
        setBookings(response.data.bookings)
      } else if (response.data && response.data.bookings === undefined) {
        // Handle case where bookings might be at root level
        setBookings(Array.isArray(response.data) ? response.data : [])
      } else {
        setBookings([])
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error)
      const errorMessage = error.response?.data?.message || 'Failed to load bookings. Please try again.'
      setError(errorMessage)
      setBookings([]) // Set empty array on error
      // Don't show toast for 401 errors as the interceptor handles that
      if (error.response?.status !== 401) {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
      case 'Rejected':
        return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
      default:
        return 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400'
    }
  }

  const formatPrice = (price: number) => {
    return `TK ${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
    }).format(price)}`
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen pt-16 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-secondary text-secondary-900 dark:text-secondary-100 mb-2">
              My Bookings
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Track your property booking requests and their status
            </p>
          </div>

          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-exclamation-triangle text-4xl text-error-600 dark:text-error-400"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                Error Loading Bookings
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={fetchBookings}
                className="btn-primary"
              >
                <i className="bi bi-arrow-clockwise mr-2"></i>
                Try Again
              </button>
            </motion.div>
          ) : bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map((booking, index) => {
                // Safety check: skip bookings with missing property data
                if (!booking.propertyId) {
                  console.warn('Booking missing propertyId:', booking._id)
                  return null
                }

                const property = booking.propertyId
                const propertyImage = property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
                
                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
                        {/* Property Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={propertyImage}
                            alt={property.title || 'Property'}
                            crossOrigin="anonymous"
                            className="w-full sm:w-32 h-32 object-cover rounded-xl"
                          />
                        </div>

                        {/* Property Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 truncate">
                              {property.title || 'Untitled Property'}
                            </h3>
                            <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                            {property.district && property.thana && property.area && property.road && (
                              <span className="flex items-center space-x-1">
                                <i className="bi bi-geo-alt"></i>
                                <span>{property.district}, {property.thana}, {property.area}, {property.road}</span>
                              </span>
                            )}
                            {property.type && (
                              <span className="flex items-center space-x-1">
                                <i className="bi bi-tag"></i>
                                <span>{property.type === 'flat' ? 'Apartment' : 'Land'}</span>
                              </span>
                            )}
                            <span className="flex items-center space-x-1">
                              <i className="bi bi-calendar"></i>
                              <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            {property.price && (
                              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {formatPrice(property.price)}
                              </div>
                            )}
                            {property._id && (
                              <Link
                                to={`/property/${property._id}`}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                              >
                                <span>View Property</span>
                                <i className="bi bi-arrow-right"></i>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Status Message */}
                  <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                    {booking.status === 'Pending' && (
                      <div className="flex items-center space-x-2 text-accent-600 dark:text-accent-400">
                        <i className="bi bi-clock"></i>
                        <span className="text-sm">Your booking request is being reviewed. We'll contact you within 24 hours.</span>
                      </div>
                    )}
                    {booking.status === 'Approved' && (
                      <div className="flex items-center space-x-2 text-success-600 dark:text-success-400">
                        <i className="bi bi-check-circle"></i>
                        <span className="text-sm">Congratulations! Your booking has been approved. Our team will contact you soon.</span>
                      </div>
                    )}
                    {booking.status === 'Rejected' && (
                      <div className="flex items-center space-x-2 text-error-600 dark:text-error-400">
                        <i className="bi bi-x-circle"></i>
                        <span className="text-sm">Unfortunately, this booking request was not approved. Please contact us for more information.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
                )
              }).filter(Boolean)}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-bookmark text-4xl text-secondary-400"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                No Bookings Yet
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto">
                You haven't made any booking requests yet. Browse our properties and find your dream home!
              </p>
              <Link
                to="/"
                className="btn-primary"
              >
                <i className="bi bi-search mr-2"></i>
                Browse Properties
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default MyBookingsPage
