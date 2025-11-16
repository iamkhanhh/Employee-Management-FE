import {axiosInstance} from "../lib/axios";

export const accountService = {
  getAccounts: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createAccount: async (accountData) => {
    try {
      const response = await axiosInstance.post('/users', accountData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateAccount: async (id, accountData) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, accountData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteAccount: async (id) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  toggleAccountLock: async (id) => {
    try {
      const response = await axiosInstance.put(`/users/${id}/toggle-lock`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
