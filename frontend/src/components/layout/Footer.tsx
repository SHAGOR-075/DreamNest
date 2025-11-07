import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <i className="bi bi-house-heart-fill text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold font-secondary text-white">
                DreamNest
              </span>
            </div>
            <p className="text-secondary-400 mb-6 max-w-md">
              Your trusted partner in finding the perfect property. We connect dreams with reality through our premium real estate platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-secondary-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <i className="bi bi-facebook text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <i className="bi bi-twitter text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <i className="bi bi-instagram text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                <i className="bi bi-linkedin text-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-primary-400 transition-colors duration-200">
                  Properties
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-primary-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary-400 transition-colors duration-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <i className="bi bi-geo-alt text-primary-400"></i>
                <span className="text-sm">123 Real Estate St, City, State 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="bi bi-telephone text-primary-400"></i>
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="bi bi-envelope text-primary-400"></i>
                <span className="text-sm">info@dreamnest.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © 2024 DreamNest. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-200">
              Terms of Service
            </a>
            <span className="text-secondary-500 text-sm">
              Powered by <span className="text-primary-400 font-medium">Websparks AI</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
