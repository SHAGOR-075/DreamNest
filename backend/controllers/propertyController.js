import Property from '../models/Property.js'
import Booking from '../models/Booking.js'

// @desc    Get all properties with filtering and pagination
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const {
      search,
      type,
      minPrice,
      maxPrice,
      district,
      thana,
      area,
      road,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query

    // Build query
    let query = { isAvailable: true }

    // Search in title, description, and location fields
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { thana: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { road: { $regex: search, $options: 'i' } }
      ]
    }

    // Filter by type
    if (type) {
      query.type = type
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    // Filter by location fields
    if (district) {
      query.district = { $regex: district, $options: 'i' }
    }
    if (thana) {
      query.thana = { $regex: thana, $options: 'i' }
    }
    if (area) {
      query.area = { $regex: area, $options: 'i' }
    }
    if (road) {
      query.road = { $regex: road, $options: 'i' }
    }

    // Execute query with pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const properties = await Property.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)

    const total = await Property.countDocuments(query)

    res.json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      properties
    })
  } catch (error) {
    console.error('Get properties error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching properties'
    })
  }
}

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('createdBy', 'name email phone')

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      })
    }

    // Increment views
    await property.incrementViews()

    res.json({
      success: true,
      property
    })
  } catch (error) {
    console.error('Get property error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching property'
    })
  }
}

// @desc    Create property
// @route   POST /api/properties
// @access  Private (Admin only)
export const createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      createdBy: req.user._id
    }

    const property = await Property.create(propertyData)
    await property.populate('createdBy', 'name email')

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property
    })
  } catch (error) {
    console.error('Create property error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error creating property'
    })
  }
}

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Admin only)
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email')

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      })
    }

    res.json({
      success: true,
      message: 'Property updated successfully',
      property
    })
  } catch (error) {
    console.error('Update property error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error updating property'
    })
  }
}

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Admin only)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      })
    }

    // Check if there are any bookings for this property
    const bookings = await Booking.find({ propertyId: req.params.id })
    if (bookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete property with existing bookings'
      })
    }

    await Property.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Property deleted successfully'
    })
  } catch (error) {
    console.error('Delete property error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error deleting property'
    })
  }
}

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.findFeatured()
      .populate('createdBy', 'name email')
      .limit(6)

    res.json({
      success: true,
      count: properties.length,
      properties
    })
  } catch (error) {
    console.error('Get featured properties error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured properties'
    })
  }
}

// @desc    Toggle property availability
// @route   PATCH /api/properties/:id/availability
// @access  Private (Admin only)
export const togglePropertyAvailability = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      })
    }

    property.isAvailable = !property.isAvailable
    await property.save()

    res.json({
      success: true,
      message: `Property ${property.isAvailable ? 'activated' : 'deactivated'} successfully`,
      property
    })
  } catch (error) {
    console.error('Toggle property availability error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error updating property availability'
    })
  }
}

// @desc    Toggle featured status
// @route   PATCH /api/properties/:id/featured
// @access  Private (Admin only)
export const toggleFeaturedStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      })
    }

    property.isFeatured = !property.isFeatured
    await property.save()

    res.json({
      success: true,
      message: `Property ${property.isFeatured ? 'marked as featured' : 'removed from featured'} successfully`,
      property
    })
  } catch (error) {
    console.error('Toggle featured status error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error updating featured status'
    })
  }
}

// @desc    Get unique location values
// @route   GET /api/properties/locations
// @access  Public
export const getLocationValues = async (req, res) => {
  try {
    const properties = await Property.find({ isAvailable: true })
      .select('district thana area road')
      .lean()

    const districts = [...new Set(properties.map(p => p.district).filter(Boolean))].sort()
    const thanas = [...new Set(properties.map(p => p.thana).filter(Boolean))].sort()
    const areas = [...new Set(properties.map(p => p.area).filter(Boolean))].sort()
    const roads = [...new Set(properties.map(p => p.road).filter(Boolean))].sort()

    res.json({
      success: true,
      locations: {
        districts,
        thanas,
        areas,
        roads
      }
    })
  } catch (error) {
    console.error('Get location values error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching location values'
    })
  }
}
