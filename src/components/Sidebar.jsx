import React, { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  ExpandLess,
  ExpandMore,
  AccessTime as AccessTimeIcon,
  Paid as PaidIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [openHR, setOpenHR] = useState(true);
  const [openTimekeeping, setOpenTimekeeping] = useState(false);
  const [openPayroll, setOpenPayroll] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <List component="nav">
        {/* Trang chủ */}
        <ListItemButton component={Link} to="/admin/dashboard" selected={isActive("/admin/dashboard")}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Trang chủ" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        {/* Quản lý nhân sự */}
        <ListItemButton onClick={() => setOpenHR(!openHR)}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lý nhân sự" />
          {openHR ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openHR} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/employees">
              <ListItemText primary="Danh sách nhân viên" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/contracts">
              <ListItemText primary="Quản lý hợp đồng" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Quản lý khen thưởng/kỷ luật" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Quản lý bổ nhiệm" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Quản lý thôi việc" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Quản lý người phụ thuộc" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Import danh sách nhân viên" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Máy chấm công */}
        <ListItemButton onClick={() => setOpenTimekeeping(!openTimekeeping)}>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText primary="Máy chấm công" />
          {openTimekeeping ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openTimekeeping} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Quản lý chấm công" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Tính lương */}
        <ListItemButton onClick={() => setOpenPayroll(!openPayroll)}>
          <ListItemIcon>
            <PaidIcon />
          </ListItemIcon>
          <ListItemText primary="Tính lương" />
          {openPayroll ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openPayroll} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Bảng lương" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Phiếu lương" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </aside>
  );
}
