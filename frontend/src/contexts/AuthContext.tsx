import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'admin'
}

interface LoginResult {
  otpRequired?: boolean
  message?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  verifyLoginOtp: (email: string, otp: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  verifyEmail: (email: string, otp: string) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Define logout function using useCallback so it's stable
  const logout = useCallback(() => {
    Cookies.remove('token')
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000'
    axios.defaults.withCredentials = true

    // Add request interceptor to include token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Add response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Only log out on 401 errors that are authentication-related
        // Skip logout for login/register endpoints to avoid infinite loops
        if (error.response?.status === 401) {
          const url = error.config?.url || ''
          const errorMessage = error.response?.data?.message || ''
          
          // Don't log out on auth endpoints (login, register, profile check)
          if (!url.includes('/api/users/login') && 
              !url.includes('/api/users/register') &&
              !url.includes('/api/users/profile')) {
            // Only log out if we have a token (meaning we were authenticated)
            // and the error is authentication-related
            const token = Cookies.get('token')
            if (token && (
              errorMessage.toLowerCase().includes('token') || 
              errorMessage.toLowerCase().includes('access denied') || 
              errorMessage.toLowerCase().includes('unauthorized') ||
              errorMessage.toLowerCase().includes('authentication') ||
              errorMessage.toLowerCase().includes('invalid token') ||
              errorMessage.toLowerCase().includes('token expired') ||
              errorMessage.toLowerCase().includes('no token provided')
            )) {
              logout()
              toast.error('Session expired. Please login again.')
            }
          }
        }
        return Promise.reject(error)
      }
    )

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [logout])

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await axios.get('/api/users/profile', { withCredentials: true })
      setUser(response.data.user)
    } catch (error) {
      console.error('Auth check failed:', error)
      Cookies.remove('token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await axios.post('/api/users/login', { email, password })
      const { user, token, otpRequired, message } = response.data

      // In case backend ever returns direct token (no 2FA)
      if (user && token && !otpRequired) {
        Cookies.set('token', token, { expires: 7 })
        setUser(user)
        toast.success(message || `Welcome back, ${user.name}!`)
        return { message }
      }

      // 2FA required: OTP sent to email
      if (otpRequired) {
        toast.success(message || 'We sent a login verification code to your email.')
        return { otpRequired: true, message }
      }

      // Fallback
      return { message }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const verifyLoginOtp = async (email: string, otp: string) => {
    try {
      const response = await axios.post('/api/users/login/verify-otp', { email, otp })
      const { user, token, message } = response.data

      Cookies.set('token', token, { expires: 7 })
      setUser(user)
      toast.success(message || `Welcome back, ${user.name}!`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login verification failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post('/api/users/register', userData)
      const { user, token } = response.data
      
      Cookies.set('token', token, { expires: 7 })
      setUser(user)
      toast.success(`Welcome to DreamNest, ${user.name}!`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const verifyEmail = async (email: string, otp: string) => {
    try {
      const response = await axios.post('/api/users/verify-email', { email, otp })
      const { user, token, message } = response.data

      if (token && user) {
        Cookies.set('token', token, { expires: 7 })
        setUser(user)
      }

      toast.success(message || 'Email verified successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email verification failed'
      toast.error(message)
      throw error
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await axios.put('/api/users/profile', userData)
      setUser(response.data.user)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    verifyLoginOtp,
    register,
    verifyEmail,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
