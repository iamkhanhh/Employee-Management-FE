import { useState, useEffect, useCallback } from 'react';
import { 
  mockDepartments,
  mockEmployees,
  addDepartmentToMockData,
  updateDepartmentInMockData,
  deleteDepartmentFromMockData
} from '../data/mockData';

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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredDepartments = [...mockDepartments].filter(d => !d.is_deleted);
    
    // Add employee count and head info for each department
    filteredDepartments = filteredDepartments.map(dept => {
      const deptEmployees = mockEmployees.filter(
        emp => emp.dept_id === dept.id && emp.status === 'ACTIVE' && !emp.is_deleted
      );
      const head = deptEmployees.find(emp => emp.role_in_dept === 'HEAD');
      
      return {
        ...dept,
        employeeCount: deptEmployees.length,
        employees: deptEmployees,
        head: head,
        status: dept.is_deleted ? 'INACTIVE' : 'ACTIVE'
      };
    });
    
    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredDepartments = filteredDepartments.filter(d => 
        d.dept_name.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredDepartments = filteredDepartments.filter(d => {
        const deptStatus = d.status || 'ACTIVE';
        return filters.status === 'active' ? deptStatus === 'ACTIVE' : deptStatus === 'INACTIVE';
      });
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'name':
          filteredDepartments.sort((a, b) => a.dept_name.localeCompare(b.dept_name));
          break;
        case 'employeeCount':
          filteredDepartments.sort((a, b) => b.employeeCount - a.employeeCount);
          break;
        case 'createdDate':
          filteredDepartments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
      }
    }
    
    setDepartments(filteredDepartments);
    setStats(calculateStats(filteredDepartments));
    setLoading(false);
    
    return filteredDepartments;
  }, [calculateStats]);

  // Create new department
  const createDepartment = useCallback(async (departmentData) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDepartment = addDepartmentToMockData(departmentData);
      
      // Update local state
      setDepartments(prev => [...prev, newDepartment]);
      setStats(calculateStats([...departments, newDepartment]));
      
      return { success: true, data: newDepartment };
    } catch (error) {
      console.error('Error creating department:', error);
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