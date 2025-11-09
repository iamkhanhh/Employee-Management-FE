import React, { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    Drawer,
    List,
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
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import BadgeIcon from '@mui/icons-material/Badge';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import TimelineIcon from '@mui/icons-material/Timeline';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import KeyIcon from '@mui/icons-material/Key';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export default function AdminLayout() {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const drawerWidth = 260;

    const [openHR, setOpenHR] = useState(true);
    const [openTimekeeping, setOpenTimekeeping] = useState(false);
    const [openPayroll, setOpenPayroll] = useState(false);
    const [openPerformance, setOpenPerformance] = useState(false);
    const [openComms, setOpenComms] = useState(false);
    const [openReports, setOpenReports] = useState(false);

    const handleLogout = () => {
        navigate("/login");
    };

    // Get page title from path
    const getPageTitle = (path) => {
        if (path.startsWith("/admin/employees/") && path !== "/admin/employees") {
            return "Employee Information";
        }
        switch (path) {
            case "/admin/dashboard":
            case "/admin":
                return "Home";
            case "/admin/account-management":
                return "Account Management";
            case "/admin/employees":
                return "Employee List";
            case "/admin/contracts":
                return "Contract Management";
            case "/admin/attendance":
                return "Attendance Management";
            case "/admin/payroll":
                return "Payroll";
            case "/admin/kpi":
                return "KPI";
            case "/admin/tasks":
                return "Task Management";
            case "/admin/departments":
                return "Department Management";
            default:
                return "Home";
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
                        borderRight: "1px solid #e5e7eb",
                        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
                    },
                }}
            >
                <Toolbar sx={{ justifyContent: "center", background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)", minHeight: "70px !important" }}>
                    <Typography variant="h6" noWrap sx={{ fontWeight: "bold", color: "#ffffff", fontSize: "1.1rem", letterSpacing: "0.5px" }}>
                        HR MANAGEMENT
                    </Typography>
                </Toolbar>
                <Divider />

                <List component="nav" sx={{ width: '100%', bgcolor: 'background.paper', pt: 1 }}>
                    <ListItemButton 
                        component={NavLink} 
                        to="/admin/dashboard" 
                        selected={location.pathname === '/admin/dashboard' || location.pathname === '/admin'}
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
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                    <Divider sx={{ my: 1 }} />

                    {/* Account Management */}
                    <ListItemButton 
                        component={NavLink} 
                        to="/admin/account-management" 
                        selected={location.pathname === '/admin/account-management'}
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
                        <ListItemIcon><ManageAccountsIcon /></ListItemIcon>
                        <ListItemText primary="Account Management" />
                    </ListItemButton>
                    <Divider sx={{ my: 1 }} />

                    {/* HR Management */}
                    <ListItemButton 
                        onClick={() => setOpenHR(!openHR)}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#f3f4f6',
                            },
                        }}
                    >
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText primary="HR management" />
                        {openHR ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openHR} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton 
                                sx={{ pl: 4 }} 
                                component={NavLink} 
                                to="/admin/employees" 
                                selected={location.pathname.startsWith('/admin/employees')}
                                className={location.pathname.startsWith('/admin/employees') ? 'selected' : ''}
                            >
                                <ListItemIcon><PeopleIcon /></ListItemIcon>
                                <ListItemText primary="Employee list" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><AccountTreeIcon /></ListItemIcon>
                                <ListItemText primary="Department management" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><BadgeIcon /></ListItemIcon>
                                <ListItemText primary="Position management" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><WorkHistoryIcon /></ListItemIcon>
                                <ListItemText primary="Assign employees to departments" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><ImportExportIcon /></ListItemIcon>
                                <ListItemText primary="Import/Export employees" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><FolderOpenIcon /></ListItemIcon>
                                <ListItemText primary="Employee documents" />
                            </ListItemButton>
                                    <ListItemButton 
                                sx={{ pl: 4 }} 
                                component={NavLink} 
                                to="/admin/contracts" 
                                selected={location.pathname.startsWith('/admin/contracts')}
                            >
                                <ListItemIcon><SummarizeIcon /></ListItemIcon>
                                <ListItemText primary="Contract management" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Timekeeping */}
                    <ListItemButton onClick={() => setOpenTimekeeping(!openTimekeeping)}>
                        <ListItemIcon><AccessTimeIcon /></ListItemIcon>
                        <ListItemText primary="Timekeeping" />
                        {openTimekeeping ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openTimekeeping} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><ListAltIcon /></ListItemIcon>
                                <ListItemText primary="Task list" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><EventBusyIcon /></ListItemIcon>
                                <ListItemText primary="Leave requests" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                                <ListItemText primary="Approve leaves" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><SummarizeIcon /></ListItemIcon>
                                <ListItemText primary="Leave reports" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Payroll */}
                    <ListItemButton onClick={() => setOpenPayroll(!openPayroll)}>
                        <ListItemIcon><PaidIcon /></ListItemIcon>
                        <ListItemText primary="Payroll" />
                        {openPayroll ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openPayroll} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/payroll" selected={location.pathname.startsWith('/admin/payroll')}>
                                <ListItemIcon><PaidIcon /></ListItemIcon>
                                <ListItemText primary="Auto payroll" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
                                <ListItemText primary="Payslips" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><TrendingUpIcon /></ListItemIcon>
                                <ListItemText primary="Salary summary" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Performance */}
                    <ListItemButton onClick={() => setOpenPerformance(!openPerformance)}>
                        <ListItemIcon><TimelineIcon /></ListItemIcon>
                        <ListItemText primary="Performance" />
                        {openPerformance ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openPerformance} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/admin/kpi" selected={location.pathname.startsWith('/admin/kpi')}>
                                <ListItemIcon><TaskAltIcon /></ListItemIcon>
                                <ListItemText primary="Evaluations" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                                <ListItemText primary="Recognition" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Communication */}
                    <ListItemButton onClick={() => setOpenComms(!openComms)}>
                        <ListItemIcon><MarkunreadIcon /></ListItemIcon>
                        <ListItemText primary="Communication" />
                        {openComms ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openComms} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><MarkunreadIcon /></ListItemIcon>
                                <ListItemText primary="Internal news" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><MarkunreadIcon /></ListItemIcon>
                                <ListItemText primary="Email notifications" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Dashboard & Reports */}
                    <ListItemButton onClick={() => setOpenReports(!openReports)}>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard & Reports" />
                        {openReports ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openReports} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><DashboardIcon /></ListItemIcon>
                                <ListItemText primary="Overview dashboard" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }} disabled>
                                <ListItemIcon><DescriptionIcon /></ListItemIcon>
                                <ListItemText primary="Export PDF/Excel" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <Divider sx={{ my: 1 }} />
                    <ListItemButton 
                        component={NavLink} 
                        to="/login"
                        sx={{
                            mt: 1,
                            '&:hover': {
                                backgroundColor: '#fee2e2',
                            },
                            '& .MuiListItemIcon-root': {
                                color: '#ef4444',
                            },
                            '& .MuiListItemText-primary': {
                                color: '#ef4444',
                                fontWeight: 500,
                            },
                        }}
                    >
                        <ListItemIcon><KeyIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </List>
            </Drawer>

            {/* Main content */}
            <Box sx={{ flexGrow: 1 }}>
                {/* Topbar */}
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                >
                    <Toolbar sx={{ minHeight: '70px !important' }}>
                        <IconButton 
                            color="inherit" 
                            edge="start" 
                            onClick={() => setOpen(!open)} 
                            sx={{ 
                                mr: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 500, letterSpacing: '0.3px' }}>
                            Human Resources Management System
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Admin User
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Main content */}
                <Toolbar />
                <Box 
                    component="main" 
                    sx={{ 
                        p: 3,
                        background: 'linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)',
                        minHeight: 'calc(100vh - 70px)',
                    }}
                >
                    {/* Breadcrumb */}
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
                        <Typography
                            variant="body1"
                            sx={{ 
                                cursor: "pointer", 
                                fontWeight: 600,
                                color: '#2563eb',
                                '&:hover': {
                                    color: '#1d4ed8',
                                    textDecoration: 'underline',
                                },
                            }}
                            onClick={() => navigate("/admin/dashboard")}
                        >
                            Home
                        </Typography>

                        <Typography variant="body1" sx={{ mx: 1.5, color: '#9ca3af' }}>
                            /
                        </Typography>

                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
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