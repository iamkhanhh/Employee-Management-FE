import { useState, useEffect, useCallback } from 'react';
import {
  mockDepartments,
  mockEmployees,
  addDepartmentToMockData,
  updateDepartmentInMockData,
  deleteDepartmentFromMockData
} from '../data/mockData';
import { axiosInstance } from '../lib/axios';
import toast, { Toaster } from 'react-hot-toast';
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

    // Calculate new departments this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = activeDepts.filter(d => {
      const createdDate = new Date(d.created_at);
      return createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear;
    }).length;

    return {
      total: activeDepts.length,
      totalEmployees: totalEmps,
      avgEmployeesPerDept: activeDepts.length > 0 ? Math.round(totalEmps / activeDepts.length) : 0,
      newThisMonth: newThisMonth,
      growthRate: 15 // Mock growth rate
    };
  }, []);

  // Fetch departments with employee count
  const fetchDepartments = useCallback(async (filters = {}) => {
    setLoading(true);

    let data;
    const res = await axiosInstance.get("/departments");
    console.log(res);
    if (res.data.status == "success") {
      toast.success(res.data.message);
      data = res.data.data;
    }
    else {
      toast.error(res.data.message);
    }

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(d =>
        d.deptName.toLowerCase().includes(searchLower)
      );
    }


    setDepartments(data);
    setStats(calculateStats(data));
    setLoading(false);

    return data;
  }, [calculateStats]);

  // Create new department
  const createDepartment = useCallback(async (departmentData) => {
    setLoading(true);
    try {
      const payload = {
        deptName: departmentData.deptName
      };

      const res = await axiosInstance.post("/departments", payload);
      if (res.data.code === 0) {
        const newDepartment = res.data.data;
        setDepartments(prev => [...prev, newDepartment]);
        // Cập nhật thống kê
        setStats(calculateStats([...departments, newDepartment]));

        return { success: true, data: newDepartment };
      }

      return { success: false, error: res.data.message };

    } catch (error) {
      console.error("Error creating department:", error);
      return { success: false, error: error.message };

    } finally {
      setLoading(false);
    }
  }, [departments, calculateStats]);

  // Update department
  const updateDepartment = useCallback(async (id, updates) => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedDepartment = updateDepartmentInMockData(id, updates);

      if (updatedDepartment) {
        setDepartments(prev =>
          prev.map(d => d.id === id ? { ...updatedDepartment, ...updates } : d)
        );
        return { success: true, data: updatedDepartment };
      }

      throw new Error('Department not found');
    } catch (error) {
      console.error('Error updating department:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete department (soft delete)
  const deleteDepartment = useCallback(async (id) => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if department has employees
      const hasEmployees = mockEmployees.some(
        emp => emp.dept_id === id && emp.status === 'ACTIVE' && !emp.is_deleted
      );

      if (hasEmployees) {
        throw new Error('Không thể xóa phòng ban đang có nhân viên');
      }

      const success = deleteDepartmentFromMockData(id);

      if (success) {
        setDepartments(prev => prev.filter(d => d.id !== id));
        setStats(calculateStats(departments.filter(d => d.id !== id)));
        return { success: true };
      }

      throw new Error('Department not found');
    } catch (error) {
      console.error('Error deleting department:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [departments, calculateStats]);

  // Delete multiple departments
  const deleteMultipleDepartments = useCallback(async (ids) => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if any department has employees
      const hasEmployees = ids.some(id =>
        mockEmployees.some(emp => emp.dept_id === id && emp.status === 'ACTIVE' && !emp.is_deleted)
      );

      if (hasEmployees) {
        throw new Error('Một số phòng ban đang có nhân viên, không thể xóa');
      }

      ids.forEach(id => deleteDepartmentFromMockData(id));

      setDepartments(prev => prev.filter(d => !ids.includes(d.id)));
      setStats(calculateStats(departments.filter(d => !ids.includes(d.id))));

      return { success: true };
    } catch (error) {
      console.error('Error deleting departments:', error);
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
    createDepartment,
    updateDepartment,
    deleteDepartment,
    deleteMultipleDepartments
  };
};