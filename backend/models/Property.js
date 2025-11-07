import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price cannot be negative'],
    max: [100000000, 'Price cannot exceed $100,000,000']
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: {
      values: ['flat', 'land'],
      message: 'Property type must be either flat or land'
    }
  },
  location: {
    type: String,
    required: [true, 'Property location is required'],
    trim: true,
    minlength: [5, 'Location must be at least 5 characters long'],
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(url) {
        // Basic URL validation
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url)
      },
      message: 'Please provide valid image URLs'
    }
  }],
  features: [{
    type: String,
    trim: true,
    maxlength: [50, 'Feature cannot exceed 50 characters']
  }],
  amenities: [{
    type: String,
    trim: true,
    maxlength: [50, 'Amenity cannot exceed 50 characters']
  }],
  area: {
    type: Number,
    min: [0, 'Area cannot be negative']
  },
  bedrooms: {
    type: Number,
    min: [0, 'Bedrooms cannot be negative'],
    max: [20, 'Bedrooms cannot exceed 20']
  },
  bathrooms: {
    type: Number,
    min: [0, 'Bathrooms cannot be negative'],
    max: [20, 'Bathrooms cannot exceed 20']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better query performance
propertySchema.index({ type: 1 })
propertySchema.index({ price: 1 })
propertySchema.index({ location: 1 })
propertySchema.index({ isAvailable: 1 })
propertySchema.index({ isFeatured: 1 })
propertySchema.index({ createdAt: -1 })
propertySchema.index({ title: 'text', description: 'text', location: 'text' })

// Update the updatedAt field before saving
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(this.price)
})

// Virtual for property age
propertySchema.virtual('age').get(function() {
  const now = new Date()
  const created = new Date(this.createdAt)
  const diffTime = Math.abs(now - created)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months === 1 ? '' : 's'} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} year${years === 1 ? '' : 's'} ago`
  }
})

// Static method to find available properties
propertySchema.statics.findAvailable = function() {
  return this.find({ isAvailable: true }).sort({ createdAt: -1 })
}

// Static method to find featured properties
propertySchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isAvailable: true }).sort({ createdAt: -1 })
}

// Instance method to increment views
propertySchema.methods.incrementViews = function() {
  this.views += 1
  return this.save()
}

const Property = mongoose.model('Property', propertySchema)

export default Property
