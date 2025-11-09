import React from "react";
import { 
  Paper, 
  Typography, 
  Grid, 
  Box,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  IconButton,
} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaidIcon from '@mui/icons-material/Paid';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, color, trend, onClick }) => {
  const colors = {
    blue: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '#667eea' },
    green: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '#f5576c' },
    orange: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '#4facfe' },
    purple: { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '#38f9d7' },
    red: { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '#fa709a' },
    indigo: { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', icon: '#30cfd0' },
  };

  const cardColor = colors[color] || colors.blue;

  return (
    <Card
      sx={{
        height: '100%',
        background: cardColor.bg,
        color: 'white',
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Icon sx={{ fontSize: 28, color: 'white' }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Employees',
      value: '120',
      icon: PeopleIcon,
      color: 'blue',
      trend: '+12% from last month',
      onClick: () => navigate('/admin/employees'),
    },
    {
      title: 'Departments',
      value: '8',
      icon: BusinessIcon,
      color: 'green',
      trend: '2 new this quarter',
      onClick: () => navigate('/admin/departments'),
    },
    {
      title: 'Active Tasks',
      value: '52',
      icon: AssignmentIcon,
      color: 'orange',
      trend: '8 completed today',
      onClick: () => navigate('/admin/tasks'),
    },
    {
      title: 'Attendance Rate',
      value: '96%',
      icon: AccessTimeIcon,
      color: 'purple',
      trend: '+2% from last week',
      onClick: () => navigate('/admin/attendance'),
    },
    {
      title: 'Monthly Payroll',
      value: '$145,200',
      icon: PaidIcon,
      color: 'red',
      trend: 'Processed this month',
      onClick: () => navigate('/admin/payroll'),
    },
    {
      title: 'New Hires',
      value: '8',
      icon: PersonAddIcon,
      color: 'indigo',
      trend: 'This month',
      onClick: () => navigate('/admin/employees'),
    },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome back, Admin! 👋
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Here's what's happening with your organization today.
        </Typography>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions & Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Add Employee', path: '/admin/employees', icon: PersonAddIcon },
                { label: 'Create Contract', path: '/admin/contracts/create', icon: AssignmentIcon },
                { label: 'View Payroll', path: '/admin/payroll', icon: PaidIcon },
                { label: 'Manage Accounts', path: '/admin/account-management', icon: PeopleIcon },
              ].map((action, index) => (
                <Grid item xs={6} key={index}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#2563eb',
                        backgroundColor: '#eff6ff',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <action.icon sx={{ fontSize: 32, color: '#2563eb', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                      {action.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
              System Performance
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Employee Data
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  98%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={98}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#10b981',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Contract Completion
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  85%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={85}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#3b82f6',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Payroll Processing
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  92%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={92}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#f59e0b',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
