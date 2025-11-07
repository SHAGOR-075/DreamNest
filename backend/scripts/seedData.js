import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { config } from '../config/config.js'
import User from '../models/User.js'
import Property from '../models/Property.js'
import Booking from '../models/Booking.js'

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@dreamnest.com',
    password: 'admin123',
    phone: '+1-555-0001',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'user@dreamnest.com',
    password: 'user123',
    phone: '+1-555-0002',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '+1-555-0003',
    role: 'user'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    phone: '+1-555-0004',
    role: 'user'
  }
]

const properties = [
  {
    title: 'Luxury Downtown Apartment',
    description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views. Features modern amenities, hardwood floors, and a spacious balcony. Perfect for professionals or couples looking for urban living at its finest.',
    price: 450000,
    type: 'flat',
    location: 'Downtown, New York, NY',
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['2 Bedrooms', '2 Bathrooms', 'Balcony', 'City View'],
    amenities: ['Gym', 'Pool', 'Concierge', 'Parking'],
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    isFeatured: true
  },
  {
    title: 'Spacious Family Home',
    description: 'Perfect family home with 4 bedrooms and 3 bathrooms. Large backyard, modern kitchen, and quiet neighborhood. Close to schools and parks. Ideal for growing families.',
    price: 650000,
    type: 'flat',
    location: 'Suburbia, Los Angeles, CA',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['4 Bedrooms', '3 Bathrooms', 'Backyard', 'Garage'],
    amenities: ['Garden', 'Garage', 'Fireplace', 'Modern Kitchen'],
    area: 2500,
    bedrooms: 4,
    bathrooms: 3,
    isFeatured: true
  },
  {
    title: 'Prime Commercial Land',
    description: 'Excellent opportunity for commercial development. Located in a high-traffic area with great visibility. Zoned for mixed-use development. Perfect for retail, office, or residential projects.',
    price: 1200000,
    type: 'land',
    location: 'Business District, Chicago, IL',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['Commercial Zoning', 'High Traffic', 'Corner Lot'],
    amenities: ['Utilities Available', 'Road Access', 'Public Transport'],
    area: 5000
  },
  {
    title: 'Modern Studio Apartment',
    description: 'Stylish studio apartment perfect for young professionals. Open floor plan with modern fixtures and appliances. Located in trendy neighborhood with great nightlife and dining options.',
    price: 280000,
    type: 'flat',
    location: 'SoHo, New York, NY',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['Studio', '1 Bathroom', 'Modern Design', 'Open Plan'],
    amenities: ['Elevator', 'Laundry', 'Rooftop Access'],
    area: 600,
    bedrooms: 0,
    bathrooms: 1
  },
  {
    title: 'Residential Development Land',
    description: 'Perfect for residential development with approved plans for 20 single-family homes. Beautiful location with mountain views. All utilities available. Great investment opportunity.',
    price: 2500000,
    type: 'land',
    location: 'Mountain View, Denver, CO',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['Approved Plans', 'Mountain Views', '20 Home Sites'],
    amenities: ['Utilities Ready', 'Road Access', 'Scenic Views'],
    area: 15000,
    isFeatured: true
  },
  {
    title: 'Cozy Cottage by the Lake',
    description: 'Charming 3-bedroom cottage with direct lake access. Perfect for weekend getaways or year-round living. Features include a private dock, fireplace, and screened porch.',
    price: 380000,
    type: 'flat',
    location: 'Lake Tahoe, CA',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['3 Bedrooms', '2 Bathrooms', 'Lake Access', 'Private Dock'],
    amenities: ['Fireplace', 'Screened Porch', 'Boat Storage'],
    area: 1800,
    bedrooms: 3,
    bathrooms: 2
  }
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Property.deleteMany({})
    await Booking.deleteMany({})
    console.log('Cleared existing data')

    // Create users
    const createdUsers = []
    for (const userData of users) {
      const user = await User.create(userData)
      createdUsers.push(user)
      console.log(`Created user: ${user.email}`)
    }

    // Get admin user for property creation
    const adminUser = createdUsers.find(user => user.role === 'admin')

    // Create properties
    const createdProperties = []
    for (const propertyData of properties) {
      const property = await Property.create({
        ...propertyData,
        createdBy: adminUser._id
      })
      createdProperties.push(property)
      console.log(`Created property: ${property.title}`)
    }

    // Create sample bookings
    const regularUsers = createdUsers.filter(user => user.role === 'user')
    const sampleBookings = [
      {
        userId: regularUsers[0]._id,
        propertyId: createdProperties[0]._id,
        status: 'Pending',
        message: 'I am very interested in this property. Could we schedule a viewing?'
      },
      {
        userId: regularUsers[1]._id,
        propertyId: createdProperties[1]._id,
        status: 'Approved',
        message: 'This looks perfect for my family. When can we move in?',
        adminNotes: 'Great candidate, approved for viewing and purchase.',
        respondedBy: adminUser._id,
        respondedAt: new Date()
      },
      {
        userId: regularUsers[2]._id,
        propertyId: createdProperties[2]._id,
        status: 'Rejected',
        message: 'Interested in this commercial land for development.',
        adminNotes: 'Does not meet our development criteria.',
        respondedBy: adminUser._id,
        respondedAt: new Date()
      }
    ]

    for (const bookingData of sampleBookings) {
      const booking = await Booking.create(bookingData)
      console.log(`Created booking: ${booking._id}`)
    }

    console.log('\n✅ Database seeded successfully!')
    console.log('\n📧 Login Credentials:')
    console.log('Admin: admin@dreamnest.com / admin123')
    console.log('User: user@dreamnest.com / user123')
    console.log('\n🏠 Sample Properties Created:', createdProperties.length)
    console.log('👥 Sample Users Created:', createdUsers.length)
    console.log('📋 Sample Bookings Created:', sampleBookings.length)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\nDisconnected from MongoDB')
    process.exit(0)
  }
}

// Run the seed function
seedDatabase()
