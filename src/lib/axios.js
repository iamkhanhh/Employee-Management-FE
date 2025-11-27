import axios from "axios";
import { apiUrl } from "./utils";
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants';

export const axiosInstance = axios.create({
  baseURL: apiUrl.baseURL,
  withCredentials: true,
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);