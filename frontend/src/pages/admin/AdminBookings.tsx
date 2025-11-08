import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

interface Booking {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
    phone: string
  }
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
  message?: string
  adminNotes?: string
  createdAt: string
  respondedAt?: string
  age: string
}

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    try {
      setError(null)
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      
      const response = await axios.get(`/api/bookings?${params.toString()}`)
      
      // Validate response structure
      if (response.data && Array.isArray(response.data.bookings)) {
        setBookings(response.data.bookings)
      } else {
        setBookings([])
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error)
      const errorMessage = error.response?.data?.message || 'Failed to fetch bookings. Please try again.'
      setError(errorMessage)
      setBookings([])
      // Don't show toast for 401 errors as the interceptor handles that
      if (error.response?.status !== 401) {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setAdminNotes(booking.adminNotes || '')
    setShowModal(true)
  }

  const updateBookingStatus = async (status: 'Approved' | 'Rejected') => {
    if (!selectedBooking) return

    try {
      setSubmitting(true)
      await axios.put(`/api/bookings/${selectedBooking._id}/status`, {
        status,
        adminNotes
      })
      
      toast.success(`Booking ${status.toLowerCase()} successfully`)
      setShowModal(false)
      fetchBookings()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update booking'
      toast.error(message)
    } finally {
      setSubmitting(false)
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-secondary text-secondary-900 dark:text-secondary-100 mb-2">
                Manage Bookings
              </h1>
              <p className="text-secondary-600 dark:text-secondary-400">
                Review and manage property booking requests
              </p>
            </div>

            {/* Status Filter */}
            <div className="mt-4 sm:mt-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field min-w-[150px]"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Bookings List */}
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
                // Safety check: skip bookings with missing data
                if (!booking.propertyId || !booking.userId) {
                  console.warn('Booking missing propertyId or userId:', booking._id)
                  return null
                }

                const property = booking.propertyId
                const user = booking.userId
                const propertyImage = property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
                const location = property.location || {}
                const addressParts = [
                  property.district || location.district,
                  property.thana || location.thana,
                  property.area || location.area,
                  property.road || location.road
                ].filter(Boolean)

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

                        {/* Booking Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                                {property.title || 'Untitled Property'}
                              </h3>
                              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                                by {user.name || 'Unknown User'}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              {addressParts.length > 0 && (
                                <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                                  <i className="bi bi-geo-alt"></i>
                                  <span>{addressParts.join(', ')}</span>
                                </div>
                              )}
                              {property.type && (
                                <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                                  <i className="bi bi-tag"></i>
                                  <span>{property.type === 'flat' ? 'Apartment' : 'Land'}</span>
                                </div>
                              )}
                              {property.price && (
                                <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                                  <i className="bi bi-wallet2"></i>
                                  <span>{formatPrice(property.price)}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              {user.email && (
                                <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                                  <i className="bi bi-person"></i>
                                  <span>{user.email}</span>
                                </div>
                              )}
                              {user.phone && (
                                <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                                  <i className="bi bi-telephone"></i>
                                  <span>{user.phone}</span>
                                </div>
                              )}
                              {booking.age && (
                                <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                                  <i className="bi bi-clock"></i>
                                  <span>{booking.age}</span>
                                </div>
                              )}
                            </div>
                          </div>

                        {booking.message && (
                          <div className="mb-4 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                            <p className="text-sm text-secondary-700 dark:text-secondary-300">
                              <strong>Message:</strong> {booking.message}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleViewBooking(booking)}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                          >
                            <i className="bi bi-eye mr-2"></i>
                            View Details
                          </button>
                          {property._id && (
                            <Link
                              to={`/property/${property._id}`}
                              className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-700 dark:hover:bg-secondary-600 text-secondary-700 dark:text-secondary-300 text-sm font-medium rounded-lg transition-colors duration-200"
                            >
                              <i className="bi bi-house mr-2"></i>
                              View Property
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                )
              }).filter(Boolean)}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-calendar-x text-4xl text-secondary-400"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                No Bookings Found
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                {statusFilter ? `No ${statusFilter.toLowerCase()} bookings at the moment.` : 'No booking requests have been submitted yet.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-secondary-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  Booking Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 bg-secondary-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Property Info */}
                {selectedBooking.propertyId && (
                  <div className="flex space-x-4">
                    <img
                      src={selectedBooking.propertyId.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'}
                      alt={selectedBooking.propertyId.title || 'Property'}
                      crossOrigin="anonymous"
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                        {selectedBooking.propertyId.title || 'Untitled Property'}
                      </h3>
                      {(selectedBooking.propertyId.district || selectedBooking.propertyId.location) && (
                        <p className="text-secondary-600 dark:text-secondary-400">
                          {[
                            selectedBooking.propertyId.district || selectedBooking.propertyId.location?.district,
                            selectedBooking.propertyId.thana || selectedBooking.propertyId.location?.thana,
                            selectedBooking.propertyId.area || selectedBooking.propertyId.location?.area,
                            selectedBooking.propertyId.road || selectedBooking.propertyId.location?.road
                          ].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {selectedBooking.propertyId.price && (
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {formatPrice(selectedBooking.propertyId.price)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Customer Info */}
                {selectedBooking.userId && (
                  <div className="card p-4">
                    <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                      Customer Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedBooking.userId.name && (
                        <div>
                          <p className="text-sm text-secondary-600 dark:text-secondary-400">Name</p>
                          <p className="font-medium text-secondary-900 dark:text-secondary-100">
                            {selectedBooking.userId.name}
                          </p>
                        </div>
                      )}
                      {selectedBooking.userId.email && (
                        <div>
                          <p className="text-sm text-secondary-600 dark:text-secondary-400">Email</p>
                          <p className="font-medium text-secondary-900 dark:text-secondary-100">
                            {selectedBooking.userId.email}
                          </p>
                        </div>
                      )}
                      {selectedBooking.userId.phone && (
                        <div>
                          <p className="text-sm text-secondary-600 dark:text-secondary-400">Phone</p>
                          <p className="font-medium text-secondary-900 dark:text-secondary-100">
                            {selectedBooking.userId.phone}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Message */}
                {selectedBooking.message && (
                  <div className="card p-4">
                    <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                      Customer Message
                    </h4>
                    <p className="text-secondary-700 dark:text-secondary-300">
                      {selectedBooking.message}
                    </p>
                  </div>
                )}

                {/* Admin Notes */}
                <div className="card p-4">
                  <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                    Admin Notes
                  </h4>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="input-field"
                    placeholder="Add notes about this booking..."
                  />
                </div>

                {/* Action Buttons */}
                {selectedBooking.status === 'Pending' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => updateBookingStatus('Approved')}
                      disabled={submitting}
                      className="flex-1 px-4 py-3 bg-success-600 hover:bg-success-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <>
                          <i className="bi bi-check-lg mr-2"></i>
                          Approve Booking
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => updateBookingStatus('Rejected')}
                      disabled={submitting}
                      className="flex-1 px-4 py-3 bg-error-600 hover:bg-error-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="bi bi-x-lg mr-2"></i>
                      Reject Booking
                    </button>
                  </div>
                )}

                {selectedBooking.status !== 'Pending' && (
                  <div className="text-center py-4">
                    <p className="text-secondary-600 dark:text-secondary-400">
                      This booking has been {selectedBooking.status.toLowerCase()}.
                      {selectedBooking.respondedAt && (
                        <span className="block text-sm mt-1">
                          Responded on {new Date(selectedBooking.respondedAt).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminBookings
