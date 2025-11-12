import React from 'react';
import { Stack, Paper, Grid, Typography, Chip, Button, Alert } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Add as AddIcon } from '@mui/icons-material';

const LeaveRequestsTab = ({ user }) => {
  // Mock leave history data
  const leaveHistory = [
    {
      date: '15/03/2024 - 17/03/2024',
      type: 'Annual Leave',
      reason: 'Going home',
      status: 'Approved'
    },
    {
      date: '01/02/2024',
      type: 'Sick Leave',
      reason: 'Illness',
      status: 'Approved'
    }
  ];

  return (
    <Stack spacing={3}>
      <Alert severity="info">
        You have {user.remaining_leave_days} leave days remaining this year
      </Alert>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {user.total_leave_days}
            </Typography>
            <Typography variant="body2">
              Total leave days/year
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error">
              {user.total_leave_days - user.remaining_leave_days}
            </Typography>
            <Typography variant="body2">
              Used
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success">
              {user.remaining_leave_days}
            </Typography>
            <Typography variant="body2">
              Remaining
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ alignSelf: 'flex-start' }}
      >
        Create Leave Request
      </Button>

      <Typography variant="h6">Leave History</Typography>
      {leaveHistory.map((leave, index) => (
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
                label="Approved"
                color="success"
                size="small"
                icon={<CheckCircleIcon />}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Stack>
  );
};

export default LeaveRequestsTab;
