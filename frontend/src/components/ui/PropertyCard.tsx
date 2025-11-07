import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

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

interface PropertyCardProps {
  property: Property
  index?: number
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index = 0 }) => {
  const formatPrice = (price: number) => {
    return `TK ${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
    }).format(price)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}
          alt={property.title}
          crossOrigin="anonymous"
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            property.type === 'flat' 
              ? 'bg-primary-100 text-primary-700' 
              : 'bg-accent-100 text-accent-700'
          }`}>
            {property.type === 'flat' ? 'Apartment' : 'Land'}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-bold text-secondary-900">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <i className="bi bi-geo-alt text-secondary-500"></i>
          <span className="text-sm text-secondary-600 dark:text-secondary-400">
            {property.district}, {property.thana}, {property.area}, {property.road}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
          {property.title}
        </h3>

        <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-secondary-500">
            <span className="flex items-center space-x-1">
              <i className="bi bi-calendar"></i>
              <span>{new Date(property.createdAt).toLocaleDateString()}</span>
            </span>
          </div>

          <Link
            to={`/property/${property._id}`}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <span>View Details</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyCard
