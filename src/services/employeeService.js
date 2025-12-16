import { axiosInstance } from "../lib/axios";
/**
 * Service để quản lý các API liên quan đến Nhân viên.
 */
export const employeeService = {
  /**
   * @param {object} params 
   * @returns {Promise<object>} 
   */

  getPerformanceStatistics: async () => {
    return axiosInstance.get('/employees/performance-statistics');
  },

  getAllEmployees: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return axiosInstance.get(`/employees?${queryString}`);
  },

  /**
   * @param {string|number} id - ID của nhân viên.
   * @returns {Promise<object>} Dữ liệu chi tiết của nhân viên.
   */
  getEmployeeById: async (id) => {
    return axiosInstance.get(`/employees/${id}`);
  },
  /**
   * @param {FormData} employeeData 
   * @returns {Promise<object>} 
   */
  createEmployee: async (employeeData) => {
    return axiosInstance.post('/employees', employeeData);
  },

  /**
   * @param {string|number} id 
   * @param {object|FormData} employeeData 
   * @returns {Promise<object>} Dữ liệu của nhân viên sau khi cập nhật.
   */
  updateEmployee: async (id, employeeData) => {
    return axiosInstance.put(`/employees/${id}`, employeeData);
  },
  deleteEmployee: async (id) => {
    return axiosInstance.delete(`/employees/${id}`);
  },
};