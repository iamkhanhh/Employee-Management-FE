// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// App constants
export const APP_NAME = 'Employee Management System'
export const APP_VERSION = '1.0.0'

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  REMEMBER_ME: 'remember_me'
}

// Route paths
export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  DEPARTMENTS: '/departments'
}

