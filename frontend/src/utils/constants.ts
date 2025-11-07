export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/users/login',
  REGISTER: '/api/users/register',
  LOGOUT: '/api/users/logout',
  PROFILE: '/api/users/profile',
  
  // Properties
  PROPERTIES: '/api/properties',
  FEATURED_PROPERTIES: '/api/properties/featured',
  
  // Bookings
  BOOKINGS: '/api/bookings',
  MY_BOOKINGS: '/api/bookings/my',
  
  // Admin
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_BOOKINGS: '/api/admin/bookings',
  
  // Stats
  STATS: '/api/stats'
}

export const PROPERTY_TYPES = {
  FLAT: 'flat',
  LAND: 'land'
} as const

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
} as const

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
} as const

export const CONTACT_PREFERENCES = {
  EMAIL: 'email',
  PHONE: 'phone',
  BOTH: 'both'
} as const

export const CONTACT_TIMES = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  ANYTIME: 'anytime'
} as const
