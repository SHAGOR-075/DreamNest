import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
  loading?: boolean
}

interface SearchFilters {
  search: string
  type: string
  minPrice: string
  maxPrice: string
  location: string
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, loading = false }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters = {
      search: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      location: ''
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 mb-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Search Properties
            </label>
            <div className="relative">
              <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"></i>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Property Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="flat">Apartment</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Min Price
            </label>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Max Price
            </label>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Location
          </label>
          <div className="relative">
            <i className="bi bi-geo-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"></i>
            <input
              type="text"
              placeholder="Enter location..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <i className="bi bi-search"></i>
                <span>Search Properties</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <i className="bi bi-arrow-clockwise"></i>
            <span>Reset Filters</span>
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default SearchFilters
