import { apiClient } from './api'
import { storage } from '../utils/storage'
import { STORAGE_KEYS } from '../constants'
import { axiosInstance } from '../lib/axios';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password
      })
      
      if (response.token) {
        storage.set(STORAGE_KEYS.AUTH_TOKEN, response.token)
        storage.set(STORAGE_KEYS.USER_INFO, response.user)
      }
      
      return response
    } catch (error) {
      throw error
    }
  },

  logout: () => {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN)
    storage.remove(STORAGE_KEYS.USER_INFO)
    storage.remove(STORAGE_KEYS.REMEMBER_ME)
  },

  getToken: () => {
    return storage.get(STORAGE_KEYS.AUTH_TOKEN)
  },

  getUser: () => {
    return storage.get(STORAGE_KEYS.USER_INFO)
  },

  isAuthenticated: () => {
    return !!storage.get(STORAGE_KEYS.AUTH_TOKEN)
  },

  getMe: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
