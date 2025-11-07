import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'

interface Property {
  _id: string
  title: string
  description: string
  price: number
  type: 'flat' | 'land'
  district: string
  thana: string
  area: string
  road: string
  images: string[]
  createdAt: string
}

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (id) {
      fetchProperty()
    }
  }, [id])

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/properties/${id}`)
      setProperty(response.data.property)
    } catch (error) {
      console.error('Error fetching property:', error)
      toast.error('Property not found')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book a property')
      navigate('/login')
      return
    }

    try {
      setBookingLoading(true)
      await axios.post('/api/bookings', { propertyId: id })
      toast.success('Booking request submitted successfully!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Booking failed'
      toast.error(message)
    } finally {
      setBookingLoading(false)
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

  if (!property) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-6xl text-secondary-400 mb-4"></i>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Property Not Found
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const images = property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  ]

  return (
    <div className="min-h-screen pt-16 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors duration-200"
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Properties</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={property.title}
                crossOrigin="anonymous"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <i className="bi bi-chevron-left text-secondary-900"></i>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <i className="bi bi-chevron-right text-secondary-900"></i>
                  </button>
                </>
              )}

              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.type === 'flat' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-accent-100 text-accent-700'
                }`}>
                  {property.type === 'flat' ? 'Apartment' : 'Land'}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                      currentImageIndex === index 
                        ? 'border-primary-500' 
                        : 'border-secondary-200 dark:border-secondary-700'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Property Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold font-secondary text-secondary-900 dark:text-secondary-100 mb-4">
                {property.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400">
                  <i className="bi bi-geo-alt"></i>
                  <span>{property.district}, {property.thana}, {property.area}, {property.road}</span>
                </div>
                <div className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400">
                  <i className="bi bi-calendar"></i>
                  <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-6">
                {formatPrice(property.price)}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                Description
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                {property.description}
              </p>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                Property Features
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <i className="bi bi-house text-primary-600 dark:text-primary-400"></i>
                  <span className="text-secondary-600 dark:text-secondary-400">
                    {property.type === 'flat' ? 'Apartment' : 'Land'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="bi bi-geo-alt text-primary-600 dark:text-primary-400"></i>
                  <span className="text-secondary-600 dark:text-secondary-400">Prime Location</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="bi bi-shield-check text-primary-600 dark:text-primary-400"></i>
                  <span className="text-secondary-600 dark:text-secondary-400">Verified Property</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="bi bi-star text-primary-600 dark:text-primary-400"></i>
                  <span className="text-secondary-600 dark:text-secondary-400">Premium Quality</span>
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                Interested in this property?
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Submit a booking request and our team will contact you within 24 hours to discuss the details.
              </p>
              
              {user ? (
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Request...</span>
                    </div>
                  ) : (
                    <>
                      <i className="bi bi-calendar-check mr-2"></i>
                      Book This Property
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Please login to book this property
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate('/login')}
                      className="flex-1 btn-primary"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="flex-1 btn-secondary"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="bi bi-telephone text-primary-600 dark:text-primary-400"></i>
                  <span className="text-secondary-600 dark:text-secondary-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="bi bi-envelope text-primary-600 dark:text-primary-400"></i>
                  <span className="text-secondary-600 dark:text-secondary-400">info@dreamnest.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="bi bi-clock text-primary-600 dark:text-primary-400"></i>
                  <span className="text-secondary-600 dark:text-secondary-400">Mon - Fri: 9AM - 6PM</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailsPage
