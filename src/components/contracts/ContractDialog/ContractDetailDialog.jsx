import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Download as DownloadIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const ContractDetailDialog = ({
  open,
  onClose,
  contractId,
  fetchContractDetail,
  onDownloadFile
}) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================================
  // LOAD CONTRACT DETAIL
  // ================================
  useEffect(() => {
    if (!open || !contractId) return;

    const loadDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchContractDetail(contractId); // res = detail
        console.log("DETAIL RECEIVED:", res);
        setContract(res || null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [open, contractId, fetchContractDetail]);


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'expired': return 'error';
      case 'pending': return 'warning';
      case 'terminated': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return <CheckCircleIcon fontSize="small" />;
      case 'expired':
      case 'terminated': return <CancelIcon fontSize="small" />;
      case 'pending': return <PendingIcon fontSize="small" />;
      default: return null;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch {
      return date;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ elevation: 5, sx: { borderRadius: 2 } }}
    >
      {/* HEADER - giữ nguyên như cũ */}
      <DialogTitle sx={{ backgroundColor: '#f5f5f5' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <ArticleIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Contract Details
            </Typography>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      {/* CONTENT */}
      <DialogContent sx={{ mt: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">
            Failed to load contract details. Please try again.
          </Alert>
        ) : !contract ? (
          <Alert severity="warning">No contract data available</Alert>
        ) : (
          <Grid container spacing={3}>

            {/* === PHẦN TRÊN: Employee Name, ID, Contract Type, Created At === */}
            <Grid size={3}>
              <Typography variant="caption" color="text.secondary">
                Employee Name
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon fontSize="small" color="action" />
                <Typography fontWeight={600}>
                  {contract.employeeName}
                </Typography>
              </Stack>
            </Grid>

            <Grid size={3}>
              <Typography variant="caption" color="text.secondary">
                Employee ID
              </Typography>
              <Typography fontWeight={600}>{contract.empId}</Typography>
            </Grid>

            <Grid size={3}>
              <Typography variant="caption" color="text.secondary">
                Contract Type
              </Typography>
              <Typography variant="body1" fontWeight={600} mt={0.5}>
                {contract.contractType}
              </Typography>
            </Grid>




            {/* === DƯỚI CÙNG: Start Date + End Date + Contract Document === */}


            {/* Start Date */}
            <Grid size={4}>
              <Typography variant="caption" color="text.secondary">
                Start Date
              </Typography>
              <Paper sx={{ p: 2, mt: 0.5, background: '#e3f2fd' }}>
                <Stack direction="row" spacing={1}>
                  <CalendarIcon color="primary" />
                  <Typography fontWeight={600} color="primary">
                    {formatDate(contract.startDate)}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            {/* End Date */}
            <Grid size={4}>
              <Typography variant="caption" color="text.secondary">
                End Date
              </Typography>
              <Paper sx={{ p: 2, mt: 0.5, background: '#ffebee' }}>
                <Stack direction="row" spacing={1}>
                  <CalendarIcon color="error" />
                  <Typography fontWeight={600} color="error">
                    {formatDate(contract.endDate)}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

             <iframe
              src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(contract.fileUrl)}`}
              width="100%"
              height="800px"
              style={{ border: "none" }}
            ></iframe>

          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractDetailDialog;
