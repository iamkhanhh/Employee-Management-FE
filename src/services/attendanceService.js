import { axiosInstance } from "../lib/axios";

/**
 * Service to manage APIs related to Attendance.
 */
export const attendanceService = {
  /**
   * @param {object} params
   * @returns {Promise<object>}
   */
  getAllRecords: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return axiosInstance.get(`/attendance`);
  },

  /**
   * @param {string|number} id - ID of the attendance record.
   * @returns {Promise<object>} The detail data of the attendance record.
   */
  getRecordById: async (id) => {
    return axiosInstance.get(`/attendances/${id}`);
  },

  /**
   * @param {object} data
   * @returns {Promise<object>}
   */
  createRecord: async (data) => {
    return axiosInstance.post('/attendances', data);
  },

  /**
   * @param {string|number} id
   * @param {object} data
   * @returns {Promise<object>} The data of the attendance record after update.
   */
  updateRecord: async (id, data) => {
    return axiosInstance.put(`/attendances/${id}`, data);
  },

  /**
   * Deletes an attendance record.
   * @param {string|number} id - The ID of the attendance record to delete.
   * @returns {Promise<object>} A success message from the API.
   */
  deleteRecord: async (id) => {
    return axiosInstance.delete(`/attendances/${id}`);
  },
};
