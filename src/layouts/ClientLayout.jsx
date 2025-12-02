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
} from "@mui/material";
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  AccessTime as AccessTimeIcon,
  EventBusy as EventBusyIcon,
  Assessment as AssessmentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from '@mui/icons-material';

// DÙNG HOOK useAuth ĐÃ CÓ SẴN → CHUẨN NHẤT!
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 260;

const ClientLayout = () => {
  const { user, isAdmin, fullName, logout } = useAuth(); // ← LẤY ĐÚNG DỮ LIỆU TỪ /auth/me
  const [anchorElUser, setAnchorElUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
    };
    return titles[path] || "Dashboard";
  };

  const baseNavItems = [
    { text: "My Profile", icon: <PersonIcon />, path: "/profile" },
    { text: "My Attendance", icon: <AccessTimeIcon />, path: "/my-attendance" },
    { text: "Leave Requests", icon: <EventBusyIcon />, path: "/leave-requests" },
    { text: "My KPI", icon: <AssessmentIcon />, path: "/my-kpi" },
  ];

  // CHỈ THÊM MENU ADMIN NẾU LÀ ADMIN HOẶC HR
  const navItems = isAdmin 
    ? [...baseNavItems, { text: "Admin Panel", icon: <AdminPanelSettingsIcon />, path: "/admin/dashboard" }]
    : baseNavItems;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            color: "#1e293b",
            borderRight: "1px solid #e5e7eb",
          },
        }}
      >
        <Toolbar sx={{ 
          justifyContent: "center", 
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)", 
          minHeight: "70px !important" 
        }}>
          <Typography variant="h6" noWrap sx={{ fontWeight: "bold", color: "#ffffff" }}>
            EMPLOYEE PORTAL
          </Typography>
        </Toolbar>
        <Divider />

        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              selected={location.pathname.startsWith(item.path)}
              sx={{
                borderRadius: '0 25px 25px 0',
                mx: 1.5,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: '#dbeafe',
                  borderLeft: '5px solid #3b82f6',
                  '& .MuiListItemIcon-root': { color: '#1d4ed8' },
                  '& .MuiListItemText-primary': { fontWeight: 600, color: '#1d4ed8' },
                },
                '&:hover': { backgroundColor: '#f0f9ff' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 45, color: location.pathname.startsWith(item.path) ? '#1d4ed8' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Top Bar */}
        <AppBar position="static" elevation={0} sx={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
          <Toolbar sx={{ minHeight: '70px !important', justifyContent: 'flex-end' }}>
            <Tooltip title="Account">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar 
                  sx={{ 
                    width: 46, 
                    height: 46, 
                    bgcolor: '#3b82f6',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {fullName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              sx={{ mt: 6 }}
            >
              <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                <PersonIcon fontSize="small" sx={{ mr: 1.5 }} />
                My Profile
              </MenuItem>

              {isAdmin && (
                <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin/dashboard'); }}>
                  <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1.5 }} />
                  Admin
                </MenuItem>
              )}

              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 70px)', background: '#f8fafc' }}>
          <Box sx={{ mb: 4, p: 3, backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <Typography variant="h4" fontWeight={700} color="#1e293b">
              {getPageTitle(location.pathname)}
            </Typography>
          </Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ClientLayout;