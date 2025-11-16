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
      {/* HEADER */}
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

            {/* ID */}
            {/* <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Contract ID
              </Typography>
              <Typography fontWeight={600}>#{contract.id}</Typography>
            </Grid> */}

            {/* Employee Name */}
            <Grid item xs={12} md={6}>
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

            {/* Employee ID */}
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Employee ID
              </Typography>
              <Typography fontWeight={600}>{contract.empId}</Typography>
            </Grid>

            {/* Status */}
            {/* <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Chip
                sx={{ mt: 0.5 }}
                icon={getStatusIcon(contract.status)}
                label={contract.status}
                color={getStatusColor(contract.status)}
              />
            </Grid> */}

            {/* Contract Type */}
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Contract Type
              </Typography>
              <Typography variant="body1" fontWeight={600} mt={0.5}>
                {contract.contractType}
              </Typography>
            </Grid>


            {/* Created Date */}
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Created At
              </Typography>
              <Stack direction="row" spacing={1}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography fontWeight={600}>
                  {formatDate(contract.createdAt)}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12}><Divider /></Grid>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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

            {/* File */}
            {contract.fileUrl && (
              <Grid item xs={12}>
                {/* Label phía trên */}
                <Typography variant="caption" color="text.secondary">
                  Contract Document
                </Typography>

                {/* Box chứa file + download phía dưới */}
                <Paper sx={{ p: 2, mt: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {/* Tên file */}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <DescriptionIcon />
                      <Typography fontSize="14px">
                        {contract.fileUrl.split("/").pop()}
                      </Typography>
                    </Stack>
                  </Stack>
                  {/* Nút Download */}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => onDownloadFile(contract.fileUrl, "contract.pdf")}
                  >
                    Download
                  </Button>
                </Paper>
              </Grid>
            )}



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
