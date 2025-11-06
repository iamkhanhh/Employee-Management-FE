import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Collapse,
    Divider,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon,
    EventAvailable as EventIcon,
    Assignment as AssignmentIcon,
    Paid as PaidIcon,
    BarChart as KPIIcon,
    Menu as MenuIcon,
    ExpandLess,
    ExpandMore,
    Logout as LogoutIcon,
} from "@mui/icons-material";

export default function AdminLayout() {
    const [open, setOpen] = useState(true);
    const [openHR, setOpenHR] = useState(true);
    const [openAttendance, setOpenAttendance] = useState(false);
    const [openPayroll, setOpenPayroll] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const drawerWidth = 260;

    // Danh sách menu con
    const hrMenus = [
        { text: "Danh sách nhân viên", path: "/admin/employees", icon: <PeopleIcon /> },
        { text: "Quản lý hợp đồng", path: "/admin/contracts", icon: <DescriptionIcon /> },
        { text: "Quản lý khen thưởng/kỷ luật", path: "/admin/rewards", icon: <AssignmentIcon /> },
        { text: "Quản lý bổ nhiệm", path: "/admin/promotions", icon: <AssignmentIcon /> },
        { text: "Quản lý thôi việc", path: "/admin/terminations", icon: <AssignmentIcon /> },
        { text: "Quản lý người phụ thuộc", path: "/admin/dependents", icon: <PeopleIcon /> },
        { text: "Import danh sách nhân viên", path: "/admin/import", icon: <DescriptionIcon /> },
    ];

    const attendanceMenus = [
        { text: "Máy chấm công", path: "/admin/attendance/devices", icon: <EventIcon /> },
        { text: "Quản lý chấm công", path: "/admin/attendance", icon: <EventIcon /> },
    ];

    const payrollMenus = [
        { text: "Tính lương", path: "/admin/payroll", icon: <PaidIcon /> },
        { text: "KPI", path: "/admin/kpi", icon: <KPIIcon /> },
    ];

    const handleLogout = () => {
        navigate("/login");
    };

    // Hàm lấy tên trang từ đường dẫn
    const getPageTitle = (path) => {
        switch (path) {
            case "/admin/dashboard":
                return "Trang chủ";
            case "/admin/employees":
                return "Danh sách nhân viên";
            case "/admin/employees/1":  //hardcode
                return "Thông tin nhân viên 1";
            case "/admin/contracts":
                return "Quản lý hợp đồng";
            case "/admin/rewards":
                return "Quản lý khen thưởng/kỷ luật";
            case "/admin/promotions":
                return "Quản lý bổ nhiệm";
            case "/admin/terminations":
                return "Quản lý thôi việc";
            case "/admin/dependents":
                return "Quản lý người phụ thuộc";
            case "/admin/import":
                return "Import danh sách nhân viên";
            case "/admin/attendance":
                return "Quản lý chấm công";
            case "/admin/attendance/devices":
                return "Máy chấm công";
            case "/admin/payroll":
                return "Tính lương";
            case "/admin/kpi":
                return "KPI";
            default:
                return "Trang chủ";
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
            {/* Sidebar */}
            <Drawer
                variant="persistent"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#ffffff",
                        color: "#1e293b",
                        borderRight: "1px solid #e2e8f0",
                    },
                }}
            >
                <Toolbar sx={{ justifyContent: "center" }}>
                    <Typography variant="h6" noWrap sx={{ fontWeight: "bold", color: "#0f172a" }}>
                        QUẢN LÝ NHÂN SỰ
                    </Typography>
                </Toolbar>
                <Divider />

                <List>
                    {/* Trang chủ */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/admin/dashboard"
                            selected={location.pathname === "/admin/dashboard"}
                        >
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Trang chủ" />
                        </ListItemButton>
                    </ListItem>

                    {/* HR Management */}
                    <ListItemButton onClick={() => setOpenHR(!openHR)}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Quản lý nhân sự" />
                        {openHR ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openHR} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {hrMenus.map((item) => (
                                <ListItemButton
                                    key={item.text}
                                    component={Link}
                                    to={item.path}
                                    selected={location.pathname === item.path}
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    {/* Attendance */}
                    <ListItemButton onClick={() => setOpenAttendance(!openAttendance)}>
                        <ListItemIcon>
                            <EventIcon />
                        </ListItemIcon>
                        <ListItemText primary="Máy chấm công" />
                        {openAttendance ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openAttendance} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {attendanceMenus.map((item) => (
                                <ListItemButton
                                    key={item.text}
                                    component={Link}
                                    to={item.path}
                                    selected={location.pathname === item.path}
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    {/* Payroll */}
                    <ListItemButton onClick={() => setOpenPayroll(!openPayroll)}>
                        <ListItemIcon>
                            <PaidIcon />
                        </ListItemIcon>
                        <ListItemText primary="Tính lương" />
                        {openPayroll ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openPayroll} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {payrollMenus.map((item) => (
                                <ListItemButton
                                    key={item.text}
                                    component={Link}
                                    to={item.path}
                                    selected={location.pathname === item.path}
                                    sx={{ pl: 4 }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    {/* Logout */}
                    <Divider sx={{ my: 2 }} />
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Đăng xuất" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            {/* Main content */}
            <Box sx={{ flexGrow: 1 }}>
                {/* Topbar */}
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        backgroundColor: "#1e293b",
                    }}
                >
                    <Toolbar>
                        <IconButton color="inherit" edge="start" onClick={() => setOpen(!open)} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Hệ thống quản lý nhân sự
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Nội dung chính */}
                <Toolbar />
                <Box component="main" sx={{ p: 3 }}>
                    {/* Breadcrumb */}
                    <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="body1"
                            color="primary"
                            sx={{ cursor: "pointer", fontWeight: 600 }}
                            onClick={() => navigate("/admin/dashboard")}
                        >
                            Trang chủ
                        </Typography>

                        <Typography variant="body1" sx={{ mx: 1 }}>
                            /
                        </Typography>

                        <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
                            {getPageTitle(location.pathname)}
                        </Typography>
                    </Box>

                    {/* Outlet - Nội dung trang con */}
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
