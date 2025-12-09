// src/pages/profile/MyProfile.jsx
import React, { useState, useEffect } from 'react';
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
  useTheme,
  CircularProgress,
  Skeleton,
  Alert
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
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
  BeachAccess as BeachAccessIcon,
  PendingActions as PendingActionsIcon
} from '@mui/icons-material';
import ProfileInfo from '../../components/profile/ProfileInfo';
import ChangePasswordDialog from '../../components/profile/ChangePasswordDialog';
import EditProfileDialog from '../../components/profile/EditProfileDialog';
import { formatDate } from '../../utils/dateUtils';
import ContractsTab from '../../components/profile/ContractsTab';
import { useAuth } from '../../hooks/useAuth';
import { usePerformanceStatistics } from '../../hooks/usePerformanceStatistics';

const MyProfile = () => {
  const { user: authUser, isLoading } = useAuth();
  const { 
    statistics, 
    isLoading: statsLoading, 
    error: statsError, 
    refetch: refetchStats 
  } = usePerformanceStatistics();
  
  const [tabValue, setTabValue] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [user, setUser] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h5">User not found. Please log in.</Typography>
      </Box>
    );
  }

  // Statistics Loading Skeleton Component
  const StatisticsSkeleton = () => (
    <Stack spacing={3}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Skeleton width={100} height={20} />
          <Skeleton width={50} height={28} />
        </Box>
        <Skeleton variant="rounded" height={10} />
      </Box>
      <Divider />
      {[1, 2, 3, 4, 5].map((item) => (
        <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', pb: 2, borderBottom: '1px dashed #dee2e6' }}>
          <Skeleton width={120} height={20} />
          <Skeleton width={40} height={28} />
        </Box>
      ))}
    </Stack>
  );

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
              {user?.fullName?.charAt(0)}
            </Avatar>
          </Badge>

          <Typography variant="h3" sx={{ mt: 3, mb: 1, fontWeight: 700, color: '#212529' }}>
            {user.fullName}
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, fontWeight: 500 }}>
            {user?.position?.position_name}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ gap: 1.5 }}>
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

              {/* Statistics Card - Updated */}
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#212529',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <TrendingUpIcon color="primary" />
                      Performance Statistics
                    </Typography>
                    <Tooltip title="Refresh Statistics">
                      <IconButton 
                        size="small" 
                        onClick={refetchStats}
                        disabled={statsLoading}
                      >
                        <RefreshIcon 
                          sx={{ 
                            animation: statsLoading ? 'spin 1s linear infinite' : 'none',
                            '@keyframes spin': {
                              '0%': { transform: 'rotate(0deg)' },
                              '100%': { transform: 'rotate(360deg)' }
                            }
                          }} 
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {statsError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {statsError}
                    </Alert>
                  )}

                  {statsLoading ? (
                    <StatisticsSkeleton />
                  ) : statistics ? (
                    <Stack spacing={3}>
                      {/* Task Completion Rate */}
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="body2" fontWeight={600}>
                            Task Completion Rate
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="primary">
                            {statistics.taskCompletionRate || 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={statistics.taskCompletionRate || 0}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                              bgcolor: (statistics.taskCompletionRate || 0) >= 80 ? 'success.main' : 
                                       (statistics.taskCompletionRate || 0) >= 50 ? 'warning.main' : 'error.main'
                            }
                          }}
                        />
                      </Box>

                      <Divider />

                      {/* Stats */}
                      <Box>
                        {/* Working Days This Month */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 2, 
                            pb: 2, 
                            borderBottom: '1px dashed #dee2e6' 
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: 'info.main'
                              }}
                            >
                              <CalendarIcon fontSize="small" />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Working Days (This Month)
                            </Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={700}>
                            {statistics.workingDaysThisMonth || 0}
                          </Typography>
                        </Box>

                        {/* Completed Tasks */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 2, 
                            pb: 2, 
                            borderBottom: '1px dashed #dee2e6' 
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: 'success.main'
                              }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Completed Tasks
                            </Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={700}>
                            <Box component="span" sx={{ color: 'success.main' }}>
                              {statistics.completedTasksThisMonth || 0}
                            </Box>
                            <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                              /{statistics.totalTasksThisMonth || 0}
                            </Box>
                          </Typography>
                        </Box>

                        {/* Overtime Hours */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 2, 
                            pb: 2, 
                            borderBottom: '1px dashed #dee2e6' 
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                color: 'warning.main'
                              }}
                            >
                              <TimerIcon fontSize="small" />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Overtime Hours
                            </Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={700}>
                            {statistics.overtimeHoursThisMonth || 0}h
                          </Typography>
                        </Box>

                        {/* Remaining Leave Days */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 2, 
                            pb: 2, 
                            borderBottom: '1px dashed #dee2e6' 
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                color: 'secondary.main'
                              }}
                            >
                              <BeachAccessIcon fontSize="small" />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Remaining Leave Days
                            </Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={700} color="success.main">
                            {statistics.remainingLeaveDays || 0}
                          </Typography>
                        </Box>

                        {/* Pending Leave Requests */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                color: 'error.main'
                              }}
                            >
                              <PendingActionsIcon fontSize="small" />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Pending Leave Requests
                            </Typography>
                          </Box>
                          <Chip 
                            label={statistics.pendingLeaveRequests || 0} 
                            size="small"
                            color={statistics.pendingLeaveRequests > 0 ? "warning" : "default"}
                            sx={{ fontWeight: 700 }}
                          />
                        </Box>
                      </Box>
                    </Stack>
                  ) : (
                    <Typography color="text.secondary" align="center">
                      No statistics available
                    </Typography>
                  )}
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
                <Tab label="Contracts" icon={<DescriptionIcon />} iconPosition="start" />
              </Tabs>

              <Box sx={{ p: 4 }}>
                {tabValue === 0 && <ProfileInfo user={user} />}
                {tabValue === 1 && <ContractsTab />}
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