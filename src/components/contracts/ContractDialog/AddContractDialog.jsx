// components/contracts/ContractDialog/AddContractDialog.jsx

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
  MenuItem,
  Grid,
  Divider,
  Autocomplete
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import {apiClient} from '../../../services/api';

const CONTRACT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

const CONTRACT_STATUSES = [
  { value: 'ACTIVE', label: 'Active', color: '#4caf50' },
  { value: 'PENDING', label: 'Pending', color: '#ff9800' },
  { value: 'EXPIRED', label: 'Expired', color: '#f44336' },
  { value: 'TERMINATED', label: 'Terminated', color: '#9e9e9e' }
];

const AddContractDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    empId: '',
    contractType: '',
    startDate: '',
    endDate: '',
    fileUrl: '',
    status: 'ACTIVE' // Default value
  });

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch employees khi dialog mở
  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  // Fetch danh sách employees
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await apiClient.get('/employees', {
        params: { page: 0, pageSize: 1000 } // Lấy hết employees
      });
      
      if (res.data?.code === 0) {
        setEmployees(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.empId) {
      newErrors.empId = 'Employee is required';
    }

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

    // Validate file URL if provided
    if (formData.fileUrl && formData.fileUrl.trim()) {
      const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
      if (!urlPattern.test(formData.fileUrl)) {
        newErrors.fileUrl = 'Please enter a valid URL';
      }
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

  // Handle employee select
  const handleEmployeeChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      empId: newValue ? newValue.id : ''
    }));

    if (errors.empId) {
      setErrors(prev => ({
        ...prev,
        empId: ''
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
      const result = await onSubmit({
        empId: parseInt(formData.empId),
        contractType: formData.contractType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        fileUrl: formData.fileUrl.trim() || null,
        status: formData.status
      });

      if (result.success) {
        handleClose();
      } else {
        setSubmitError(result.error || 'Failed to create contract');
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
        empId: '',
        contractType: '',
        startDate: '',
        endDate: '',
        fileUrl: '',
        status: 'ACTIVE'
      });
      setErrors({});
      setSubmitError('');
      onClose();
    }
  };

  // Get today's date for min date
  const today = new Date().toISOString().split('T')[0];

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
          background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AddIcon fontSize="large" />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Add New Contract
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Create a new employment contract
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
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Employee Selection */}
            <Grid item xs={12}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.empName} (ID: ${option.id})`}
                loading={loadingEmployees}
                onChange={handleEmployeeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Employee *"
                    error={!!errors.empId}
                    helperText={errors.empId}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      endAdornment: (
                        <>
                          {loadingEmployees ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Contract Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Contract Type *"
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                error={!!errors.contractType}
                helperText={errors.contractType}
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
                label="Status *"
                name="status"
                value={formData.status}
                onChange={handleChange}
                error={!!errors.status}
                helperText={errors.status}
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
                label="Start Date *"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
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
                label="End Date *"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: formData.startDate || today }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            {/* File URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contract File URL (Optional)"
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleChange}
                error={!!errors.fileUrl}
                helperText={errors.fileUrl || 'Enter the URL of the contract document'}
                disabled={loading}
                placeholder="https://example.com/contracts/contract.pdf"
                InputProps={{
                  startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
          </Grid>

          {/* Info Box */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: 'info.lighter',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'info.light'
            }}
          >
            <Typography variant="caption" color="info.dark">
              <strong>Note:</strong> All fields marked with (*) are required. 
              Make sure to select a valid employee and set appropriate contract dates.
            </Typography>
          </Box>
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
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
              }
            }}
          >
            {loading ? 'Creating...' : 'Create Contract'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddContractDialog;