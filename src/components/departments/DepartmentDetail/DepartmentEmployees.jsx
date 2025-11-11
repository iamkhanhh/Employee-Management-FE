import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Avatar,
  Chip,
  IconButton,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  alpha,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  SwapHoriz as SwapHorizIcon,
  TrendingUp as TrendingUpIcon,
  WorkHistory as WorkHistoryIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { formatDate } from '../../../utils/dateUtils';
import { generateEmployeeCode } from '../../../data/mockData';

const DepartmentEmployees = ({ department, employees = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuOpen = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      HEAD: { label: 'Department Head', color: 'error', icon: '👑' },
      DEPUTY: { label: 'Deputy Head', color: 'warning', icon: '⭐' },
      STAFF: { label: 'Staff', color: 'default', icon: '👤' }
    };
    const config = roleConfig[role] || roleConfig.STAFF;
    return (
      <Chip
        label={`${config.icon} ${config.label}`}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getStatusChip = (status) => {
    return status === 'ACTIVE' ? (
      <Chip label="Active" color="success" size="small" variant="outlined" />
    ) : (
      <Chip label="Inactive" color="error" size="small" variant="outlined" />
    );
  };

  // Statistics
  const stats = {
    total: employees.length,
    heads: employees.filter(e => e.role_in_dept === 'HEAD').length,
    deputies: employees.filter(e => e.role_in_dept === 'DEPUTY').length,
    staff: employees.filter(e => e.role_in_dept === 'STAFF').length,
    male: employees.filter(e => e.gender === 'Nam').length,
    female: employees.filter(e => e.gender === 'Nữ').length
  };

  const performanceData = [
    { name: 'Excellent', value: 5, color: '#4caf50' },
    { name: 'Good', value: 12, color: '#2196f3' },
    { name: 'Satisfactory', value: 8, color: '#ff9800' },
    { name: 'Needs Improvement', value: 2, color: '#f44336' }
  ];

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {department?.dept_name} Employees
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track employees in this department
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Add Employee
          </Button>
        </Stack>

        {/* Statistics Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Stack spacing={1}>
                  <GroupIcon sx={{ fontSize: 32, opacity: 0.8 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Employees
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={`Male: ${stats.male}`}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip
                      label={`Female: ${stats.female}`}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Role Distribution
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">👑 Department Head</Typography>
                    <Typography variant="body2" fontWeight={600}>{stats.heads}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">⭐ Deputy Head</Typography>
                    <Typography variant="body2" fontWeight={600}>{stats.deputies}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">👤 Staff</Typography>
                    <Typography variant="body2" fontWeight={600}>{stats.staff}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Performance
                </Typography>
                <Stack spacing={1}>
                  {performanceData.map((item) => (
                    <Box key={item.name}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">{item.name}</Typography>
                        <Typography variant="caption">{item.value}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(item.value / stats.total) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: item.color,
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Recent Activity
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
                    <Typography variant="caption">2 new employees this month</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkHistoryIcon sx={{ color: 'info.main', fontSize: 16 }} />
                    <Typography variant="caption">5 contracts expiring soon</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssessmentIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                    <Typography variant="caption">KPI review for March</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Employee Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Employee ID</TableCell>
                <TableCell>Employee Info</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Hire Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow
                  key={employee.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha('#1976d2', 0.04)
                    }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {generateEmployeeCode(employee.id)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: employee.gender === 'Nam' ? '#1976d2' : '#e91e63',
                          width: 40,
                          height: 40
                        }}
                      >
                        {employee.full_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>
                          {employee.full_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.position?.position_name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    {getRoleChip(employee.role_in_dept)}
                  </TableCell>

                  <TableCell>
                    <Stack spacing={0.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption">
                          {employee.user?.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption">
                          {employee.phone_number}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(employee.hire_date)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {getStatusChip(employee.status)}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, employee)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <GroupIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No employees found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try searching with a different keyword' : 'This department has no employees'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Info</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SwapHorizIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Transfer Department</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <WorkHistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Work History</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Remove from Department</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DepartmentEmployees;
