import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter) params.append('role', roleFilter)
      if (statusFilter) params.append('isActive', statusFilter)
      
      const response = await axios.get(`/api/admin/users?${params.toString()}`)
      setUsers(response.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/toggle-status`)
      toast.success('User status updated successfully')
      fetchUsers()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user status'
      toast.error(message)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete user'
      toast.error(message)
    }
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-secondary text-secondary-900 dark:text-secondary-100 mb-2">
              Manage Users
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              View and manage user accounts
            </p>
          </div>

          {/* Filters */}
          <div className="card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"></i>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          {users.length > 0 ? (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50 dark:bg-secondary-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                    {users.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                              <i className="bi bi-person-fill text-white"></i>
                            </div>
                            <div>
                              <p className="font-medium text-secondary-900 dark:text-secondary-100">
                                {user.name}
                              </p>
                              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-secondary-900 dark:text-secondary-100">
                            {user.phone}
                          </p>
                          {user.lastLogin && (
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                              Last login: {new Date(user.lastLogin).toLocaleDateString()}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400' 
                              : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          }`}>
                            {user.role === 'admin' ? 'Administrator' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' 
                              : 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-secondary-900 dark:text-secondary-100">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleUserStatus(user._id)}
                              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors duration-200 ${
                                user.isActive
                                  ? 'bg-error-100 hover:bg-error-200 text-error-700 dark:bg-error-900/30 dark:hover:bg-error-900/50 dark:text-error-400'
                                  : 'bg-success-100 hover:bg-success-200 text-success-700 dark:bg-success-900/30 dark:hover:bg-success-900/50 dark:text-success-400'
                              }`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="px-3 py-1 bg-error-100 hover:bg-error-200 text-error-700 dark:bg-error-900/30 dark:hover:bg-error-900/50 dark:text-error-400 text-xs font-medium rounded-lg transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-people text-4xl text-secondary-400"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                No Users Found
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                {searchTerm || roleFilter || statusFilter 
                  ? 'No users match your current filters.' 
                  : 'No users have registered yet.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminUsers
