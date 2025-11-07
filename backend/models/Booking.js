import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property ID is required']
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Approved', 'Rejected'],
      message: 'Status must be Pending, Approved, or Rejected'
    },
    default: 'Pending'
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  contactPreference: {
    type: String,
    enum: ['email', 'phone', 'both'],
    default: 'both'
  },
  preferredContactTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'anytime'],
    default: 'anytime'
  },
  scheduledViewingDate: {
    type: Date
  },
  isViewed: {
    type: Boolean,
    default: false
  },
  viewedAt: {
    type: Date
  },
  respondedAt: {
    type: Date
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
bookingSchema.index({ userId: 1 })
bookingSchema.index({ propertyId: 1 })
bookingSchema.index({ status: 1 })
bookingSchema.index({ createdAt: -1 })
bookingSchema.index({ userId: 1, propertyId: 1 }, { unique: true }) // Prevent duplicate bookings

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  
  // Set respondedAt when status changes from Pending
  if (this.isModified('status') && this.status !== 'Pending' && !this.respondedAt) {
    this.respondedAt = Date.now()
  }
  
  next()
})

// Virtual for booking age
bookingSchema.virtual('age').get(function() {
  const now = new Date()
  const created = new Date(this.createdAt)
  const diffTime = Math.abs(now - created)
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  } else {
    const diffDays = Math.ceil(diffHours / 24)
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }
})

// Virtual for response time (if responded)
bookingSchema.virtual('responseTime').get(function() {
  if (!this.respondedAt) return null
  
  const created = new Date(this.createdAt)
  const responded = new Date(this.respondedAt)
  const diffTime = Math.abs(responded - created)
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'}`
  } else {
    const diffDays = Math.ceil(diffHours / 24)
    return `${diffDays} day${diffDays === 1 ? '' : 's'}`
  }
})

// Static method to find pending bookings
bookingSchema.statics.findPending = function() {
  return this.find({ status: 'Pending' })
    .populate('userId', 'name email phone')
    .populate('propertyId', 'title price location images')
    .sort({ createdAt: -1 })
}

// Static method to find user's bookings
bookingSchema.statics.findByUser = function(userId) {
  return this.find({ userId })
    .populate('propertyId', 'title price location images type')
    .sort({ createdAt: -1 })
}

// Static method to find property bookings
bookingSchema.statics.findByProperty = function(propertyId) {
  return this.find({ propertyId })
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 })
}

// Instance method to mark as viewed
bookingSchema.methods.markAsViewed = function() {
  if (!this.isViewed) {
    this.isViewed = true
    this.viewedAt = Date.now()
    return this.save()
  }
  return Promise.resolve(this)
}

// Instance method to update status
bookingSchema.methods.updateStatus = function(status, adminNotes = '', respondedBy = null) {
  this.status = status
  if (adminNotes) this.adminNotes = adminNotes
  if (respondedBy) this.respondedBy = respondedBy
  this.respondedAt = Date.now()
  return this.save()
}

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking
