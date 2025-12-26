// src/hooks/useAuth.js

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { axiosInstance } from '../lib/axios';

export const useAuth = () => {
  // 1. Khởi tạo user từ localStorage để tránh bị null khi reload trang
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

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
          
          // 2. Bọc fetchEmployeeInfo trong try-catch riêng để không làm logout user nếu lỗi
          try {
            await fetchEmployeeInfo(response);
          } catch (empErr) {
            console.warn("⚠️ fetchEmployeeInfo failed but User is valid:", empErr);
            // Không logout ở đây, vì user vẫn hợp lệ
          }
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

  // Cập nhật logic check role: Hỗ trợ cả chuỗi và số (0: Admin, 2: HR, 3: Accountant)
  // Sử dụng == để so sánh lỏng (loose equality) tránh lỗi kiểu dữ liệu (string vs number)
  const isSuperAdmin = user?.role === 'ADMIN' || user?.role == 0 || user?.roles?.includes('ADMIN');
  const isHr = user?.role === 'HR' || user?.role == 2 || user?.roles?.includes('HR');
  const isAccountant = user?.role === 'ACCOUNTANT' || user?.role == 3 || user?.roles?.includes('ACCOUNTANT');

  // Mở rộng quyền isAdmin để bao gồm HR và Accountant (cho phép truy cập dashboard)
  const isAdmin = isSuperAdmin || isHr || isAccountant;

  // Phân quyền chức năng (để ẩn/hiện menu và giao diện)
  const canAccessHR = isSuperAdmin || isHr;
  const canAccessPayroll = isSuperAdmin || isAccountant;
  const canAccessAttendance = isSuperAdmin || isHr || isAccountant;

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
    isSuperAdmin,
    isHr,
    isAccountant,
    canAccessHR,
    canAccessPayroll,
    canAccessAttendance,
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