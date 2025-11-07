import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'
import PropertyCard from '../components/ui/PropertyCard'
import SearchFilters from '../components/ui/SearchFilters'
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

interface SearchFilters {
  search: string
  type: string
  minPrice: string
  maxPrice: string
  district: string
  thana: string
  area: string
  road: string
}

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalBookings: 0
  })

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    fetchProperties()
    fetchStats()
  }, [])

  const fetchProperties = async (filters?: SearchFilters) => {
    try {
      setSearchLoading(true)
      const params = new URLSearchParams()
      
      if (filters) {
        if (filters.search) params.append('search', filters.search)
        if (filters.type) params.append('type', filters.type)
        if (filters.minPrice) params.append('minPrice', filters.minPrice)
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
        if (filters.district) params.append('district', filters.district)
        if (filters.thana) params.append('thana', filters.thana)
        if (filters.area) params.append('area', filters.area)
        if (filters.road) params.append('road', filters.road)
      }

      const response = await axios.get(`/api/properties?${params.toString()}`)
      setProperties(response.data.properties)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSearch = (filters: SearchFilters) => {
    fetchProperties(filters)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Real Estate"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/80 via-secondary-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-secondary text-white mb-6">
              Find Your
              <span className="block bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-secondary-200 mb-8 max-w-2xl mx-auto">
              Discover premium properties that match your lifestyle. From luxury apartments to prime land investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#properties"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4"
              >
                <i className="bi bi-search mr-2"></i>
                Explore Properties
              </motion.a>
              <motion.a
                href="#about"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-effect text-white border border-white/30 hover:bg-white/20 font-medium py-4 px-8 rounded-xl transition-all duration-300"
              >
                <i className="bi bi-play-circle mr-2"></i>
                Learn More
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/4 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent-500/20 rounded-full blur-xl"
        />
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-building text-2xl text-primary-600 dark:text-primary-400"></i>
              </div>
              <h3 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                {stats.totalProperties}+
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">Premium Properties</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-people text-2xl text-accent-600 dark:text-accent-400"></i>
              </div>
              <h3 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                {stats.totalUsers}+
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">Happy Clients</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-check-circle text-2xl text-success-600 dark:text-success-400"></i>
              </div>
              <h3 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                {stats.totalBookings}+
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">Successful Bookings</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-secondary text-secondary-900 dark:text-secondary-100 mb-4">
              Why Choose DreamNest?
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              We provide exceptional service and premium properties to help you find your perfect home.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'bi-shield-check',
                title: 'Verified Properties',
                description: 'All properties are thoroughly verified and authenticated for your peace of mind.'
              },
              {
                icon: 'bi-headset',
                title: '24/7 Support',
                description: 'Our dedicated team is available round the clock to assist you with any queries.'
              },
              {
                icon: 'bi-graph-up',
                title: 'Best Prices',
                description: 'Competitive pricing and transparent deals with no hidden charges.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-8 text-center group hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className={`${feature.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-20 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-secondary text-secondary-900 dark:text-secondary-100 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          <SearchFilters onSearch={handleSearch} loading={searchLoading} />

          {searchLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <PropertyCard key={property._id} property={property} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-house text-3xl text-secondary-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                No Properties Found
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Try adjusting your search filters to find more properties.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
