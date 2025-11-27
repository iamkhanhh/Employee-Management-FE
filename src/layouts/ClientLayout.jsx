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
} from '@mui/icons-material';

const drawerWidth = 260;

const ClientLayout = () => {
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
    navigate("/login");
  };
  
  const getPageTitle = (path) => {
    if (path.startsWith("/profile")) {
        return "My Profile";
    }
    switch (path) {
        case "/my-attendance":
            return "My Attendance";
        case "/leave-requests":
            return "Leave Requests";
        default:
            return "";
    }
  };

  const navItems = [
    {
      text: "My Profile",
      icon: <PersonIcon />,
      path: "/profile",
    },
    {
      text: "My Attendance",
      icon: <AccessTimeIcon />,
      path: "/my-attendance",
    },
    {
      text: "Leave Requests",
      icon: <EventBusyIcon />,
      path: "/leave-requests",
    },
  ];

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
        <Toolbar sx={{ justifyContent: "center", background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)", minHeight: "70px !important" }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: "bold", color: "#ffffff", fontSize: "1.1rem", letterSpacing: "0.5px" }}>
                EMPLOYEE DASHBOARD
            </Typography>
        </Toolbar>
        <Divider />
        <List component="nav" sx={{ width: '100%', bgcolor: 'background.paper', pt: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              selected={location.pathname.startsWith(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#eff6ff',
                  borderLeft: '4px solid #2563eb',
                  '& .MuiListItemIcon-root': {
                    color: '#2563eb',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#2563eb',
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, width: `calc(100% - ${drawerWidth}px)` }}>
        {/* AppBar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Toolbar sx={{ justifyContent: "flex-end", minHeight: '70px !important' }}>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="User Account">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="User Avatar"
                    src=""
                    sx={{
                      border: "2px solid #3b82f6",
                      transition: "0.2s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate('/profile');
                  }}
                >
                  <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Page Content */}
        <Box
          component="main"
          sx={{
            p: 3,
            background: 'linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)',
            minHeight: 'calc(100vh - 70px)',
          }}
        >
             <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                }}
            >
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
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
