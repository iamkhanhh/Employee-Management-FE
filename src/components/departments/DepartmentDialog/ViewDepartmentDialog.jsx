import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Avatar,
  Chip,
  Grid,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Badge
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  TrendingUp as TrendingUpIcon,
  WorkHistory as WorkHistoryIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { formatDate } from '../../../utils/dateUtils';
import { mockEmployees } from '../../../data/mockData';
import { generateEmployeeCode } from '../../../data/mockData';

// Tab Panel Component
const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ViewDepartmentDialog = ({ open, onClose, department, onEdit }) => {
  const [tabValue, setTabValue] = useState(0);

  if (!department) return null;

  // Get department employees
  const departmentEmployees = mockEmployees.filter(
    emp => emp.dept_id === department.id && 
    emp.status === 'ACTIVE' && 
    !emp.is_deleted
  );

  // Get leadership
  const departmentHead = departmentEmployees.find(emp => emp.role_in_dept === 'HEAD');
  const deputyHeads = departmentEmployees.filter(emp => emp.role_in_dept === 'DEPUTY');
  const staffMembers = departmentEmployees.filter(emp => emp.role_in_dept === 'STAFF');

  // Calculate statistics
  const stats = {
    totalEmployees: departmentEmployees.length,
    maleCount: departmentEmployees.filter(emp => emp.gender === 'Male').length,
    femaleCount: departmentEmployees.filter(emp => emp.gender === 'Female').length,
    headCount: departmentHead ? 1 : 0,
    deputyCount: deputyHeads.length,
    staffCount: staffMembers.length
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      HEAD: { label: 'Head', color: 'error' },
      DEPUTY: { label: 'Deputy', color: 'warning' },
      STAFF: { label: 'Staff', color: 'default' }
    };
    const config = roleConfig[role] || roleConfig.STAFF;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '85vh' }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              width: 48, 
              height: 48
            }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {department.dept_name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Department Code: DEPT{String(department.id).padStart(3, '0')}
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit">
              <IconButton 
                onClick={() => {
                  onClose();
                  onEdit(department);
                }}
                sx={{ color: 'white' }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print Report">
              <IconButton sx={{ color: 'white' }}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton sx={{ color: 'white' }}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton onClick={onClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </DialogTitle>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab 
            label={
              <Badge badgeContent={stats.totalEmployees} color="primary">
                <Box>Employees</Box>
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      <DialogContent>
        {/* Tab 1: Overview */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'primary.main'
                  }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    General Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CalendarIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Established Date
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(department.created_at)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <LocationOnIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {department.location || '5th Floor, Main Building'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <EmailIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Department Email
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {department.email || `${department.dept_name.toLowerCase().replace(/\s/g, '')}@company.com`}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <PhoneIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {department.phone || '(028) 1234-5678'}
                        </Typography>
                      </Box>
                    </Box>

                    {department.description && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <DescriptionIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Description
                          </Typography>
                          <Typography variant="body1">
                            {department.description}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Leadership */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'primary.main'
                  }}>
                    <StarIcon sx={{ mr: 1 }} />
                    Leadership
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={2}>
                    {departmentHead ? (
                      <Paper sx={{ p: 2, bgcolor: 'rgba(211, 47, 47, 0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'error.main',
                              width: 48, 
                              height: 48,
                              mr: 2 
                            }}
                          >
                            {departmentHead.full_name.charAt(0)}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="body1" fontWeight={600}>
                              {departmentHead.full_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {departmentHead.position?.position_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {departmentHead.user?.email}
                            </Typography>
                          </Box>
                          <Chip label="HEAD" color="error" size="small" />
                        </Box>
                      </Paper>
                    ) : (
                      <Alert severity="info">
                        No head appointed yet
                      </Alert>
                    )}

                    {deputyHeads.map((deputy) => (
                      <Paper key={deputy.id} sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'warning.main',
                              width: 40, 
                              height: 40,
                              mr: 2 
                            }}
                          >
                            {deputy.full_name.charAt(0)}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="body1" fontWeight={500}>
                              {deputy.full_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {deputy.user?.email}
                            </Typography>
                          </Box>
                          <Chip label="DEPUTY" color="warning" size="small" />
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <GroupIcon sx={{ fontSize: 40, opacity: 0.8, mb: 1 }} />
                      <Typography variant="h3">{stats.totalEmployees}</Typography>
                      <Typography variant="body2">Total Employees</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Card sx={{ 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <PersonIcon sx={{ fontSize: 40, opacity: 0.8, mb: 1 }} />
                      <Typography variant="h3">{stats.maleCount}</Typography>
                      <Typography variant="body2">Male</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Card sx={{ 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <PersonIcon sx={{ fontSize: 40, opacity: 0.8, mb: 1 }} />
                      <Typography variant="h3">{stats.femaleCount}</Typography>
                      <Typography variant="body2">Female</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Card sx={{ 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8, mb: 1 }} />
                      <Typography variant="h3">A+</Typography>
                      <Typography variant="body2">Rating</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Employees */}
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={3}>
            {/* Summary */}
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="h5" color="error.main">{stats.headCount}</Typography>
                  <Typography variant="body2">Head</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="h5" color="warning.main">{stats.deputyCount}</Typography>
                  <Typography variant="body2">Deputy</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="h5" color="info.main">{stats.staffCount}</Typography>
                  <Typography variant="body2">Staff</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Employee List */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.light' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Employee ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Full Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Phone</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Hire Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentEmployees.map((emp) => (
                    <TableRow key={emp.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {generateEmployeeCode(emp.id)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 1.5, 
                              width: 36, 
                              height: 36,
                              bgcolor: emp.gender === 'Male' ? 'primary.main' : 'secondary.main'
                            }}
                          >
                            {emp.full_name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {emp.full_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {emp.position?.position_name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{getRoleChip(emp.role_in_dept)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {emp.user?.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {emp.phone_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(emp.hire_date)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {departmentEmployees.length === 0 && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <GroupIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No employees in this department
                </Typography>
              </Paper>
            )}
          </Stack>
        </TabPanel>

      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          size="large"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDepartmentDialog;
