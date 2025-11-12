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
import ChangePasswordDialog from '../../components/profile/ChangePasswordDialog';
import EditProfileDialog from '../../components/profile/EditProfileDialog';
import { formatDate } from '../../utils/dateUtils';
import WorkTab from '../../components/profile/WorkTab';
import ContractsTab from '../../components/profile/ContractsTab';
import AttendanceTab from '../../components/profile/AttendanceTab';
import LeaveRequestsTab from '../../components/profile/LeaveRequestsTab';

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
                      Hire Date: {formatDate(user.hire_date)}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<EditIcon />}
                    size="small"
                    sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                    onClick={() => setOpenEditDialog(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SecurityIcon />}
                    size="small"
                    sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                    onClick={() => setOpenPasswordDialog(true)}
                  >
                    Change Password
                  </Button>
                </Stack>

              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  Skills
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
                  Statistics
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
                    <Typography variant="body2">Working Days</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {user.total_working_days}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Completed Tasks</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {user.completed_tasks}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Current Projects</Typography>
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
                <Tab label="Personal Info" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Work" icon={<WorkIcon />} iconPosition="start" />
                <Tab label="Contracts" icon={<DescriptionIcon />} iconPosition="start" />
                <Tab label="Attendance" icon={<AccessTimeIcon />} iconPosition="start" />
                <Tab label="Leave Requests" icon={<EventNoteIcon />} iconPosition="start" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {/* Tab 1: Personal Info */}
                {tabValue === 0 && (
                  <ProfileInfo user={user} />
                )}

                {/* Tab 2: Work Info */}
                {tabValue === 1 && <WorkTab user={user} />}

                {/* Tab 3: Contracts */}
                {tabValue === 2 && <ContractsTab />}

                {/* Tab 4: Attendance */}
                {tabValue === 3 && <AttendanceTab user={user} />}

                {/* Tab 5: Leave Requests */}
                {tabValue === 4 && <LeaveRequestsTab user={user} />}
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