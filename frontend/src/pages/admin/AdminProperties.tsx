import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

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
  isAvailable: boolean
  isFeatured: boolean
  views: number
  createdAt: string
}

interface PropertyForm {
  title: string
  description: string
  price: number
  type: 'flat' | 'land'
  district: string
  thana: string
  area: string
  road: string
  images: string
  features: string
  amenities: string
  propertyArea?: number
  bedrooms?: number
  bathrooms?: number
}

const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PropertyForm>()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await axios.get('/api/properties?limit=100')
      setProperties(response.data.properties)
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProperty = () => {
    setEditingProperty(null)
    reset()
    setShowModal(true)
  }

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    setValue('title', property.title)
    setValue('description', property.description)
    setValue('price', property.price)
    setValue('type', property.type)
    setValue('district', property.district)
    setValue('thana', property.thana)
    setValue('area', property.area)
    setValue('road', property.road)
    setValue('images', property.images.join(', '))
    setShowModal(true)
  }

  const onSubmit = async (data: PropertyForm) => {
    try {
      setSubmitting(true)
      
      const propertyData = {
        ...data,
        images: data.images.split(',').map(img => img.trim()).filter(img => img),
        features: data.features ? data.features.split(',').map(f => f.trim()).filter(f => f) : [],
        amenities: data.amenities ? data.amenities.split(',').map(a => a.trim()).filter(a => a) : []
      }

      if (editingProperty) {
        await axios.put(`/api/properties/${editingProperty._id}`, propertyData)
        toast.success('Property updated successfully')
      } else {
        await axios.post('/api/properties', propertyData)
        toast.success('Property created successfully')
      }

      setShowModal(false)
      reset()
      fetchProperties()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Operation failed'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleAvailability = async (propertyId: string) => {
    try {
      await axios.patch(`/api/properties/${propertyId}/availability`)
      toast.success('Property availability updated')
      fetchProperties()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update availability'
      toast.error(message)
    }
  }

  const toggleFeatured = async (propertyId: string) => {
    try {
      await axios.patch(`/api/properties/${propertyId}/featured`)
      toast.success('Featured status updated')
      fetchProperties()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update featured status'
      toast.error(message)
    }
  }

  const deleteProperty = async (propertyId: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return
    }

    try {
      await axios.delete(`/api/properties/${propertyId}`)
      toast.success('Property deleted successfully')
      fetchProperties()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete property'
      toast.error(message)
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-secondary text-secondary-900 dark:text-secondary-100 mb-2">
                Manage Properties
              </h1>
              <p className="text-secondary-600 dark:text-secondary-400">
                Create, edit, and manage property listings
              </p>
            </div>
            <button
              onClick={handleCreateProperty}
              className="btn-primary"
            >
              <i className="bi bi-plus-lg mr-2"></i>
              Add Property
            </button>
          </div>

          {/* Properties Grid */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={property.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                      alt={property.title}
                      crossOrigin="anonymous"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.type === 'flat' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'bg-accent-100 text-accent-700'
                      }`}>
                        {property.type === 'flat' ? 'Apartment' : 'Land'}
                      </span>
                      {property.isFeatured && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.isAvailable 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-error-100 text-error-700'
                      }`}>
                        {property.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="bi bi-geo-alt text-secondary-500"></i>
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        {property.district}, {property.thana}, {property.area}, {property.road}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                      {property.title}
                    </h3>

                    <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(property.price)}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-secondary-500">
                        <i className="bi bi-eye"></i>
                        <span>{property.views} views</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEditProperty(property)}
                        className="flex-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors duration-200"
                      >
                        <i className="bi bi-pencil mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => toggleAvailability(property._id)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          property.isAvailable
                            ? 'bg-error-100 hover:bg-error-200 text-error-700'
                            : 'bg-success-100 hover:bg-success-200 text-success-700'
                        }`}
                      >
                        <i className={`bi ${property.isAvailable ? 'bi-eye-slash' : 'bi-eye'} mr-1`}></i>
                        {property.isAvailable ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => toggleFeatured(property._id)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          property.isFeatured
                            ? 'bg-accent-100 hover:bg-accent-200 text-accent-700'
                            : 'bg-secondary-100 hover:bg-secondary-200 text-secondary-700'
                        }`}
                      >
                        <i className={`bi ${property.isFeatured ? 'bi-star-fill' : 'bi-star'} mr-1`}></i>
                      </button>
                      <button
                        onClick={() => deleteProperty(property._id)}
                        className="px-3 py-2 bg-error-100 hover:bg-error-200 text-error-700 text-sm rounded-lg transition-colors duration-200"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-building text-4xl text-secondary-400"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                No Properties Yet
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-8">
                Start by creating your first property listing
              </p>
              <button
                onClick={handleCreateProperty}
                className="btn-primary"
              >
                <i className="bi bi-plus-lg mr-2"></i>
                Create First Property
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Property Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-secondary-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {editingProperty ? 'Edit Property' : 'Create Property'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 bg-secondary-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Property Title
                    </label>
                    <input
                      type="text"
                      {...register('title', { 
                        required: 'Title is required',
                        minLength: { value: 5, message: 'Title must be at least 5 characters' }
                      })}
                      className="input-field"
                      placeholder="Enter property title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-error-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Price (TK)
                    </label>
                    <input
                      type="number"
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0, message: 'Price must be positive' }
                      })}
                      className="input-field"
                      placeholder="Enter price"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-error-500">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Property Type
                    </label>
                    <select
                      {...register('type', { required: 'Type is required' })}
                      className="input-field"
                    >
                      <option value="">Select type</option>
                      <option value="flat">Apartment</option>
                      <option value="land">Land</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-error-500">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      District
                    </label>
                    <input
                      type="text"
                      {...register('district', { 
                        required: 'District is required',
                        minLength: { value: 2, message: 'District must be at least 2 characters' }
                      })}
                      className="input-field"
                      placeholder="Enter district"
                    />
                    {errors.district && (
                      <p className="mt-1 text-sm text-error-500">{errors.district.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Thana
                    </label>
                    <input
                      type="text"
                      {...register('thana', { 
                        required: 'Thana is required',
                        minLength: { value: 2, message: 'Thana must be at least 2 characters' }
                      })}
                      className="input-field"
                      placeholder="Enter thana"
                    />
                    {errors.thana && (
                      <p className="mt-1 text-sm text-error-500">{errors.thana.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Area
                    </label>
                    <input
                      type="text"
                      {...register('area', { 
                        required: 'Area is required',
                        minLength: { value: 2, message: 'Area must be at least 2 characters' }
                      })}
                      className="input-field"
                      placeholder="Enter area"
                    />
                    {errors.area && (
                      <p className="mt-1 text-sm text-error-500">{errors.area.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Road
                    </label>
                    <input
                      type="text"
                      {...register('road', { 
                        required: 'Road is required',
                        minLength: { value: 2, message: 'Road must be at least 2 characters' }
                      })}
                      className="input-field"
                      placeholder="Enter road"
                    />
                    {errors.road && (
                      <p className="mt-1 text-sm text-error-500">{errors.road.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register('description', { 
                        required: 'Description is required',
                        minLength: { value: 20, message: 'Description must be at least 20 characters' }
                      })}
                      rows={4}
                      className="input-field"
                      placeholder="Enter property description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-error-500">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Images (comma-separated URLs)
                    </label>
                    <textarea
                      {...register('images')}
                      rows={3}
                      className="input-field"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Features (comma-separated)
                    </label>
                    <input
                      type="text"
                      {...register('features')}
                      className="input-field"
                      placeholder="2 Bedrooms, Balcony, City View"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Amenities (comma-separated)
                    </label>
                    <input
                      type="text"
                      {...register('amenities')}
                      className="input-field"
                      placeholder="Gym, Pool, Parking"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Property Area (sq ft)
                    </label>
                    <input
                      type="number"
                      {...register('propertyArea')}
                      className="input-field"
                      placeholder="Enter property area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      {...register('bedrooms')}
                      className="input-field"
                      placeholder="Number of bedrooms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      {...register('bathrooms')}
                      className="input-field"
                      placeholder="Number of bathrooms"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{editingProperty ? 'Updating...' : 'Creating...'}</span>
                      </div>
                    ) : (
                      <>
                        <i className="bi bi-check-lg mr-2"></i>
                        {editingProperty ? 'Update Property' : 'Create Property'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminProperties
