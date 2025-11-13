import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
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
} from "@mui/material";
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const ClientLayout = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          background: "linear-gradient(135deg, #5b86e5 0%, #36d1dc 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            Human Resource Management System
          </Typography>

          {/* Avatar Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="User Account">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="User Avatar"
                  src=""
                  sx={{
                    border: "2px solid white",
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
                onClick={handleCloseUserMenu}
                component={Link}
                to="/profile"
              >
                <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleCloseUserMenu}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: "center",
          py: 2,
          backgroundColor: "#f1f3f5",
          color: "text.secondary",
          borderTop: "1px solid #ddd",
        }}
      >
        <Typography variant="body2">© 2025 TechNo Company.</Typography>
      </Box>
    </Box>
  );
};

export default ClientLayout;
