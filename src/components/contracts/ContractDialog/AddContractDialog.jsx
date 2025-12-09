// src/components/contracts/dialogs/AddContractDialog.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Autocomplete,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  UploadFile as UploadFileIcon,
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { axiosInstance } from '../../../lib/axios';
import { useContracts } from '../../../hooks/useContracts';

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

const AddContractDialog = ({ open, onClose, onSuccess }) => {
  const { createContractWithFile, uploading } = useContracts();
  
  const [formData, setFormData] = useState({
    empId: '',
    contractType: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
  });

  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  // Fetch employees
  const fetchEmployees = useCallback(async (search = '') => {
    setLoadingEmployees(true);
    try {
      const res = await axiosInstance.get('/employees', {
        params: { page: 0, pageSize: 1000 }
      });

      if (res.data?.code === 0) {
        let list = [];
        if (Array.isArray(res.data.data)) list = res.data.data;
        else if (res.data.data?.content) list = res.data.data.content;
        else if (res.data.data?.items) list = res.data.data.items;

        setEmployees(list);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchEmployees('');
      resetForm();
    }
  }, [open, fetchEmployees]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchEmployees]);

  const resetForm = () => {
    setFormData({
      empId: '',
      contractType: '',
      startDate: '',
      endDate: '',
      status: 'ACTIVE',
    });
    setFile(null);
    setErrors({});
    setSubmitError('');
    setSearchTerm('');
    setSelectedEmployee(null);
    setUploadProgress(0);
  };

  // Validate
  const validate = () => {
    const newErrors = {};
    if (!formData.empId) newErrors.empId = 'Employee is required';
    if (!formData.contractType) newErrors.contractType = 'Contract type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEmployeeChange = (event, newValue) => {
    setSelectedEmployee(newValue);
    setFormData(prev => ({
      ...prev,
      empId: newValue ? (newValue.id || newValue.empId) : ''
    }));
    if (errors.empId) setErrors(prev => ({ ...prev, empId: '' }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setSubmitError('Only PDF and Word documents are allowed');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setSubmitError('File must be smaller than 10MB');
      return;
    }

    setFile(selectedFile);
    setSubmitError('');
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileBoxClick = () => fileInputRef.current?.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError('');

    try {
      const contractData = {
        empId: parseInt(formData.empId),
        contractType: formData.contractType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status
      };

      console.log('📤 Submitting contract:', contractData);
      console.log('📎 File:', file);

      // Use the hook's createContractWithFile
      const result = await createContractWithFile(contractData, file);

      if (result?.success) {
        handleClose();
        if (onSuccess) onSuccess(result.data);
      } else {
        setSubmitError(result?.error || 'Failed to create contract');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading || uploading) return;
    resetForm();
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];
  const isSubmitting = loading || uploading;

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <AddIcon sx={{ fontSize: 36 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>Add New Contract</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Create employment contract for employee
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={handleClose} disabled={isSubmitting} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        {/* Upload Progress */}
        {uploading && (
          <LinearProgress color="secondary" />
        )}

        <DialogContent sx={{ mt: 3 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError('')}>
              {submitError}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Employee Search */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={employees}
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                onInputChange={(_, value) => setSearchTerm(value)}
                inputValue={searchTerm}
                getOptionLabel={(opt) => opt ? `${opt.fullName || opt.empName} (ID: ${opt.id || opt.empId})` : ''}
                isOptionEqualToValue={(opt, val) => (opt?.id || opt?.empId) === (val?.id || val?.empId)}
                loading={loadingEmployees}
                disabled={isSubmitting}
                noOptionsText="Type to search employees..."
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search & Select Employee *"
                    placeholder="Enter name or ID..."
                    error={!!errors.empId}
                    helperText={errors.empId || "Start typing to search employees"}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <SearchIcon sx={{ ml: 1, color: 'action.active' }} />,
                      endAdornment: loadingEmployees 
                        ? <CircularProgress size={20} /> 
                        : params.InputProps.endAdornment
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={option.id || option.empId} {...otherProps}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <PersonIcon color="action" />
                        <Box>
                          <Typography fontWeight={600}>
                            {option.fullName || option.empName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {option.id || option.empId} • {option.email || ''} • {option.deptName || ''}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  );
                }}
                filterOptions={(x) => x}
              />
            </Grid>

            {/* Contract Type */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                required
                label="Contract Type"
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                error={!!errors.contractType}
                helperText={errors.contractType}
                disabled={isSubmitting}
              >
                {CONTRACT_TYPES.map(o => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                required
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                error={!!errors.status}
                helperText={errors.status}
                disabled={isSubmitting}
                InputProps={{ 
                  startAdornment: <CheckCircleIcon sx={{ mr: 1, color: 'action.active' }} /> 
                }}
              >
                {CONTRACT_STATUSES.map(o => (
                  <MenuItem key={o.value} value={o.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: o.color 
                        }} 
                      />
                      <span>{o.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                disabled={isSubmitting}
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
                required
                type="date"
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: formData.startDate || today }}
                InputProps={{ 
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} /> 
                }}
              />
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                Contract Document (Optional)
              </Typography>
              
              {!file ? (
                // Upload Area
                <Paper
                  variant="outlined"
                  onClick={handleFileBoxClick}
                  sx={{
                    p: 4,
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    borderColor: 'grey.400',
                    bgcolor: 'grey.50',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    opacity: isSubmitting ? 0.6 : 1,
                    '&:hover': {
                      bgcolor: isSubmitting ? 'grey.50' : 'primary.50',
                      borderColor: isSubmitting ? 'grey.400' : 'primary.main',
                    }
                  }}
                >
                  <CloudUploadIcon 
                    sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} 
                  />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    PDF, DOC, DOCX (Max 10MB)
                  </Typography>
                </Paper>
              ) : (
                // File Preview
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FileIcon sx={{ color: 'white' }} />
                      </Box>
                      <Box>
                        <Typography fontWeight={600} color="primary.main">
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton 
                      onClick={handleRemoveFile} 
                      disabled={isSubmitting}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={isSubmitting} 
            variant="outlined" 
            size="large" 
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            sx={{
              minWidth: 180,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 4px 15px rgba(33,150,243,0.4)',
              '&:hover': { 
                boxShadow: '0 8px 25px rgba(33,150,243,0.5)' 
              }
            }}
          >
            {uploading ? 'Uploading...' : loading ? 'Creating...' : 'Create Contract'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddContractDialog;