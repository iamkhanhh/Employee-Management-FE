import React, { useState } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import BadgeIcon from '@mui/icons-material/Badge'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ListAltIcon from '@mui/icons-material/ListAlt'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SummarizeIcon from '@mui/icons-material/Summarize'
import PaidIcon from '@mui/icons-material/Paid'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import TimelineIcon from '@mui/icons-material/Timeline'
import MarkunreadIcon from '@mui/icons-material/Markunread'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionIcon from '@mui/icons-material/Description'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import SecurityIcon from '@mui/icons-material/Security'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PasswordIcon from '@mui/icons-material/Password'
import KeyIcon from '@mui/icons-material/Key'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { NavLink, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  const [openHR, setOpenHR] = useState(true)
  const [openTimekeeping, setOpenTimekeeping] = useState(false)
  const [openPayroll, setOpenPayroll] = useState(false)
  const [openPerformance, setOpenPerformance] = useState(false)
  const [openComms, setOpenComms] = useState(false)
  const [openReports, setOpenReports] = useState(false)

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      {/* <div className="px-4 py-4 text-lg font-semibold text-gray-900">Navigation</div> */}
      <List component="nav" sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItemButton component={NavLink} to="/" selected={location.pathname === '/'}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />

        {/* HR Management */}
        <ListItemButton onClick={() => setOpenHR(!openHR)}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="HR management" />
          {openHR ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openHR} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={NavLink} to="/accounts" selected={location.pathname.startsWith('/accounts')}>
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
            <ListItemButton sx={{ pl: 4 }} disabled>
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
            <ListItemButton sx={{ pl: 4 }} disabled>
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
            <ListItemButton sx={{ pl: 4 }} disabled>
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
        <ListItemButton component={NavLink} to="/login" selected={location.pathname.startsWith('/login')}>
          <ListItemIcon><KeyIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </aside>
  )
}


