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
    maleCount: departmentEmployees.filter(emp => emp.gender === 'Nam').length,
    femaleCount: departmentEmployees.filter(emp => emp.gender === 'Nữ').length,
    headCount: departmentHead ? 1 : 0,
    deputyCount: deputyHeads.length,
    staffCount: staffMembers.length
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      HEAD: { label: 'Trưởng phòng', color: 'error' },
      DEPUTY: { label: 'Phó phòng', color: 'warning' },
      STAFF: { label: 'Nhân viên', color: 'default' }
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
                Mã phòng ban: DEPT{String(department.id).padStart(3, '0')}
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title="Chỉnh sửa">
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
            <Tooltip title="In báo cáo">
              <IconButton sx={{ color: 'white' }}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chia sẻ">
              <IconButton sx={{ color: 'white' }}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Đóng">
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
          <Tab label="Tổng quan" />
          <Tab 
            label={
              <Badge badgeContent={stats.totalEmployees} color="primary">
                <Box>Nhân sự</Box>
              </Badge>
            } 
          />
          <Tab label="Thống kê" />
        </Tabs>
      </Box>

      <DialogContent>
        {/* Tab 1: Tổng quan */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Thông tin cơ bản */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'primary.main'
                  }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    Thông tin chung
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CalendarIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ngày thành lập
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
                          Địa điểm
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {department.location || 'Tầng 5, Tòa nhà chính'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <EmailIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email phòng ban
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
                          Số điện thoại
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
                            Mô tả
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

            {/* Ban lãnh đạo */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'primary.main'
                  }}>
                    <StarIcon sx={{ mr: 1 }} />
                    Ban lãnh đạo
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={2}>
                    {departmentHead ? (
                      <Paper sx={{ p: 2, bgcolor: 'error.light', bgcolor: 'rgba(211, 47, 47, 0.05)' }}>
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
                          <Chip label="TRƯỞNG PHÒNG" color="error" size="small" />
                        </Box>
                      </Paper>
                    ) : (
                      <Alert severity="info">
                        Chưa bổ nhiệm trưởng phòng
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
                          <Chip label="PHÓ PHÒNG" color="warning" size="small" />
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Thống kê nhanh */}
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
                      <Typography variant="body2">Tổng nhân viên</Typography>
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
                      <Typography variant="body2">Nam</Typography>
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
                      <Typography variant="body2">Nữ</Typography>
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
                      <Typography variant="body2">Đánh giá</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Nhân sự */}
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={3}>
            {/* Summary */}
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="h5" color="error.main">{stats.headCount}</Typography>
                  <Typography variant="body2">Trưởng phòng</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="h5" color="warning.main">{stats.deputyCount}</Typography>
                  <Typography variant="body2">Phó phòng</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="h5" color="info.main">{stats.staffCount}</Typography>
                  <Typography variant="body2">Nhân viên</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Employee List */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.light' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Mã NV</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Họ tên</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Chức vụ</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Điện thoại</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ngày vào</TableCell>
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
                              bgcolor: emp.gender === 'Nam' ? 'primary.main' : 'secondary.main'
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
                  Phòng ban chưa có nhân viên
                </Typography>
              </Paper>
            )}
          </Stack>
        </TabPanel>

        {/* Tab 3: Thống kê */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Biểu đồ nhân sự theo giới tính
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Stack alignItems="center" spacing={2}>
                      <Typography color="text.secondary">
                        [Biểu đồ tròn]
                      </Typography>
                      <Stack direction="row" spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: 'primary.main', mr: 1 }} />
                          <Typography variant="body2">Nam: {stats.maleCount}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: 'secondary.main', mr: 1 }} />
                          <Typography variant="body2">Nữ: {stats.femaleCount}</Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thống kê theo chức vụ
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 3 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Trưởng phòng</Typography>
                        <Typography variant="body2">{stats.headCount}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.headCount / stats.totalEmployees) * 100} 
                        color="error"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Phó phòng</Typography>
                        <Typography variant="body2">{stats.deputyCount}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.deputyCount / stats.totalEmployees) * 100} 
                        color="warning"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Nhân viên</Typography>
                        <Typography variant="body2">{stats.staffCount}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(stats.staffCount / stats.totalEmployees) * 100} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          size="large"
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDepartmentDialog;