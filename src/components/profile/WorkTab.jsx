import React from 'react';
import { Grid, Stack, Box, Typography, Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

const WorkTab = ({ user }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Employee Code
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {user.employee_code}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Department
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {user.department.dept_name}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Position
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {user.position.position_name}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Role in Department
            </Typography>
            <Chip
              label={
                user.role_in_dept === 'HEAD' ? 'Head' :
                  user.role_in_dept === 'DEPUTY' ? 'Deputy' : 'Staff'
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
              Hire Date
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {formatDate(user.hire_date)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Seniority
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {Math.floor((new Date() - new Date(user.hire_date)) / (365 * 24 * 60 * 60 * 1000))} years
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label="Active"
              color="success"
              size="small"
              icon={<CheckCircleIcon />}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Company Email
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {user.email}
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default WorkTab;
