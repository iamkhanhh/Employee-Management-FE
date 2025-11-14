import {axiosInstance} from "../lib/axios";
/**
 * Service để quản lý các API liên quan đến Nhân viên.
 */
export const employeeService = {
  /**
   * @param {object} params 
   * @returns {Promise<object>} 
   */
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
    // Nếu dữ liệu là FormData, sử dụng phương thức POST và thêm _method: 'PUT'
    // để hỗ trợ upload file khi cập nhật.
    if (employeeData instanceof FormData) {
      employeeData.append('_method', 'PUT');
      return axiosInstance.post(`/employees/${id}`, employeeData);
    }
    // Nếu là object JSON thông thường, sử dụng phương thức PUT.
    return axiosInstance.put(`/employees/${id}`, employeeData);
  },

  /**
   * Xóa một nhân viên.
   * @param {string|number} id - ID của nhân viên cần xóa.
   * @returns {Promise<object>} Thông báo thành công từ API.
   */
  deleteEmployee: async (id) => {
    return axiosInstance.delete(`/employees/${id}`);
  },
};