import { axiosInstance } from "../lib/axios";

/**
 * Service để quản lý các API liên quan đến Bảng lương.
 * Cập nhật dựa trên Swagger UI: /payrolls
 */
export const payrollService = {
  /**
   * [GET /payrolls]
   * Lấy danh sách bảng lương có lọc (Filter payrolls)
   * @param {object} params - Các tham số tìm kiếm (tháng, năm, v.v.)
   * @returns {Promise<object>} Danh sách bảng lương
   */
  getAllPayrolls: async (params) => {
    // Tự động chuyển object params thành query string (vd: ?month=10&year=2023)
    const queryString = new URLSearchParams(params).toString();
    return axiosInstance.get(`/payrolls?${queryString}`);
  },

  /**
   * [POST /payrolls]
   * Tạo bảng lương cho cả phòng ban (Create payroll for department)
   * @param {object} data - Dữ liệu tạo lương (thường gồm deptId, month, year)
   * @returns {Promise<object>} Kết quả tạo
   */
  createPayrollForDepartment: async (deptId, data) => {
    return axiosInstance.post(`/payrolls?deptId=${deptId}`, data);
  },

  /**
   * [POST /payrolls/single]
   * Tạo bảng lương đơn lẻ (Create single payroll)
   * @param {object} data - Dữ liệu tạo lương (thường gồm empId, month, year)
   * @returns {Promise<object>} Kết quả tạo
   */

  /**
   * [GET /payrolls/employee/{empId}]
   * Lấy lịch sử bảng lương của một nhân viên
   * @param {string|number} empId - ID của nhân viên
   * @returns {Promise<object>} Danh sách lương của nhân viên đó
   */
  getPayrollsByEmployee: async (empId) => {
    return axiosInstance.get(`/payrolls/employee/${empId}`);
  },
  
};