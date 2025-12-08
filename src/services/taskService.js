import { axiosInstance } from "../lib/axios";

const TASK_API = "/tasks";

export const taskService = {
  createTask: async (data) => {
    try {
      const response = await axiosInstance.post(TASK_API, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  // 4. UPDATE TASK
  updateTask: async (taskId, data) => {
    try {
      const response = await axiosInstance.put(`${TASK_API}/${taskId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 5. DELETE TASK
  deleteTask: async (taskId) => {
    try {
      const response = await axiosInstance.delete(`${TASK_API}/${taskId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 6. ASSIGN TASK
  assignTask: async (taskId, employeeId) => {
    try {
      const response = await axiosInstance.post(`${TASK_API}/${taskId}/assign`, { employeeId });
      return response;
    } catch (error) {
      throw error;
    }
  },


  // 7. UPDATE STATUS
  updateStatus: async (taskId, status) => {
    try {
      const response = await axiosInstance.patch(`${TASK_API}/${taskId}/status`,{status});
      console.log("Update status response:", response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMyTasks: async (params) => {
    const cleanParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          cleanParams.append(key, value);
        }
      });
    }
    const queryString = cleanParams.toString();
    const url = queryString ? `${TASK_API}/me?${queryString}` : `${TASK_API}/me`;

    try {
      const response = await axiosInstance.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
