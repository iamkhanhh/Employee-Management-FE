import {axiosInstance} from "../lib/axios";

/**
 * Service để quản lý các API liên quan đến Bảng lương.
 */
export const payrollService = {
  /**
   * Lấy danh sách bảng lương với phân trang và bộ lọc
   * @param {object} params - Các tham số tìm kiếm và phân trang
   * @returns {Promise<object>} Danh sách bảng lương
   */
  getAllPayrolls: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return axiosInstance.get(`/payrolls?${queryString}`);
  },

  /**
   * Lấy chi tiết một bảng lương theo ID
   * @param {string|number} id - ID của bảng lương
   * @returns {Promise<object>} Dữ liệu chi tiết của bảng lương
   */
  getPayrollById: async (id) => {
    return axiosInstance.get(`/payrolls/${id}`);
  },

  /**
   * Tạo mới một bảng lương
   * @param {FormData|object} payrollData - Dữ liệu bảng lương
   * @returns {Promise<object>} Dữ liệu bảng lương vừa tạo
   */
  createPayroll: async (payrollData) => {
    return axiosInstance.post('/payrolls', payrollData);
  },

  /**
   * Cập nhật một bảng lương
   * @param {string|number} id - ID của bảng lương
   * @param {object|FormData} payrollData - Dữ liệu bảng lương cần cập nhật
   * @returns {Promise<object>} Dữ liệu của bảng lương sau khi cập nhật
   */
  updatePayroll: async (id, payrollData) => {
    if (payrollData instanceof FormData) {
      payrollData.append('_method', 'PUT');
      return axiosInstance.post(`/payrolls/${id}`, payrollData);
    }
    return axiosInstance.put(`/payrolls/${id}`, payrollData);
  },

  /**
   * Xóa một bảng lương
   * @param {string|number} id - ID của bảng lương cần xóa
   * @returns {Promise<object>} Thông báo thành công từ API
   */
  deletePayroll: async (id) => {
    return axiosInstance.delete(`/payrolls/${id}`);
  },

  calculatePayroll: async (payrollData) => {
    return axiosInstance.post('/payrolls/calculate', payrollData);
  },

  updatePayrollBonusPenalty: async (id, data) => {
    return axiosInstance.put(`/payrolls/${id}/bonus-penalty`, data);
  },
};

