import React from 'react';
import { Grid, Card, CardContent, Stack, Box, Typography, Avatar } from '@mui/material';
import {
  Business as BusinessIcon,
  Groups as GroupsIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import CountUp from 'react-countup';

const StatCard = ({ title, value, icon: Icon, gradient, description }) => (
  <Card sx={{ 
    height: '100%',
    background: gradient,
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      transition: 'transform 0.3s ease'
    }
  }}>
    <CardContent>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              <CountUp end={value} duration={2} />
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 500 }}>
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                {description}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            width: 56,
            height: 56
          }}>
            <Icon sx={{ fontSize: 30, color: 'white' }} />
          </Avatar>
        </Box>
      </Stack>
    </CardContent>
    {/* Decorative element */}
    <Box sx={{
      position: 'absolute',
      bottom: -20,
      right: -20,
      width: 100,
      height: 100,
      borderRadius: '50%',
      bgcolor: 'rgba(255, 255, 255, 0.1)'
    }} />
  </Card>
);

const DepartmentStats = ({ stats }) => {
  const statsConfig = [
    {
      title: "Tổng phòng ban",
      value: stats.total,
      icon: BusinessIcon,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: "Đang hoạt động"
    },
    {
      title: "Tổng nhân viên",
      value: stats.totalEmployees,
      icon: GroupsIcon,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: `${stats.avgEmployeesPerDept} nhân viên/phòng`
    },
    {
      title: "Phòng ban mới",
      value: stats.newThisMonth,
      icon: PersonAddIcon,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: "Trong tháng này"
    },
    {
      title: "Tỷ lệ tăng trưởng",
      value: stats.growthRate,
      icon: TrendingUpIcon,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: "So với tháng trước"
    }
  ];

  return (
    <Grid container spacing={3}>
      {statsConfig.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DepartmentStats;