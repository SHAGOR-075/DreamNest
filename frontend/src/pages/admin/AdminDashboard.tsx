import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

interface DashboardStats {
  totalProperties: number
  totalUsers: number
  totalBookings: number
  pendingBookings: number
  approvedBookings: number
  rejectedBookings: number
}

interface RecentBooking {
  _id: string
  userId: {
    name: string
    email: string
  }
  propertyId: {
    title: string
    price: number
  }
  status: string
  createdAt: string
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setError(null)
      setLoading(true)
      const [statsResponse, bookingsResponse] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/recent-bookings')
      ])
      
      // Validate and set stats
      if (statsResponse.data) {
        setStats({
          totalProperties: statsResponse.data.totalProperties || 0,
          totalUsers: statsResponse.data.totalUsers || 0,
          totalBookings: statsResponse.data.totalBookings || 0,
          pendingBookings: statsResponse.data.pendingBookings || 0,
          approvedBookings: statsResponse.data.approvedBookings || 0,
          rejectedBookings: statsResponse.data.rejectedBookings || 0
        })
      }
      
      // Validate and set recent bookings
      if (bookingsResponse.data && Array.isArray(bookingsResponse.data.bookings)) {
        setRecentBookings(bookingsResponse.data.bookings)
      } else {
        setRecentBookings([])
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      const errorMessage = error.response?.data?.message || 'Failed to load dashboard data. Please try again.'
      setError(errorMessage)
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

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: 'bi-building',
      color: 'from-primary-500 to-primary-700',
      link: '/admin/properties'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: 'bi-people',
      color: 'from-accent-500 to-accent-700',
      link: '/admin/users'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: 'bi-calendar-check',
      color: 'from-success-500 to-success-700',
      link: '/admin/bookings'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: 'bi-clock',
      color: 'from-orange-500 to-orange-700',
      link: '/admin/bookings?status=pending'
    }
  ]

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
              Admin Dashboard
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Overview of your real estate management system
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={card.link} className="block">
                  <div className="card p-6 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1">
                          {card.title}
                        </p>
                        <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                          {card.value}
                        </p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`${card.icon} text-white text-xl`}></i>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  Recent Bookings
                </h2>
                <Link
                  to="/admin/bookings"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors duration-200"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {error ? (
                  <div className="text-center py-8">
                    <i className="bi bi-exclamation-triangle text-4xl text-error-400 mb-2"></i>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">{error}</p>
                    <button
                      onClick={fetchDashboardData}
                      className="btn-primary"
                    >
                      <i className="bi bi-arrow-clockwise mr-2"></i>
                      Try Again
                    </button>
                  </div>
                ) : recentBookings.length > 0 ? (
                  recentBookings.slice(0, 5).map((booking) => {
                    // Safety check: skip bookings with missing data
                    if (!booking.propertyId || !booking.userId) {
                      console.warn('Booking missing propertyId or userId:', booking._id)
                      return null
                    }

                    const property = booking.propertyId
                    const user = booking.userId

                    return (
                      <div key={booking._id} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                            {property.title || 'Untitled Property'}
                          </p>
                          <p className="text-xs text-secondary-600 dark:text-secondary-400">
                            {user.name || 'Unknown User'} • {property.price ? formatPrice(property.price) : 'N/A'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className="text-xs text-secondary-500 dark:text-secondary-400">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )
                  }).filter(Boolean)
                ) : (
                  <div className="text-center py-8">
                    <i className="bi bi-calendar-x text-4xl text-secondary-400 mb-2"></i>
                    <p className="text-secondary-600 dark:text-secondary-400">No recent bookings</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Booking Status Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
                Booking Status Overview
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-accent-500 rounded-full"></div>
                    <span className="text-secondary-700 dark:text-secondary-300">Pending</span>
                  </div>
                  <span className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    {stats.pendingBookings}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-success-500 rounded-full"></div>
                    <span className="text-secondary-700 dark:text-secondary-300">Approved</span>
                  </div>
                  <span className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    {stats.approvedBookings}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-error-500 rounded-full"></div>
                    <span className="text-secondary-700 dark:text-secondary-300">Rejected</span>
                  </div>
                  <span className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    {stats.rejectedBookings}
                  </span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="mt-6 space-y-3">
                {stats.totalBookings > 0 && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary-600 dark:text-secondary-400">Pending</span>
                        <span className="text-secondary-600 dark:text-secondary-400">
                          {Math.round((stats.pendingBookings / stats.totalBookings) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                        <div
                          className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(stats.pendingBookings / stats.totalBookings) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary-600 dark:text-secondary-400">Approved</span>
                        <span className="text-secondary-600 dark:text-secondary-400">
                          {Math.round((stats.approvedBookings / stats.totalBookings) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                        <div
                          className="bg-success-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(stats.approvedBookings / stats.totalBookings) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/properties"
                className="card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <i className="bi bi-plus-lg text-primary-600 dark:text-primary-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">Add Property</h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">List a new property</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/bookings"
                className="card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <i className="bi bi-calendar-check text-accent-600 dark:text-accent-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">Manage Bookings</h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Review booking requests</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <i className="bi bi-people text-success-600 dark:text-success-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">View Users</h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Manage user accounts</p>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
