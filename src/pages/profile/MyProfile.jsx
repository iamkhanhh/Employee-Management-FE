import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
  Avatar,
  Badge,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  CameraAlt as CameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
  Security as SecurityIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  EventNote as EventNoteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Cake as CakeIcon,
  Home as HomeIcon,
  Wc as GenderIcon
} from '@mui/icons-material';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileInfo from '../../components/profile/ProfileInfo';
import ProfileTabs from '../../components/profile/ProfileTabs';
import ChangePasswordDialog from '../../components/profile/ChangePasswordDialog';
import EditProfileDialog from '../../components/profile/EditProfileDialog';
import { formatDate } from '../../utils/dateUtils';

// Mock current user data
const currentUser = {
  id: 1,
  user_id: 1,
  username: 'nguyenvanan',
  email: 'nguyenvanan@company.com',
  full_name: 'Nguyễn Văn An',
  gender: 'Nam',
  dob: '1990-05-15',
  phone_number: '0901234567',
  address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  hire_date: '2023-01-15',
  status: 'ACTIVE',
  role: 'EMPLOYEE',
  role_in_dept: 'STAFF',
  department: {
    id: 1,
    dept_name: 'Phòng Kỹ thuật'
  },
  position: {
    id: 1,
    position_name: 'Senior Developer'
  },
  avatar: null,
  // Additional info
  employee_code: 'NV001',
  emergency_contact: '0909999999',
  emergency_name: 'Nguyễn Thị B',
  emergency_relation: 'Vợ',
  education: 'Đại học Bách Khoa TP.HCM',
  major: 'Công nghệ thông tin',
  skills: ['ReactJS', 'NodeJS', 'MongoDB', 'Docker'],
  languages: ['Tiếng Việt', 'Tiếng Anh'],
  // Stats
  total_working_days: 245,
  total_leave_days: 12,
  remaining_leave_days: 8,
  current_projects: 3,
  completed_tasks: 156,
  kpi_score: 92
};

const MyProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [user, setUser] = useState(currentUser);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = (updatedData) => {
    setUser({ ...user, ...updatedData });
    setOpenEditDialog(false);
  };

  const handleChangePassword = (passwordData) => {
    console.log('Change password:', passwordData);
    setOpenPasswordDialog(false);
    // Show success message
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)',
      pb: 4
    }}>
      {/* Header Section */}
      <ProfileHeader user={user} onAvatarChange={handleAvatarChange} />

      <Container maxWidth="lg" sx={{ mt: -8 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Profile Card */}
            <Card sx={{ mb: 3, position: 'relative', overflow: 'visible' }}>
              <Box sx={{ 
                position: 'absolute',
                top: -50,
                left: '50%',
                transform: 'translateX(-50%)'
              }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      component="label"
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 40,
                        height: 40,
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      <CameraIcon fontSize="small" />
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleAvatarChange}
                      />
                    </IconButton>
                  }
                >
                  <Avatar
                    src={user.avatar}
                    sx={{ 
                      width: 120, 
                      height: 120,
                      border: '4px solid white',
                      boxShadow: 3
                    }}
                  >
                    {user.full_name.charAt(0)}
                  </Avatar>
                </Badge>
              </Box>

              <CardContent sx={{ pt: 10, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  {user.full_name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {user.position.position_name}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                  <Chip 
                    label={user.employee_code} 
                    color="primary" 
                    size="small"
                    icon={<BadgeIcon />}
                  />
                  <Chip 
                    label={user.department.dept_name} 
                    color="secondary" 
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Contact Info */}
                <Stack spacing={1.5} sx={{ textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body2">{user.phone_number}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body2">{user.address}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Ngày vào: {formatDate(user.hire_date)}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setOpenEditDialog(true)}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SecurityIcon />}
                    onClick={() => setOpenPasswordDialog(true)}
                  >
                    Đổi mật khẩu
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  Kỹ năng
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{ 
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white'
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  Thống kê
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">KPI Score</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {user.kpi_score}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={user.kpi_score} 
                      sx={{ height: 8, borderRadius: 4 }}
                      color={user.kpi_score >= 80 ? 'success' : 'warning'}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Ngày công</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {user.total_working_days}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Task hoàn thành</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {user.completed_tasks}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Dự án hiện tại</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {user.current_projects}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Thông tin cá nhân" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Công việc" icon={<WorkIcon />} iconPosition="start" />
                <Tab label="Hợp đồng" icon={<DescriptionIcon />} iconPosition="start" />
                <Tab label="Chấm công" icon={<AccessTimeIcon />} iconPosition="start" />
                <Tab label="Nghỉ phép" icon={<EventNoteIcon />} iconPosition="start" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {/* Tab 1: Personal Info */}
                {tabValue === 0 && (
                  <ProfileInfo user={user} />
                )}

                {/* Tab 2: Work Info */}
                {tabValue === 1 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Mã nhân viên
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {user.employee_code}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Phòng ban
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {user.department.dept_name}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Vị trí
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {user.position.position_name}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Vai trò trong phòng
                          </Typography>
                          <Chip 
                            label={
                              user.role_in_dept === 'HEAD' ? 'Trưởng phòng' :
                              user.role_in_dept === 'DEPUTY' ? 'Phó phòng' : 'Nhân viên'
                            }
                            color={
                              user.role_in_dept === 'HEAD' ? 'error' :
                              user.role_in_dept === 'DEPUTY' ? 'warning' : 'default'
                            }
                            size="small"
                          />
                        </Box>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Ngày vào làm
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatDate(user.hire_date)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Thâm niên
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {Math.floor((new Date() - new Date(user.hire_date)) / (365 * 24 * 60 * 60 * 1000))} năm
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Trạng thái
                          </Typography>
                          <Chip 
                            label="Đang làm việc" 
                            color="success" 
                            size="small"
                            icon={<CheckCircleIcon />}
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Email công ty
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Recent Projects */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Dự án gần đây
                      </Typography>
                      <Stack spacing={2}>
                        {[
                          { name: 'Website E-commerce', status: 'In Progress', progress: 75 },
                          { name: 'Mobile App Banking', status: 'Completed', progress: 100 },
                          { name: 'ERP System', status: 'Planning', progress: 20 }
                        ].map((project, index) => (
                          <Paper key={index} sx={{ p: 2 }} variant="outlined">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body1" fontWeight={500}>
                                {project.name}
                              </Typography>
                              <Chip 
                                label={project.status} 
                                size="small"
                                color={
                                  project.status === 'Completed' ? 'success' :
                                  project.status === 'In Progress' ? 'warning' : 'default'
                                }
                              />
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={project.progress} 
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Paper>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                )}

                {/* Tab 3: Contracts */}
                {tabValue === 2 && (
                  <Stack spacing={2}>
                    <Alert severity="info">
                      Hợp đồng hiện tại còn hiệu lực đến ngày 01/01/2025
                    </Alert>
                    {[
                      {
                        type: 'Hợp đồng lao động',
                        startDate: '2024-01-01',
                        endDate: '2025-01-01',
                        status: 'ACTIVE',
                        file: 'HD_2024.pdf'
                      },
                      {
                        type: 'Hợp đồng thử việc',
                        startDate: '2023-01-15',
                        endDate: '2023-03-15',
                        status: 'COMPLETED',
                        file: 'HD_TV_2023.pdf'
                      }
                    ].map((contract, index) => (
                      <Paper key={index} sx={{ p: 2 }} variant="outlined">
                        <Grid container alignItems="center">
                          <Grid item xs={12} md={3}>
                            <Typography variant="body1" fontWeight={500}>
                              {contract.type}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Chip 
                              label={contract.status === 'ACTIVE' ? 'Đang hiệu lực' : 'Đã hoàn thành'}
                              color={contract.status === 'ACTIVE' ? 'success' : 'default'}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={3} textAlign="right">
                            <Button size="small" startIcon={<DescriptionIcon />}>
                              {contract.file}
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Stack>
                )}

                {/* Tab 4: Attendance */}
                {tabValue === 3 && (
                  <Stack spacing={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                          <Typography variant="h4" color="white">
                            {user.total_working_days}
                          </Typography>
                          <Typography variant="body2" color="white">
                            Tổng ngày công
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                          <Typography variant="h4" color="white">
                            5
                          </Typography>
                          <Typography variant="body2" color="white">
                            Đi muộn
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                          <Typography variant="h4" color="white">
                            12
                          </Typography>
                          <Typography variant="body2" color="white">
                            Làm thêm giờ
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                          <Typography variant="h4" color="white">
                            2
                          </Typography>
                          <Typography variant="body2" color="white">
                            Vắng mặt
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Typography variant="h6">Lịch sử chấm công gần đây</Typography>
                    {[...Array(5)].map((_, index) => {
                      const date = new Date();
                      date.setDate(date.getDate() - index);
                      return (
                        <Paper key={index} sx={{ p: 2 }} variant="outlined">
                          <Grid container alignItems="center">
                            <Grid item xs={12} md={3}>
                              <Typography variant="body1">
                                {date.toLocaleDateString('vi-VN')}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <CheckCircleIcon color="success" fontSize="small" />
                                <Typography variant="body2">
                                  Check in: 08:30
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <CheckCircleIcon color="error" fontSize="small" />
                                <Typography variant="body2">
                                  Check out: 18:00
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Chip 
                                label="Đúng giờ" 
                                color="success" 
                                size="small"
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      );
                    })}
                  </Stack>
                )}

                {/* Tab 5: Leave Requests */}
                {tabValue === 4 && (
                  <Stack spacing={3}>
                    <Alert severity="info">
                      Bạn còn {user.remaining_leave_days} ngày phép trong năm
                    </Alert>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" color="primary">
                            {user.total_leave_days}
                          </Typography>
                          <Typography variant="body2">
                            Tổng ngày phép/năm
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" color="error">
                            {user.total_leave_days - user.remaining_leave_days}
                          </Typography>
                          <Typography variant="body2">
                            Đã sử dụng
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" color="success">
                            {user.remaining_leave_days}
                          </Typography>
                          <Typography variant="body2">
                            Còn lại
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Tạo đơn xin nghỉ
                    </Button>

                    <Typography variant="h6">Lịch sử xin nghỉ</Typography>
                    {[
                      {
                        date: '15/03/2024 - 17/03/2024',
                        type: 'Nghỉ phép năm',
                        reason: 'Về quê',
                        status: 'Approved'
                      },
                      {
                        date: '01/02/2024',
                        type: 'Nghỉ ốm',
                        reason: 'Bệnh',
                        status: 'Approved'
                      }
                    ].map((leave, index) => (
                      <Paper key={index} sx={{ p: 2 }} variant="outlined">
                        <Grid container alignItems="center">
                          <Grid item xs={12} md={3}>
                            <Typography variant="body1" fontWeight={500}>
                              {leave.date}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2">
                              {leave.type}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              {leave.reason}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3} textAlign="right">
                            <Chip 
                              label="Đã duyệt" 
                              color="success" 
                              size="small"
                              icon={<CheckCircleIcon />}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Dialogs */}
      <EditProfileDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        user={user}
        onSave={handleEditProfile}
      />

      <ChangePasswordDialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        onSubmit={handleChangePassword}
      />
    </Box>
  );
};

export default MyProfile;