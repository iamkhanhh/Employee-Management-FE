import React from 'react';
import { Grid, Card, CardContent, Stack, Box, Typography } from '@mui/material';
import {
  WorkHistory as WorkHistoryIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <Card sx={{ 
    background: gradient,
    color: 'white',
    height: '100%'
  }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
        </Box>
        <Icon sx={{ fontSize: 40, opacity: 0.3 }} />
      </Stack>
    </CardContent>
  </Card>
);

const ContractStats = ({ stats }) => {
  const statsConfig = [
    {
      title: "Tổng số hợp đồng",
      value: stats.total,
      icon: WorkHistoryIcon,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: "Đang hiệu lực",
      value: stats.active,
      icon: BadgeIcon,
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)'
    },
    {
      title: "Sắp hết hạn",
      value: stats.expiringSoon,
      icon: CalendarIcon,
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)'
    },
    {
      title: "Đã hết hạn",
      value: stats.expired,
      icon: DescriptionIcon,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
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

export default ContractStats;