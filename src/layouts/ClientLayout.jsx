// src/layouts/ClientLayout.jsx
import React, { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Badge,
  Chip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  AccessTime as AccessTimeIcon,
  EventBusy as EventBusyIcon,
  Assessment as AssessmentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Home as HomeIcon,
  WorkOutline as WorkOutlineIcon,
} from '@mui/icons-material';

import { useAuth } from '../hooks/useAuth';

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

// Màu sáng chủ đạo
const primaryColor = '#3b82f6';
const primaryLight = '#eff6ff';
const primaryDark = '#1d4ed8';

const ClientLayout = () => {
  const { user, canManage, fullName, logout } = useAuth();
  const [open, setOpen] = useState(true);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const currentDrawerWidth = open ? drawerWidth : collapsedDrawerWidth;

  const handleDrawerToggle = () => setOpen(!open);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate("/login");
  };

  const getPageTitle = (path) => {
    const titles = {
      "/profile": "My Profile",
      "/my-attendance": "My Attendance",
      "/leave-requests": "Leave Requests",
      "/my-kpi": "My KPI",
      "/notifications": "Notifications",
    };
    return titles[path] || "Dashboard";
  };

  const navItems = [
    { text: "My Profile", icon: <PersonIcon />, path: "/profile" },
    { text: "My Attendance", icon: <AccessTimeIcon />, path: "/my-attendance" },
    { text: "Leave Requests", icon: <EventBusyIcon />, path: "/leave-requests" },
    { text: "My KPI", icon: <AssessmentIcon />, path: "/my-kpi" },
    { text: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
  ];

  // Menu item styles
  const menuItemStyles = {
    mx: 1.5,
    mb: 0.5,
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryDark} 100%)`,
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
      '& .MuiListItemIcon-root': { color: '#ffffff' },
      '& .MuiListItemText-primary': { color: '#ffffff', fontWeight: 600 },
      '&:hover': {
        background: `linear-gradient(135deg, ${primaryDark} 0%, #1e40af 100%)`,
      },
    },
    '&:hover': {
      backgroundColor: primaryLight,
      transform: 'translateX(4px)',
    },
    '& .MuiListItemIcon-root': {
      color: '#64748b',
      minWidth: 44,
    },
    '& .MuiListItemText-primary': {
      color: '#334155',
      fontWeight: 500,
      fontSize: '0.95rem',
    },
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important', px: { xs: 2, sm: 3 } }}>
          {/* Logo Section */}
          <Box
            sx={{
              width: currentDrawerWidth - 24,
              display: 'flex',
              alignItems: 'center',
              transition: 'width 0.3s ease',
              flexShrink: 0,
            }}
          >
            {/* Toggle Button */}
            <Tooltip title={open ? "Thu gọn menu" : "Mở rộng menu"}>
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  mr: open ? 2 : 0,
                  color: primaryColor,
                  bgcolor: primaryLight,
                  '&:hover': { bgcolor: '#dbeafe' },
                }}
              >
                {open ? <MenuOpenIcon /> : <MenuIcon />}
              </IconButton>
            </Tooltip>
            {/* Page Title */}
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {getPageTitle(location.pathname)}
            </Typography>
          </Box>




          <Box sx={{ flexGrow: 1 }} />

          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            {/* User Name & Role */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600 }}>
                {fullName || 'User'}
              </Typography>
              <Chip
                label={canManage ? 'Head' : 'Employee'}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: canManage ? '#fef3c7' : primaryLight,
                  color: canManage ? '#d97706' : primaryColor,
                }}
              />
            </Box>

            {/* Avatar */}
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0.5,
                border: `2px solid ${primaryLight}`,
                transition: 'all 0.2s',
                '&:hover': {
                  border: `2px solid ${primaryColor}`,
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryDark} 100%)`,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}
              >
                {fullName?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            {/* User Menu */}
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  minWidth: 240,
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 20,
                    width: 12,
                    height: 12,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    borderLeft: '1px solid #e2e8f0',
                    borderTop: '1px solid #e2e8f0',
                  },
                },
              }}
            >
              {/* User Info Header */}
              <Box sx={{ px: 2.5, py: 2, background: primaryLight, borderRadius: '12px 12px 0 0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {fullName || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {user?.email || 'user@company.com'}
                </Typography>
              </Box>

              <Box sx={{ py: 1 }}>
                <MenuItem
                  onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}
                  sx={{
                    py: 1.5,
                    mx: 1,
                    borderRadius: 2,
                    '&:hover': { bgcolor: primaryLight },
                  }}
                >
                  <PersonIcon fontSize="small" sx={{ mr: 1.5, color: primaryColor }} />
                  <Typography variant="body2" fontWeight={500}>My Profile</Typography>
                </MenuItem>

                {canManage && (
                  <MenuItem
                    onClick={() => { handleCloseUserMenu(); navigate('/admin/dashboard'); }}
                    sx={{
                      py: 1.5,
                      mx: 1,
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#fef3c7' },
                    }}
                  >
                    <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1.5, color: '#d97706' }} />
                    <Typography variant="body2" fontWeight={500}>Admin Dashboard</Typography>
                  </MenuItem>
                )}
              </Box>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  mx: 1,
                  mb: 1,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#fef2f2' },
                }}
              >
                <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: '#ef4444' }} />
                <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: currentDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: currentDrawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            borderRight: '1px solid #e2e8f0',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }} />

        {/* Navigation */}
        <Box sx={{ overflowY: 'auto', overflowX: 'hidden', py: 2, flex: 1 }}>
          {open && (
            <Typography
              variant="overline"
              sx={{
                px: 3,
                py: 1,
                display: 'block',
                color: '#94a3b8',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              NAVIGATION
            </Typography>
          )}

          <List component="nav">
            {navItems.map((item) => (
              <Tooltip
                key={item.path}
                title={!open ? item.text : ""}
                placement="right"
              >
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  selected={location.pathname.startsWith(item.path)}
                  sx={menuItemStyles}
                >
                  <ListItemIcon>
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} />}
                </ListItemButton>
              </Tooltip>
            ))}
          </List>

        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          minHeight: '100vh',
          width: `calc(100% - ${currentDrawerWidth}px)`,
          transition: 'width 0.3s ease',
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }} />

        {/* Page Content */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Breadcrumb Card */}
          <Box
            sx={{
              mb: 3,
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  color: primaryColor,
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => navigate('/profile')}
              >
                Home
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1' }}>/</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {getPageTitle(location.pathname)}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: '#94a3b8', display: { xs: 'none', sm: 'block' } }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>

          {/* Page Outlet */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ClientLayout;