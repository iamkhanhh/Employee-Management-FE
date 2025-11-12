import React from 'react';
import { Stack, Paper, Grid, Typography, Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const AttendanceTab = ({ user }) => {
  // Mock recent attendance history
  const recentAttendance = [...Array(5)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return {
      date: date.toLocaleDateString('en-GB'), // format dd/mm/yyyy
      checkIn: '08:30',
      checkOut: '18:00',
      status: 'On time'
    };
  });

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
            <Typography variant="h4" color="white">
              {user.total_working_days}
            </Typography>
            <Typography variant="body2" color="white">
              Total Working Days
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
            <Typography variant="h4" color="white">
              5
            </Typography>
            <Typography variant="body2" color="white">
              Late
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
            <Typography variant="h4" color="white">
              12
            </Typography>
            <Typography variant="body2" color="white">
              Overtime
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
            <Typography variant="h4" color="white">
              2
            </Typography>
            <Typography variant="body2" color="white">
              Absent
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6">Recent Attendance History</Typography>
      {recentAttendance.map((record, index) => (
        <Paper key={index} sx={{ p: 2 }} variant="outlined">
          <Grid container alignItems="center">
            <Grid item xs={12} md={3}>
              <Typography variant="body1">{record.date}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="body2">Check in: {record.checkIn}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon color="error" fontSize="small" />
                <Typography variant="body2">Check out: {record.checkOut}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={3}>
              <Chip label={record.status} color="success" size="small" />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Stack>
  );
};

export default AttendanceTab;
