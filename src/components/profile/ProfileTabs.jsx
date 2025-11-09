import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Divider,
  Badge,
  Tooltip,
  Rating,
  TextField,
  InputAdornment,
  AvatarGroup
} from '@mui/material';

// Timeline import từ @mui/lab
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';

import {
  Person as PersonIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  EventNote as EventNoteIcon,
  School as SchoolIcon,
  EmojiEvents as AwardIcon,
  AttachMoney as SalaryIcon,
  Assessment as AssessmentIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Cake as CakeIcon,
  Home as HomeIcon,
  Wc as GenderIcon,
  ContactPhone as ContactPhoneIcon,
  Language as LanguageIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assignment as TaskIcon,
  Group as TeamIcon,
  StarBorder as StarIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Favorite as HeartIcon,
  FitnessCenter as HealthIcon,
  DirectionsCar as CarIcon,
  CreditCard as CardIcon
} from '@mui/icons-material';

import { formatDate } from '../../utils/dateUtils';

// Tab Panel Component
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProfileTabs = ({ user }) => {
  const [tabValue, setTabValue] = useState(0);
  const [expandedActivities, setExpandedActivities] = useState({});

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mock data for various sections
  const mockActivities = [
    {
      id: 1,
      date: '2024-03-20',
      type: 'achievement',
      title: 'Hoàn thành dự án X',
      description: 'Hoàn thành dự án trước deadline 3 ngày',
      icon: <AwardIcon />,
      color: 'success'
    },
    {
      id: 2,
      date: '2024-03-15',
      type: 'training',
      title: 'Tham gia khóa học ReactJS Advanced',
      description: 'Hoàn thành khóa học với điểm 95/100',
      icon: <SchoolIcon />,
      color: 'primary'
    },
    {
      id: 3,
      date: '2024-03-10',
      type: 'leave',
      title: 'Nghỉ phép',
      description: 'Nghỉ phép cá nhân',
      icon: <EventNoteIcon />,
      color: 'warning'
    },
    {
      id: 4,
      date: '2024-03-01',
      type: 'promotion',
      title: 'Thăng chức',
      description: 'Được thăng chức lên Senior Developer',
      icon: <TrendingUpIcon />,
      color: 'error'
    }
  ];

  const mockDocuments = [
    {
      id: 1,
      name: 'Hợp đồng lao động 2024',
      type: 'contract',
      uploadDate: '2024-01-01',
      size: '2.5 MB',
      status: 'active'
    },
    {
      id: 2,
      name: 'Bằng cấp - Đại học',
      type: 'certificate',
      uploadDate: '2023-01-15',
      size: '1.2 MB',
      status: 'verified'
    },
    {
      id: 3,
      name: 'Chứng chỉ ReactJS',
      type: 'certificate',
      uploadDate: '2024-02-20',
      size: '800 KB',
      status: 'verified'
    },
    {
      id: 4,
      name: 'Giấy khám sức khỏe',
      type: 'health',
      uploadDate: '2024-01-10',
      size: '3.1 MB',
      status: 'active'
    }
  ];

  const mockTrainings = [
    {
      id: 1,
      name: 'ReactJS Advanced',
      provider: 'Udemy',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      status: 'completed',
      score: 95,
      certificate: true
    },
    {
      id: 2,
      name: 'Project Management',
      provider: 'Internal',
      startDate: '2024-03-15',
      endDate: '2024-04-15',
      status: 'in-progress',
      progress: 60,
      certificate: false
    },
    {
      id: 3,
      name: 'AWS Cloud Practitioner',
      provider: 'AWS',
      startDate: '2024-04-01',
      endDate: '2024-05-01',
      status: 'upcoming',
      certificate: true
    }
  ];

  const mockBenefits = [
    {
      id: 1,
      type: 'insurance',
      name: 'Bảo hiểm sức khỏe',
      provider: 'Bảo Việt',
      coverage: '100 triệu/năm',
      status: 'active',
      icon: <HealthIcon />
    },
    {
      id: 2,
      type: 'allowance',
      name: 'Phụ cấp ăn trưa',
      amount: '1,000,000 VNĐ/tháng',
      status: 'active',
      icon: <HeartIcon />
    },
    {
      id: 3,
      type: 'allowance',
      name: 'Phụ cấp xăng xe',
      amount: '500,000 VNĐ/tháng',
      status: 'active',
      icon: <CarIcon />
    },
    {
      id: 4,
      type: 'bonus',
      name: 'Thưởng hiệu suất',
      amount: 'Theo KPI',
      status: 'active',
      icon: <AwardIcon />
    }
  ];

  const mockSalaryHistory = [
    {
      period: '2024-03',
      basic: 20000000,
      allowance: 3000000,
      bonus: 5000000,
      deduction: 2000000,
      net: 26000000,
      status: 'paid'
    },
    {
      period: '2024-02',
      basic: 20000000,
      allowance: 3000000,
      bonus: 3000000,
      deduction: 2000000,
      net: 24000000,
      status: 'paid'
    },
    {
      period: '2024-01',
      basic: 18000000,
      allowance: 3000000,
      bonus: 8000000,
      deduction: 1800000,
      net: 27200000,
      status: 'paid'
    }
  ];

  const getDocumentIcon = (type) => {
    switch(type) {
      case 'contract': return <DescriptionIcon />;
      case 'certificate': return <SchoolIcon />;
      case 'health': return <HealthIcon />;
      default: return <DescriptionIcon />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Paper sx={{ width: '100%', borderRadius: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minHeight: 64,
              fontWeight: 500
            }
          }}
        >
          <Tab label="Tổng quan" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Công việc" icon={<WorkIcon />} iconPosition="start" />
          <Tab label="Tài liệu" icon={<DescriptionIcon />} iconPosition="start" />
          <Tab label="Đào tạo" icon={<SchoolIcon />} iconPosition="start" />
          <Tab label="Lương & Phúc lợi" icon={<SalaryIcon />} iconPosition="start" />
          <Tab label="Đánh giá" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Hoạt động" icon={<AccessTimeIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Tab 1: Tổng quan */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Quick Stats */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Card sx={{ 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Typography variant="h4">{user.kpi_score}%</Typography>
                      <Typography variant="body2">KPI Score</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Typography variant="h4">{user.completed_tasks}</Typography>
                      <Typography variant="body2">Tasks Done</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Typography variant="h4">{user.total_working_days}</Typography>
                      <Typography variant="body2">Ngày công</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Typography variant="h4">{user.current_projects}</Typography>
                      <Typography variant="body2">Dự án</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thông tin cá nhân
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Họ và tên"
                        secondary={user.full_name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <GenderIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Giới tính"
                        secondary={user.gender}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CakeIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Ngày sinh"
                        secondary={formatDate(user.dob)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <HomeIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Địa chỉ"
                        secondary={user.address}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thông tin liên hệ
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email"
                        secondary={user.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Điện thoại"
                        secondary={user.phone_number}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ContactPhoneIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Liên hệ khẩn cấp"
                        secondary={`${user.emergency_name} (${user.emergency_relation}) - ${user.emergency_contact}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LanguageIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Ngôn ngữ"
                        secondary={
                          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                            {user.languages.map((lang, idx) => (
                              <Chip key={idx} label={lang} size="small" />
                            ))}
                          </Stack>
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Skills */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Kỹ năng chuyên môn
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {user.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="primary"
                        variant="outlined"
                        icon={<StarIcon />}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Công việc */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {/* Work Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thông tin công việc
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Mã nhân viên
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user.employee_code}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Phòng ban
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user.department.dept_name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Vị trí
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user.position.position_name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Ngày vào làm
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(user.hire_date)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Thâm niên
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {Math.floor((new Date() - new Date(user.hire_date)) / (365 * 24 * 60 * 60 * 1000))} năm
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Team Members */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Thành viên cùng team
                  </Typography>
                  <List>
                    {[
                      { name: 'Nguyễn Văn B', role: 'Team Lead', avatar: 'B' },
                      { name: 'Trần Thị C', role: 'Developer', avatar: 'C' },
                      { name: 'Lê Văn D', role: 'Designer', avatar: 'D' }
                    ].map((member, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar>{member.avatar}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.name}
                          secondary={member.role}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" size="small">
                            <EmailIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ mt: 2 }}>
                    <AvatarGroup max={4}>
                      <Avatar>B</Avatar>
                      <Avatar>C</Avatar>
                      <Avatar>D</Avatar>
                      <Avatar>+5</Avatar>
                    </AvatarGroup>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Current Projects */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dự án hiện tại
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên dự án</TableCell>
                          <TableCell>Vai trò</TableCell>
                          <TableCell>Tiến độ</TableCell>
                          <TableCell>Deadline</TableCell>
                          <TableCell>Trạng thái</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          {
                            name: 'E-commerce Platform',
                            role: 'Frontend Lead',
                            progress: 75,
                            deadline: '2024-04-30',
                            status: 'on-track'
                          },
                          {
                            name: 'Mobile Banking App',
                            role: 'Developer',
                            progress: 45,
                            deadline: '2024-06-15',
                            status: 'on-track'
                          },
                          {
                            name: 'Admin Dashboard',
                            role: 'Developer',
                            progress: 90,
                            deadline: '2024-03-31',
                            status: 'near-deadline'
                          }
                        ].map((project, index) => (
                          <TableRow key={index}>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>{project.role}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={project.progress} 
                                  sx={{ width: 100, height: 6, borderRadius: 3 }}
                                />
                                <Typography variant="body2">{project.progress}%</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{formatDate(project.deadline)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={project.status === 'on-track' ? 'Đúng tiến độ' : 'Gần deadline'}
                                color={project.status === 'on-track' ? 'success' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Tài liệu */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {/* Upload Section */}
            <Grid item xs={12}>
              <Alert severity="info">
                Vui lòng upload các tài liệu quan trọng như: Bằng cấp, chứng chỉ, giấy khám sức khỏe...
              </Alert>
            </Grid>

            {/* Documents List */}
            {mockDocuments.map((doc) => (
              <Grid item xs={12} md={6} key={doc.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                          {getDocumentIcon(doc.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {doc.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {doc.size} • {formatDate(doc.uploadDate)}
                          </Typography>
                        </Box>
                      </Box>
                      {doc.status === 'verified' && (
                        <Chip 
                          label="Đã xác thực" 
                          color="success" 
                          size="small"
                          icon={<CheckCircleIcon />}
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<DownloadIcon />}>
                      Tải xuống
                    </Button>
                    <Button size="small" startIcon={<PrintIcon />}>
                      In
                    </Button>
                    <Button size="small" startIcon={<ShareIcon />}>
                      Chia sẻ
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}

            {/* Upload Button */}
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ borderStyle: 'dashed' }}
                >
                  Tải lên tài liệu mới
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 4: Đào tạo */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            {mockTrainings.map((training) => (
              <Grid item xs={12} key={training.id}>
                <Card>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                            <SchoolIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={500}>
                              {training.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {training.provider}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(training.startDate)} - {formatDate(training.endDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        {training.status === 'completed' ? (
                          <Box>
                            <Chip 
                              label="Hoàn thành" 
                              color="success" 
                              size="small"
                              icon={<CheckCircleIcon />}
                            />
                            {training.score && (
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                Điểm: {training.score}/100
                              </Typography>
                            )}
                          </Box>
                        ) : training.status === 'in-progress' ? (
                          <Box>
                            <Chip 
                              label="Đang học" 
                              color="warning" 
                              size="small"
                            />
                            <LinearProgress 
                              variant="determinate" 
                              value={training.progress} 
                              sx={{ mt: 1, height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        ) : (
                          <Chip 
                            label="Sắp tới" 
                            color="info" 
                            size="small"
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} md={2} textAlign="right">
                        {training.certificate && training.status === 'completed' ? (
                          <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                            Chứng chỉ
                          </Button>
                        ) : training.certificate ? (
                          <Chip label="Có chứng chỉ" size="small" />
                        ) : null}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 5: Lương & Phúc lợi */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            {/* Benefits */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Phúc lợi
              </Typography>
              <Grid container spacing={2}>
                {mockBenefits.map((benefit) => (
                  <Grid item xs={12} md={6} key={benefit.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                            {benefit.icon}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="subtitle1">
                              {benefit.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {benefit.amount || benefit.coverage || benefit.provider}
                            </Typography>
                          </Box>
                          <Chip 
                            label="Active" 
                            color="success" 
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Salary History */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Lịch sử lương
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell>Tháng</TableCell>
                      <TableCell align="right">Lương cơ bản</TableCell>
                      <TableCell align="right">Phụ cấp</TableCell>
                      <TableCell align="right">Thưởng</TableCell>
                      <TableCell align="right">Khấu trừ</TableCell>
                      <TableCell align="right">Thực nhận</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockSalaryHistory.map((salary, index) => (
                      <TableRow key={index}>
                        <TableCell>{salary.period}</TableCell>
                        <TableCell align="right">{formatCurrency(salary.basic)}</TableCell>
                        <TableCell align="right">{formatCurrency(salary.allowance)}</TableCell>
                        <TableCell align="right">{formatCurrency(salary.bonus)}</TableCell>
                        <TableCell align="right" sx={{ color: 'error.main' }}>
                          -{formatCurrency(salary.deduction)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {formatCurrency(salary.net)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="Đã thanh toán" 
                            color="success" 
                            size="small"
                            icon={<CheckCircleIcon />}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 6: Đánh giá */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            {/* KPI Score */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    KPI Tổng quan
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h2" color="primary">
                      {user.kpi_score}%
                    </Typography>
                    <Rating value={user.kpi_score / 20} readOnly size="large" sx={{ mt: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Xuất sắc
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Chart */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Chi tiết đánh giá
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      { name: 'Chất lượng công việc', score: 95 },
                      { name: 'Hiệu suất làm việc', score: 88 },
                      { name: 'Kỹ năng teamwork', score: 92 },
                      { name: 'Sáng tạo & Đổi mới', score: 85 },
                      { name: 'Tuân thủ deadline', score: 90 }
                    ].map((item, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{item.name}</Typography>
                          <Typography variant="body2" fontWeight={600}>{item.score}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={item.score} 
                          sx={{ height: 8, borderRadius: 4 }}
                          color={item.score >= 90 ? 'success' : item.score >= 70 ? 'primary' : 'warning'}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Reviews */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Lịch sử đánh giá
                  </Typography>
                  <List>
                    {[
                      {
                        period: 'Q1/2024',
                        score: 92,
                        reviewer: 'Nguyễn Văn A',
                        comment: 'Hoàn thành xuất sắc các mục tiêu đề ra'
                      },
                      {
                        period: 'Q4/2023',
                        score: 88,
                        reviewer: 'Nguyễn Văn A',
                        comment: 'Cần cải thiện kỹ năng quản lý thời gian'
                      },
                      {
                        period: 'Q3/2023',
                        score: 85,
                        reviewer: 'Nguyễn Văn A',
                        comment: 'Làm việc tốt, có tiến bộ rõ rệt'
                      }
                    ].map((review, index) => (
                      <ListItem key={index} divider>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {review.score}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1">{review.period}</Typography>
                              <Rating value={review.score / 20} readOnly size="small" />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2">{review.comment}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Người đánh giá: {review.reviewer}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 7: Hoạt động */}
        <TabPanel value={tabValue} index={6}>
          <Timeline position="alternate">
            {mockActivities.map((activity, index) => (
              <TimelineItem key={activity.id}>
                <TimelineOppositeContent color="text.secondary">
                  <Typography variant="body2">
                    {formatDate(activity.date)}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={activity.color}>
                    {activity.icon}
                  </TimelineDot>
                  {index < mockActivities.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {activity.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default ProfileTabs;