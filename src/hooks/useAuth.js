// src/hooks/useAuth.js
// → Phiên bản đã tích hợp Employee Info

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { axiosInstance } from '../lib/axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch Employee Info
  const fetchEmployeeInfo = useCallback(async () => {
    try {
      // 1. Fetch employee info
      const empRes = await axiosInstance.get('/employees/me');
      const empData = empRes.data?.data;
      
      if (empData) {
        setEmployeeInfo(empData);
        console.log('📌 Employee Info loaded:', empData);

        // 2. Nếu có department, lấy department ID
        if (empData.department) {
          try {
            const deptRes = await axiosInstance.get('/departments');
            const deptList = deptRes.data?.data || [];
            const foundDept = deptList.find(d => d.deptName === empData.department);
            
            if (foundDept) {
              setDepartmentId(foundDept.id);
              console.log('📌 Department ID:', foundDept.id);
            }
          } catch (deptErr) {
            console.warn('⚠️ Could not fetch departments:', deptErr);
          }
        }
      }
    } catch (err) {
      console.warn('⚠️ Could not fetch employee info:', err);
    }
  }, []);

  // Fetch User
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await authService.getMe();
        if (response) {
          setUser(response);
          setIsAuthenticated(true);
          
          // Sau khi có user, fetch employee info
          await fetchEmployeeInfo();
        } else {
          setUser(null);
          setEmployeeInfo(null);
          setDepartmentId(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setEmployeeInfo(null);
        setDepartmentId(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [fetchEmployeeInfo]);

  // Login
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Fetch employee info sau khi login
      await fetchEmployeeInfo();
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setEmployeeInfo(null);
    setDepartmentId(null);
    setIsAuthenticated(false);
  };

  // Refresh Employee Info (có thể gọi thủ công nếu cần)
  const refreshEmployeeInfo = async () => {
    await fetchEmployeeInfo();
  };

  // ═══════════════════════════════════════════════════════════════
  // COMPUTED VALUES - Tính toán sẵn để dùng ở mọi nơi
  // ═══════════════════════════════════════════════════════════════
  
  // Kiểm tra có phải trưởng phòng không
  const isHead = employeeInfo?.roleInDept === 'HEAD';
  
  // Kiểm tra có phải Admin/HR không
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR';
  
  // Tên đầy đủ (ưu tiên từ employee, fallback về user)
  const fullName = employeeInfo?.fullName || user?.fullName || user?.username || '';
  
  // Tên phòng ban
  const departmentName = employeeInfo?.department || '';

  return {
    // Dữ liệu gốc
    user,
    employeeInfo,
    departmentId,
    
    // Trạng thái
    isLoading,
    isAuthenticated,
    
    // Computed values
    isHead,
    isAdmin,
    fullName,
    departmentName,
    
    // Actions
    login,
    logout,
    refreshEmployeeInfo,
  };
};