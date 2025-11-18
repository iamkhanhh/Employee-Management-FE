import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Alert,
  IconButton,
  CircularProgress,
  Paper,
  Divider,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const CONTRACT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const CONTRACT_STATUSES = [
  { value: 'ACTIVE', label: 'Active', color: '#4caf50' },
  { value: 'EXPIRED', label: 'Expired', color: '#f44336' },
  { value: 'TERMINATED', label: 'Terminated', color: '#9e9e9e' },
  { value: 'PENDING', label: 'Pending', color: '#ff9800' }
];

const EditContractDialog = ({ open, onClose, onSubmit, contract }) => {
  const [formData, setFormData] = useState({
    contractType: '',
    startDate: '',
    endDate: '',
    fileUrl: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Load contract data khi dialog mở
  useEffect(() => {
    if (contract && open) {
      setFormData({
        contractType: contract.contractType || '',
        startDate: contract.startDate || '',
        endDate: contract.endDate || '',
        fileUrl: contract.fileUrl || '',
        status: contract.status || ''
      });
      setErrors({});
      setSubmitError('');
    }
  }, [contract, open]);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.contractType) {
      newErrors.contractType = 'Contract type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error khi user thay đổi
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setSubmitError('');
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const convertToArray = (dateStr) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-');
        return [parseInt(year), parseInt(month), parseInt(day)];
      };

      const payload = {
        contractType: formData.contractType,
        startDate: convertToArray(formData.startDate),
        endDate: convertToArray(formData.endDate),
        fileUrl: formData.fileUrl || null,
        status: formData.status
      };

      console.log('📤 Sending payload:', payload);

      const result = await onSubmit(payload);

      if (result.success) {
        handleClose();
      } else {
        setSubmitError(result.error || 'Failed to update contract');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!loading) {
      setFormData({
        contractType: '',
        startDate: '',
        endDate: '',
        fileUrl: '',
        status: ''
      });
      setErrors({});
      setSubmitError('');
      onClose();
    }
  };

  if (!contract) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <EditIcon fontSize="large" />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Edit Contract
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Update contract information for {contract.employeeName}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {/* Error Alert */}
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {/* Current Contract Info */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Current Contract Information
            </Typography>
            <Divider sx={{ my: 1 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Employee:</strong> {contract.employeeName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Employee ID:</strong> {contract.empId}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Contract ID:</strong> {contract.id}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Created:</strong> {contract.createdAt}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Form Fields */}
          <Grid container spacing={2}>
            {/* Contract Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Contract Type"
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                error={!!errors.contractType}
                helperText={errors.contractType}
                required
                disabled={loading}
                InputProps={{
                  startAdornment: <CategoryIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              >
                {CONTRACT_TYPES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                error={!!errors.status}
                helperText={errors.status}
                required
                disabled={loading}
                InputProps={{
                  startAdornment: <CheckCircleIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              >
                {CONTRACT_STATUSES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: option.color
                        }}
                      />
                      <span>{option.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            {/* File URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="File URL (Optional)"
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.com/contract.pdf"
                InputProps={{
                  startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                helperText="Enter the URL of the contract document"
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5568d3 30%, #6a4291 90%)',
              }
            }}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditContractDialog;