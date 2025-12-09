// src/hooks/useAuth.js

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { axiosInstance } from '../lib/axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // FETCH DEPARTMENTS
  // ═══════════════════════════════════════════════════════════════
  const fetchDepartments = useCallback(async () => {
    try {
      const deptRes = await axiosInstance.get('/departments');
      const deptList = deptRes.data?.data || [];
      setDepartments(deptList);
      console.log('📌 Departments loaded:', deptList.length);
      return deptList;
    } catch (deptErr) {
      console.warn('⚠️ Could not fetch departments:', deptErr);
      return [];
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // FETCH EMPLOYEE INFO
  // ═══════════════════════════════════════════════════════════════
  const fetchEmployeeInfo = useCallback(async (currentUser) => {
     console.log(">>> fetchEmployeeInfo CALLED with:", currentUser);
    const userRole = currentUser?.role;

    // Chỉ bỏ qua employee info cho Admin
    if (userRole === 'ADMIN') {
      console.log('User is ADMIN → skip employees/me');
      await fetchDepartments();
      return null;
    }

    try {
      console.log(">>> Calling /employees/me API...");
      const empRes = await axiosInstance.get('/employees/me');
      const empData = empRes.data?.data;

      if (empData) {
        setEmployeeInfo(empData);
        console.log('Employee Info loaded:', empData);

        const deptList = await fetchDepartments();
        const foundDept = deptList.find(d => d.deptName === empData.department);

        if (foundDept) setDepartmentId(foundDept.id);

        return empData;
      }

    } catch (err) {
      console.warn('Could not fetch employee info:', err);
      await fetchDepartments();
    }

    return null;
  }, [fetchDepartments]);


  // ═══════════════════════════════════════════════════════════════
  // FETCH USER
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await authService.getMe();
        if (response) {
          setUser(response);
          setIsAuthenticated(true);
          console.log('📌 User loaded:', response);
          await fetchEmployeeInfo(response);
        } else {
          setUser(null);
          setEmployeeInfo(null);
          setDepartmentId(null);
          setDepartments([]);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Fetch user error:', error);
        setUser(null);
        setEmployeeInfo(null);
        setDepartmentId(null);
        setDepartments([]);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [fetchEmployeeInfo]);

  // ═══════════════════════════════════════════════════════════════
  // LOGIN
  // ═══════════════════════════════════════════════════════════════
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      const userData = response.user;

      setUser(userData);
      setIsAuthenticated(true);
      await fetchEmployeeInfo(userData);

      return response;
    } catch (error) {
      throw error;
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // LOGOUT
  // ═══════════════════════════════════════════════════════════════
  const logout = () => {
    authService.logout();
    setUser(null);
    setEmployeeInfo(null);
    setDepartmentId(null);
    setDepartments([]);
    setIsAuthenticated(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // REFRESH
  // ═══════════════════════════════════════════════════════════════
  const refreshEmployeeInfo = async () => {
    if (user) {
      await fetchEmployeeInfo(user);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // COMPUTED VALUES
  // ═══════════════════════════════════════════════════════════════

  const isAdmin = user?.role === 'ADMIN';

  // ⭐ SỬA LỖI: roleInDept thay vì roleInDep
  const isHead = employeeInfo?.roleInDept === 'HEAD';

  const canManage = isAdmin || isHead;

  const fullName = employeeInfo?.fullName || user?.fullName || user?.username || '';

  const departmentName = employeeInfo?.department || '';

  // Debug log
  console.log('🔍 Auth State:', {
    isAdmin,
    isHead,
    canManage,
    roleInDept: employeeInfo?.roleInDept
  });

  return {
    user,
    employeeInfo,
    departmentId,
    departments,

    isLoading,
    isAuthenticated,

    isAdmin,
    isHead,
    canManage,
    fullName,
    departmentName,

    login,
    logout,
    refreshEmployeeInfo,
    refreshDepartments: fetchDepartments,
  };
};