import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

// Map role → trang mặc định
const DEFAULT_REDIRECT_BY_ROLE = {
  ADMIN: '/admin',
  HR: '/admin',
  USER: '/profile',
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute user:', user);

  // 1. Loading spinner khi đang fetch user
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Nếu chưa đăng nhập → redirect login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role?.toUpperCase();

  // 3. Nếu role không được phép → redirect mặc định theo role
  if (allowedRoles && !allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
    const redirectPath = DEFAULT_REDIRECT_BY_ROLE[userRole] || '/login';
    return <Navigate to={redirectPath} replace />;
  }

  // 4. Nếu đã đăng nhập và role hợp lệ → render child routes
  return <Outlet />;
};

export default ProtectedRoute;
