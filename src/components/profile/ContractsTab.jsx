import React from 'react';
import { Stack, Paper, Grid, Typography, Chip, Alert, Button } from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

const ContractsTab = () => {
  // Mock contract data
  const contracts = [
    {
      type: 'Labor Contract',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      status: 'ACTIVE',
      file: 'HD_2024.pdf'
    },
    {
      type: 'Probation Contract',
      startDate: '2023-01-15',
      endDate: '2023-03-15',
      status: 'COMPLETED',
      file: 'HD_TV_2023.pdf'
    }
  ];

  return (
    <Stack spacing={2}>
      <Alert severity="info">
        The current contract is valid until 01/01/2025
      </Alert>

      {contracts.map((contract, index) => (
        <Paper key={index} sx={{ p: 2 }} variant="outlined">
          <Grid container alignItems="center">
            <Grid item xs={12} md={3}>
              <Typography variant="body1" fontWeight={500}>
                {contract.type}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Chip
                label={contract.status === 'ACTIVE' ? 'Active' : 'Completed'}
                color={contract.status === 'ACTIVE' ? 'success' : 'default'}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3} textAlign="right">
              <Button size="small" startIcon={<DescriptionIcon />}>
                {contract.file}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Stack>
  );
};

export default ContractsTab;
