import React, { useEffect, useState } from 'react';
import { Stack, Paper, Grid, Typography, Chip, Alert, Button, CircularProgress, Box } from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';
import { useContracts } from '../../hooks/useContracts';
import { useAuth } from '../../hooks/useAuth';
import { ViewDocumentDialog } from '../EmployeeDocument/EmployeeDocumentDialogs';

const ContractsTab = () => {
  const { contracts, loading, error, fetchContracts } = useContracts();
  const { employeeInfo } = useAuth();
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    if (employeeInfo?.id) {
      fetchContracts({ empId: employeeInfo.id });
    }
  }, [fetchContracts, employeeInfo]);
  useEffect(() => {
    console.log('Preview file changed:', previewFile);
  }, [previewFile]);
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const activeContract = contracts.find(c => c.status === 'ACTIVE');

  return (
    <>
      <Stack spacing={2}>
        {activeContract ? (
          <Alert severity="info">
            The current contract is valid until {formatDate(activeContract.endDate)}
          </Alert>
        ) : (
          <Alert severity="warning">No active contract found.</Alert>
        )}

        {contracts.map((contract, index) => (
          <Paper key={index} sx={{ p: 2 }} variant="outlined">
            <Grid container alignItems="center">
              <Grid item xs={12} md={3}>
                <Typography variant="body1" fontWeight={500}>
                  {contract.contractType}
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
                {contract.fileUrl && (
                  <Button size="small" startIcon={<DescriptionIcon />} onClick={() => setPreviewFile(contract)}>
                    View File
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
      <ViewDocumentDialog
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        document={previewFile}
      />
    </>
  );
};

export default ContractsTab;
