import React, { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    AppBar as MuiAppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Collapse,
    Divider,
    Menu,
    MenuItem,
    Avatar,
    CssBaseline,
    Tooltip,
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
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

// Màu chủ đạo
const primaryGradient = 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)';
const headerGradient = 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)';

// Common styles for menu items
const menuItemStyles = {
    mx: 1,
    borderRadius: '10px',
    mb: 0.5,
    '&.Mui-selected': {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        '& .MuiListItemIcon-root': { color: '#ffffff' },
        '& .MuiListItemText-primary': { color: '#ffffff', fontWeight: 600 },
        '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' },
    },
    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
    '& .MuiListItemIcon-root': { color: '#94a3b8', minWidth: 40 },
    '& .MuiListItemText-primary': { color: '#e2e8f0', fontSize: '0.9rem' },
};

const subMenuItemStyles = {

    ...menuItemStyles,

    pl: 4,

    py: 0.8,

    '& .MuiListItemText-primary': { color: '#cbd5e1', fontSize: '0.85rem' },

};



const categoryHeaderStyles = {

    mx: 1,

    borderRadius: '10px',

    mb: 0.5,

    '& .MuiListItemIcon-root': { color: '#60a5fa', minWidth: 40 },

    '& .MuiListItemText-primary': { color: '#f1f5f9', fontWeight: 600, fontSize: '0.95rem' },

    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },

};



export default function AdminLayout() {

    const [open, setOpen] = useState(true);

    const location = useLocation();

    const navigate = useNavigate();



    const [openHR, setOpenHR] = useState(true);

    const [openTimekeeping, setOpenTimekeeping] = useState(false);

    const [openPayroll, setOpenPayroll] = useState(false);

    const [openPerformance, setOpenPerformance] = useState(false);

    const [openComms, setOpenComms] = useState(false);

    const [openReports, setOpenReports] = useState(false);



    const [anchorElUser, setAnchorElUser] = useState(null);

    const isAdmin = true;



    const currentDrawerWidth = open ? drawerWidth : collapsedDrawerWidth;



    const handleDrawerToggle = () => setOpen(!open);

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

    const handleCloseUserMenu = () => setAnchorElUser(null);



    const handleLogout = () => {

        handleCloseUserMenu();

        localStorage.removeItem('token');

        localStorage.removeItem('user');

        navigate("/login");

    };







    return (

        <Box sx={{ display: "flex", minHeight: '100vh' }}>

            <CssBaseline />



            {/* AppBar */}

            <MuiAppBar

                position="fixed"

                sx={{

                    background: primaryGradient,

                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',

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

                                color="inherit"

                                onClick={handleDrawerToggle}

                                sx={{

                                    bgcolor: 'rgba(255, 255, 255, 0.1)',

                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },

                                }}

                            >

                                {open ? <MenuOpenIcon /> : <MenuIcon />}

                            </IconButton>

                        </Tooltip>

                        {open && (

                            <Typography

                                variant="h6"

                                noWrap

                                sx={{

                                    fontWeight: 700,

                                    fontSize: '1.1rem',

                                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',

                                    WebkitBackgroundClip: 'text',

                                    WebkitTextFillColor: 'transparent',

                                }}

                            >

                                HR System

                            </Typography>

                        )}

                    </Box>









                 



                    <Box sx={{ flexGrow: 1 }} />



                    {/* User Info */}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>

                            <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 600 }}>Admin User</Typography>

                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Administrator</Typography>

                        </Box>



                        <IconButton

                            onClick={handleOpenUserMenu}

                            sx={{

                                p: 0.5,

                                border: '2px solid rgba(96, 165, 250, 0.5)',

                                '&:hover': { border: '2px solid #60a5fa', transform: 'scale(1.05)' },

                            }}

                        >

                            <Avatar sx={{ width: 40, height: 40, background: headerGradient, fontWeight: 600 }}>A</Avatar>

                        </IconButton>



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

                                    filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.15))',

                                    mt: 1.5,

                                    minWidth: 220,

                                    borderRadius: 3,

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

                                    },

                                },

                            }}

                        >

                            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e5e7eb' }}>

                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Admin User</Typography>

                                <Typography variant="caption" sx={{ color: '#64748b' }}>admin@company.com</Typography>

                            </Box>

                            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }} sx={{ py: 1.5, mt: 1 }}>

                                <PersonIcon fontSize="small" sx={{ mr: 1.5, color: '#6366f1' }} />

                                <Typography variant="body2">My Profile</Typography>

                            </MenuItem>

                            {isAdmin && (

                                <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin/dashboard'); }} sx={{ py: 1.5 }}>

                                    <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1.5, color: '#f59e0b' }} />

                                    <Typography variant="body2">Admin Dashboard</Typography>

                                </MenuItem>

                            )}

                            <Divider sx={{ my: 1 }} />

                            <MenuItem onClick={handleLogout} sx={{ py: 1.5, '&:hover': { backgroundColor: '#fef2f2' } }}>

                                <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: '#ef4444' }} />

                                <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 500 }}>Logout</Typography>

                            </MenuItem>

                        </Menu>

                    </Box>

                </Toolbar>

            </MuiAppBar>



            {/* Sidebar */}

            <Drawer

                variant="permanent"

                sx={{

                    width: currentDrawerWidth,

                    flexShrink: 0,

                    '& .MuiDrawer-paper': {

                        width: currentDrawerWidth,

                        boxSizing: 'border-box',

                        background: primaryGradient,

                        borderRight: 'none',

                        transition: 'width 0.3s ease',

                        overflowX: 'hidden',

                    },

                }}

            >

                <Toolbar sx={{ minHeight: '70px !important' }} />



                <Box sx={{ overflowY: 'auto', overflowX: 'hidden', py: 2, flex: 1 }}>

                    <List component="nav">

                        {/* Home */}

                        <Tooltip title={!open ? "Home" : ""} placement="right">

                            <ListItemButton

                                component={NavLink}

                                to="/admin/dashboard"

                                selected={location.pathname === '/admin/dashboard' || location.pathname === '/admin'}

                                sx={menuItemStyles}

                            >

                                <ListItemIcon><HomeIcon /></ListItemIcon>

                                {open && <ListItemText primary="Home" />}

                            </ListItemButton>

                        </Tooltip>



                        {/* Account Management */}

                        <Tooltip title={!open ? "Account Management" : ""} placement="right">

                            <ListItemButton

                                component={NavLink}

                                to="/admin/account-management"

                                selected={location.pathname === '/admin/account-management'}

                                sx={menuItemStyles}

                            >

                                <ListItemIcon><ManageAccountsIcon /></ListItemIcon>

                                {open && <ListItemText primary="Account Management" />}

                            </ListItemButton>

                        </Tooltip>



                        {open && (

                            <Typography

                                variant="overline"

                                sx={{ px: 2, py: 1.5, display: 'block', color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}

                            >

                                MAIN MENU

                            </Typography>

                        )}



                        {/* HR Management */}

                        <ListItemButton onClick={() => setOpenHR(!openHR)} sx={categoryHeaderStyles}>

                            <ListItemIcon><PeopleIcon /></ListItemIcon>

                            {open && (

                                <>

                                    <ListItemText primary="HR Management" />

                                    {openHR ? <ExpandLess sx={{ color: '#94a3b8' }} /> : <ExpandMore sx={{ color: '#94a3b8' }} />}

                                </>

                            )}

                        </ListItemButton>

                        {open && (

                            <Collapse in={openHR} timeout="auto" unmountOnExit>

                                <List component="div" disablePadding>

                                    <ListItemButton sx={subMenuItemStyles} component={NavLink} to="/admin/employees" selected={location.pathname.startsWith('/admin/employees')}>

                                        <ListItemIcon><PeopleIcon sx={{ fontSize: 20 }} /></ListItemIcon>

                                        <ListItemText primary="Employee List" />

                                    </ListItemButton>

                                    <ListItemButton sx={subMenuItemStyles} component={NavLink} to="/admin/departments" selected={location.pathname.startsWith('/admin/departments')}>

                                        <ListItemIcon><AccountTreeIcon sx={{ fontSize: 20 }} /></ListItemIcon>

                                        <ListItemText primary="Department" />

                                    </ListItemButton>

                                    <ListItemButton sx={subMenuItemStyles} component={NavLink} to="/admin/contracts" selected={location.pathname.startsWith('/admin/contracts')}>

                                        <ListItemIcon><SummarizeIcon sx={{ fontSize: 20 }} /></ListItemIcon>

                                        <ListItemText primary="Contract" />

                                    </ListItemButton>

                                </List>

                            </Collapse>

                        )}



                        {/* Timekeeping */}

                        <ListItemButton onClick={() => setOpenTimekeeping(!openTimekeeping)} sx={categoryHeaderStyles}>

                            <ListItemIcon><AccessTimeIcon /></ListItemIcon>

                            {open && (

                                <>

                                    <ListItemText primary="Timekeeping" />

                                    {openTimekeeping ? <ExpandLess sx={{ color: '#94a3b8' }} /> : <ExpandMore sx={{ color: '#94a3b8' }} />}

                                </>

                            )}

                        </ListItemButton>

                        {open && (

                            <Collapse in={openTimekeeping} timeout="auto" unmountOnExit>

                                <List component="div" disablePadding>

                                    <ListItemButton sx={subMenuItemStyles} component={NavLink} to="/admin/tasks">

                                        <ListItemIcon><ListAltIcon sx={{ fontSize: 20 }} /></ListItemIcon>

                                        <ListItemText primary="Task List" />

                                    </ListItemButton>

                                    <ListItemButton sx={subMenuItemStyles} component={NavLink} to="/admin/attendance" selected={location.pathname.startsWith('/admin/attendance')}>

                                        <ListItemIcon><AccessTimeIcon sx={{ fontSize: 20 }} /></ListItemIcon>

                                        <ListItemText primary="Attendance" />

                                    </ListItemButton>

                                    <ListItemButton sx={subMenuItemStyles} component={NavLink} to="/admin/leave-requests">

                                        <ListItemIcon><EventBusyIcon sx={{ fontSize: 20 }} /></ListItemIcon>

                                        <ListItemText primary="Leave Requests" />

                                    </ListItemButton>

                                </List>

                            </Collapse>

                        )}



                        {/* Payroll */}

                        <ListItemButton onClick={() => setOpenPayroll(!openPayroll)} sx={categoryHeaderStyles}>

                            <ListItemIcon><PaidIcon /></ListItemIcon>

                            {open && (

                                <>

                                    <ListItemText primary="Payroll" />

                                    {openPayroll ? <ExpandLess sx={{ color: '#94a3b8' }} /> : <ExpandMore sx={{ color: '#94a3b8' }} />}

                                </>

                            )}

                        </ListItemButton>

                        {open && (

                            <Collapse in={openPayroll} timeout="auto" unmountOnExit>

                                <List component="div" disablePadding>

                                    <ListItemButton sx={subMenuItemStyles} component={NavLink} to="/admin/payroll" selected={location.pathname.startsWith('/admin/payroll')}>

                                        <ListItemIcon><PaidIcon sx={{ fontSize: 20 }} /></ListItemIcon>

                                        <ListItemText primary="Payroll Management" />

                                    </ListItemButton>

                                </List>

                            </Collapse>

                        )}



                        {/* Performance */}

                        <ListItemButton onClick={() => setOpenPerformance(!openPerformance)} sx={categoryHeaderStyles}>

                            <ListItemIcon><TimelineIcon /></ListItemIcon>

                            {open && (

                                <>

                                    <ListItemText primary="Performance" />

                                    {openPerformance ? <ExpandLess sx={{ color: '#94a3b8' }} /> : <ExpandMore sx={{ color: '#94a3b8' }} />}

                                </>

                            )}

                        </ListItemButton>

                        {open && (

                            <Collapse in={openPerformance} timeout="auto" unmountOnExit>

                                <List component="div" disablePadding>

                                    <ListItemButton sx={subMenuItemStyles} component={NavLink} to="/admin/kpi" selected={location.pathname.startsWith('/admin/kpi')}>

                                        <ListItemIcon><TaskAltIcon sx={{ fontSize: 20 }} /></ListItemIcon>

                                        <ListItemText primary="Evaluations" />

                                    </ListItemButton>

                                </List>

                            </Collapse>

                        )}



                        {/* Communication */}

                        <ListItemButton onClick={() => setOpenComms(!openComms)} sx={categoryHeaderStyles}>

                            <ListItemIcon><MarkunreadIcon /></ListItemIcon>

                            {open && (

                                <>

                                    <ListItemText primary="Communication" />

                                    {openComms ? <ExpandLess sx={{ color: '#94a3b8' }} /> : <ExpandMore sx={{ color: '#94a3b8' }} />}

                                </>

                            )}

                        </ListItemButton>

                        {open && (

                            <Collapse in={openComms} timeout="auto" unmountOnExit>

                                <List component="div" disablePadding>

                                    <ListItemButton sx={subMenuItemStyles} component={NavLink} to="/admin/notification" selected={location.pathname.startsWith('/admin/notification')}>

                                        <ListItemIcon><MarkunreadIcon sx={{ fontSize: 20 }} /></ListItemIcon>

                                        <ListItemText primary="Internal News" />

                                    </ListItemButton>

                                </List>

                            </Collapse>

                        )}



                        {/* Reports */}

                        <ListItemButton onClick={() => setOpenReports(!openReports)} sx={categoryHeaderStyles}>

                            <ListItemIcon><DashboardIcon /></ListItemIcon>

                            {open && (

                                <>

                                    <ListItemText primary="Reports" />

                                    {openReports ? <ExpandLess sx={{ color: '#94a3b8' }} /> : <ExpandMore sx={{ color: '#94a3b8' }} />}

                                </>

                            )}

                        </ListItemButton>

                        {open && (

                            <Collapse in={openReports} timeout="auto" unmountOnExit>

                                <List component="div" disablePadding>

                                </List>

                            </Collapse>

                        )}

                    </List>

                </Box>



                {/* Logout Button */}

                {open && (

                    <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>

                        <ListItemButton

                            onClick={handleLogout}

                            sx={{

                                borderRadius: '10px',

                                background: 'rgba(239, 68, 68, 0.1)',

                                border: '1px solid rgba(239, 68, 68, 0.3)',

                                '&:hover': { background: 'rgba(239, 68, 68, 0.2)' },

                                '& .MuiListItemIcon-root': { color: '#f87171', minWidth: 40 },

                                '& .MuiListItemText-primary': { color: '#f87171', fontWeight: 600 },

                            }}

                        >

                            <ListItemIcon><LogoutIcon /></ListItemIcon>

                            <ListItemText primary="Logout" />

                        </ListItemButton>

                    </Box>

                )}

            </Drawer>



            {/* Main Content - SÁT SIDEBAR */}

            <Box

                component="main"

                sx={{

                    flexGrow: 1,

                    p: 3,

                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',

                    minHeight: '100vh',

                }}

            >

                <Toolbar sx={{ minHeight: '70px !important' }} />





                {/* Page Content */}

                <Outlet />

            </Box>

        </Box>

    );

}
