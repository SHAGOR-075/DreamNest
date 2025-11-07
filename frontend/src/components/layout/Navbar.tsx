import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  const navLinks = user?.role === 'admin' ? [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/admin/properties', label: 'Properties', icon: 'bi-building' },
    { path: '/admin/bookings', label: 'Bookings', icon: 'bi-calendar-check' },
    { path: '/admin/users', label: 'Users', icon: 'bi-people' },
  ] : [
    { path: '/', label: 'Home', icon: 'bi-house' },
    { path: '/my-bookings', label: 'My Bookings', icon: 'bi-bookmark' },
    { path: '/profile', label: 'Profile', icon: 'bi-person' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <i className="bi bi-house-heart-fill text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold font-secondary bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              DreamNest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    <i className={`${link.icon} text-sm`}></i>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors duration-200"
              >
                <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} text-lg`}></i>
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-error-500 hover:bg-error-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300"
          >
            <i className={`bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700"
          >
            <div className="px-4 py-4 space-y-3">
              {user && navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-secondary-600 dark:text-secondary-300'
                  }`}
                >
                  <i className={`${link.icon} text-lg`}></i>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              <div className="pt-3 border-t border-secondary-200 dark:border-secondary-700">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 px-3 py-2 w-full text-left text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors duration-200"
                >
                  <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} text-lg`}></i>
                  <span>Toggle Theme</span>
                </button>

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 w-full text-left text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors duration-200 mt-2"
                  >
                    <i className="bi bi-box-arrow-right text-lg"></i>
                    <span>Logout</span>
                  </button>
                ) : (
                  <div className="space-y-2 mt-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-2 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center btn-primary"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
