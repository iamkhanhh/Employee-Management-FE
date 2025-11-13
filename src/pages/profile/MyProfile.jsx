import React, { useState } from 'react';
import {
  Box,
  Container,
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
  LinearProgress,
  Tooltip,
  alpha,
  useTheme
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
  Security as SecurityIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
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
  employee_code: 'NV001',
  emergency_contact: '0909999999',
  emergency_name: 'Nguyễn Thị B',
  emergency_relation: 'Vợ',
  education: 'Đại học Bách Khoa TP.HCM',
  major: 'Công nghệ thông tin',
  skills: ['ReactJS', 'NodeJS', 'MongoDB', 'Docker', 'AWS', 'TypeScript'],
  languages: ['Tiếng Việt', 'Tiếng Anh'],
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

  const theme = useTheme();

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
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header Section - Simple & Clean */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Tooltip title="Change Avatar" placement="top">
                <IconButton
                  component="label"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    width: 50,
                    height: 50,
                    boxShadow: 2,
                    '&:hover': {
                      bgcolor: 'white',
                      boxShadow: 4
                    }
                  }}
                >
                  <CameraIcon />
                  <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                </IconButton>
              </Tooltip>
            }
          >
            <Avatar
              src={user.avatar}
              sx={{
                width: 140,
                height: 140,
                border: '4px solid white',
                boxShadow: 3,
                fontSize: '3rem',
                fontWeight: 700,
                bgcolor: 'primary.main'
              }}
            >
              {user.full_name.charAt(0)}
            </Avatar>
          </Badge>

          <Typography variant="h3" sx={{ mt: 3, mb: 1, fontWeight: 700, color: '#212529' }}>
            {user.full_name}
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, fontWeight: 500 }}>
            {user.position.position_name}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ gap: 1.5 }}>
            <Chip
              icon={<BadgeIcon />}
              label={user.employee_code}
              sx={{
                bgcolor: 'white',
                border: '2px solid',
                borderColor: 'primary.main',
                fontWeight: 600,
                px: 1,
                boxShadow: 1
              }}
            />
            <Chip
              icon={<WorkIcon />}
              label={user.department.dept_name}
              sx={{
                bgcolor: 'white',
                border: '2px solid',
                borderColor: 'secondary.main',
                color: 'secondary.main',
                fontWeight: 600,
                px: 1,
                boxShadow: 1
              }}
            />
            <Chip
              icon={<VerifiedIcon />}
              label={user.status}
              color="success"
              sx={{
                fontWeight: 600,
                px: 1,
                boxShadow: 1
              }}
            />
          </Stack>
        </Box>

        {/* Main Content - Fixed Layout */}
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          {/* Left Sidebar - Fixed Width */}
          <Box sx={{ width: 400, flexShrink: 0 }}>
            <Stack spacing={3}>
              {/* Contact Information Card */}
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: '#212529',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <PersonIcon color="primary" />
                    Contact Information
                  </Typography>

                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          flexShrink: 0
                        }}
                      >
                        <EmailIcon />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          Email Address
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: 'success.main',
                          flexShrink: 0
                        }}
                      >
                        <PhoneIcon />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          Phone Number
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {user.phone_number}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: 'warning.main',
                          flexShrink: 0
                        }}
                      >
                        <LocationIcon />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          Address
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {user.address}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: 'info.main',
                          flexShrink: 0
                        }}
                      >
                        <CalendarIcon />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          Hire Date
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatDate(user.hire_date)}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Stack spacing={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setOpenEditDialog(true)}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 2
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<SecurityIcon />}
                      onClick={() => setOpenPasswordDialog(true)}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2
                        }
                      }}
                    >
                      Change Password
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Skills Card */}
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: '#212529',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <SchoolIcon color="primary" />
                    Skills & Technologies
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {user.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="medium"
                        icon={<CheckCircleIcon />}
                        sx={{
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          border: '1px solid',
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          '& .MuiChip-icon': {
                            color: 'primary.main'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Statistics Card */}
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: '#212529',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <TrendingUpIcon color="primary" />
                    Performance Statistics
                  </Typography>

                  <Stack spacing={3}>
                    {/* KPI Score */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body2" fontWeight={600}>
                          KPI Score
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="primary">
                          {user.kpi_score}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={user.kpi_score}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            bgcolor: user.kpi_score >= 80 ? 'success.main' : 'warning.main'
                          }
                        }}
                      />
                    </Box>

                    <Divider />

                    {/* Stats */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px dashed #dee2e6' }}>
                        <Typography variant="body2" color="text.secondary">
                          Working Days
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {user.total_working_days}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px dashed #dee2e6' }}>
                        <Typography variant="body2" color="text.secondary">
                          Completed Tasks
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {user.completed_tasks}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px dashed #dee2e6' }}>
                        <Typography variant="body2" color="text.secondary">
                          Current Projects
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {user.current_projects}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Remaining Leave Days
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="success.main">
                          {user.remaining_leave_days}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>

          {/* Right Content - Flexible Width */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: '#fafafa',
                  '& .MuiTab-root': {
                    minHeight: 64,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'primary.main'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab label="Personal Info" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Work" icon={<WorkIcon />} iconPosition="start" />
                <Tab label="Contracts" icon={<DescriptionIcon />} iconPosition="start" />
                <Tab label="Attendance" icon={<AccessTimeIcon />} iconPosition="start" />
                <Tab label="Leave Requests" icon={<EventNoteIcon />} iconPosition="start" />
              </Tabs>

              <Box sx={{ p: 4 }}>
                {tabValue === 0 && <ProfileInfo user={user} />}
                {tabValue === 1 && <WorkTab user={user} />}
                {tabValue === 2 && <ContractsTab />}
                {tabValue === 3 && <AttendanceTab user={user} />}
                {tabValue === 4 && <LeaveRequestsTab user={user} />}
              </Box>
            </Paper>
          </Box>
        </Box>
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