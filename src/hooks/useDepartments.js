import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    totalEmployees: 0,
    avgEmployeesPerDept: 0,
    newThisMonth: 0,
    growthRate: 0
  });

  // Calculate stats
  const calculateStats = useCallback((departmentList) => {
    const activeDepts = departmentList.filter(d => !d.is_deleted);
    const totalEmps = activeDepts.reduce((sum, d) => sum + (d.employeeCount || 0), 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = activeDepts.filter(d => {
      const createdDate = new Date(d.createdAt);
      return createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear;
    }).length;

    return {
      total: activeDepts.length,
      totalEmployees: totalEmps,
      avgEmployeesPerDept: activeDepts.length > 0 ? Math.round(totalEmps / activeDepts.length) : 0,
      newThisMonth: newThisMonth,
      growthRate: 15
    };
  }, []);

  // Fetch departments
  const fetchDepartments = useCallback(async (filters = {}) => {
    setLoading(true);

    try {
      const res = await axiosInstance.get("/departments");
      
      if (res.data.status === "success") {
        let data = res.data.data;

        // Apply filters
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          data = data.filter(d =>
            d.deptName.toLowerCase().includes(searchLower)
          );
        }

        setDepartments(data);
        setStats(calculateStats(data));
        return data;
      } else {
        toast.error(res.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
      return [];
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  // Fetch department detail
  const fetchDepartmentDetail = useCallback(async (id) => {
    if (!id) return null;

    try {
      const res = await axiosInstance.get(`/departments/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching department detail:", err);
      return null;
    }
  }, []);

  // Create new department
  const createDepartment = useCallback(async (departmentData) => {
    setLoading(true);
    try {
      const payload = {
        deptName: departmentData.deptName
      };

      const res = await axiosInstance.post("/departments", payload);
      
      if (res.data.code === 0 && res.data.status === "success") {
        const newDepartment = res.data.data;
        setDepartments(prev => [...prev, newDepartment]);
        setStats(calculateStats([...departments, newDepartment]));
        toast.success(res.data.message);
        return { success: true, data: newDepartment };
      }

      toast.error(res.data.message);
      return { success: false, error: res.data.message };

    } catch (error) {
      console.error("Error creating department:", error);
      const errorMsg = error.response?.data?.message || "Failed to create department";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [departments, calculateStats]);

  // ✅ SỬA LẠI UPDATE DEPARTMENT - CALL API THẬT
  const updateDepartment = useCallback(async (id, updates) => {
    setLoading(true);

    try {
      // Chuẩn bị payload theo đúng format API
      const payload = {
        deptName: updates.deptName
      };

      // Call API PUT
      const res = await axiosInstance.put(`/departments/${id}`, payload);

      // Kiểm tra response
      if (res.data.code === 0 && res.data.status === "success") {
        const updatedDepartment = res.data.data;
        
        // Update local state
        setDepartments(prev =>
          prev.map(d => d.id === id ? updatedDepartment : d)
        );
        
        // Recalculate stats với data mới
        const newDepartments = departments.map(d => d.id === id ? updatedDepartment : d);
        setStats(calculateStats(newDepartments));
        
        toast.success(res.data.message);
        return { success: true, data: updatedDepartment };
      }

      // Nếu API trả về lỗi
      toast.error(res.data.message);
      return { success: false, error: res.data.message };

    } catch (error) {
      console.error('Error updating department:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update department';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [departments, calculateStats]);

  const deleteDepartment = useCallback(async (id) => {
    setLoading(true);

    try {
      // Call API DELETE
      const res = await axiosInstance.delete(`/departments/${id}`);

      // Kiểm tra response
      if (res.data.code === 0 && res.data.status === "success") {
        // Remove department from local state
        setDepartments(prev => prev.filter(d => d.id !== id));
        
        // Recalculate stats
        const newDepartments = departments.filter(d => d.id !== id);
        setStats(calculateStats(newDepartments));
        
        toast.success(res.data.message || 'Department deleted successfully');
        return { success: true };
      }

      // Nếu API trả về lỗi (ví dụ: department có employees)
      toast.error(res.data.message);
      return { success: false, error: res.data.message };

    } catch (error) {
      console.error('Error deleting department:', error);
      
      // Xử lý error từ API
      const errorMsg = error.response?.data?.message || 'Failed to delete department';
      toast.error(errorMsg);
      
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [departments, calculateStats]);

  // ✅ DELETE MULTIPLE DEPARTMENTS
  const deleteMultipleDepartments = useCallback(async (ids) => {
    setLoading(true);

    try {
      // Call API DELETE cho từng department
      // Hoặc nếu backend hỗ trợ bulk delete: DELETE /departments với body là array of ids
      const deletePromises = ids.map(id => 
        axiosInstance.delete(`/departments/${id}`)
      );

      const results = await Promise.allSettled(deletePromises);

      // Kiểm tra kết quả
      const successCount = results.filter(r => 
        r.status === 'fulfilled' && 
        r.value.data.code === 0 && 
        r.value.data.status === 'success'
      ).length;

      const failCount = ids.length - successCount;

      if (successCount > 0) {
        // Remove deleted departments from state
        setDepartments(prev => prev.filter(d => !ids.includes(d.id)));
        
        // Recalculate stats
        const newDepartments = departments.filter(d => !ids.includes(d.id));
        setStats(calculateStats(newDepartments));
        
        if (failCount === 0) {
          toast.success(`Successfully deleted ${successCount} department(s)`);
        } else {
          toast.warning(`Deleted ${successCount} department(s), failed ${failCount}`);
        }
        
        return { success: true, successCount, failCount };
      }

      toast.error('Failed to delete departments');
      return { success: false, error: 'All deletions failed' };

    } catch (error) {
      console.error('Error deleting departments:', error);
      toast.error('Failed to delete departments');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [departments, calculateStats]);

  // Load initial data
  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    stats,
    loading,
    fetchDepartments,
    fetchDepartmentDetail,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    deleteMultipleDepartments
  };
};