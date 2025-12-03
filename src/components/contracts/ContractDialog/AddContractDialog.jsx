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
  Divider,
  Autocomplete,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  UploadFile as UploadFileIcon
} from '@mui/icons-material';
import { axiosInstance } from '../../../lib/axios';

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
    status: 'ACTIVE',
    file: null,        // ← New: file object
    fileName: ''       // ← Display name
  });

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
      setSearchTerm('');
      setSelectedEmployee(null);
    }
  }, [open, fetchEmployees]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchEmployees]);

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
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      setSubmitError('Only PDF files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setSubmitError('File must be smaller than 10MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      file,
      fileName: file.name
    }));
    setSubmitError('');
  };

  const handleFileBoxClick = () => fileInputRef.current?.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError('');

    try {
      const payload = {
        empId: parseInt(formData.empId),
        contractType: formData.contractType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        file: formData.file || undefined
      };

      const result = await onSubmit(payload);
      if (result?.success) handleClose();
      else setSubmitError(result?.error || 'Failed to create contract');
    } catch (err) {
      setSubmitError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setFormData({
      empId: '', contractType: '', startDate: '', endDate: '', status: 'ACTIVE', file: null, fileName: ''
    });
    setErrors({});
    setSubmitError('');
    setSearchTerm('');
    setSelectedEmployee(null);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 3, }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <AddIcon sx={{ fontSize: 36 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>Add New Contract</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Create employment contract for employee</Typography>
              </Box>
            </Stack>
            <IconButton onClick={handleClose} disabled={loading} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ mt: 4 }}>   {/* <<< THÊM DÒNG NÀY */}
         <br></br>

          {/* Employee Search */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, md: 4 }}>
              <Autocomplete
                options={employees}
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                onInputChange={(_, value) => setSearchTerm(value)}
                inputValue={searchTerm}
                getOptionLabel={(opt) => opt ? `${opt.fullName || opt.empName} (ID: ${opt.id || opt.empId})` : ''}
                isOptionEqualToValue={(opt, val) => (opt?.id || opt?.empId) === (val?.id || val?.empId)}
                loading={loadingEmployees}
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
                      endAdornment: loadingEmployees ? <CircularProgress size={20} /> : params.InputProps.endAdornment
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.id || option.empId}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PersonIcon color="action" />
                      <Box>
                        <Typography fontWeight={600}>{option.fullName || option.empName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {option.id || option.empId} • {option.email || ''} • {option.deptName || ''}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
                filterOptions={(x) => x}
              />
            </Grid>

            {/* Hàng 1: Contract Type + Status */}
            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                select fullWidth required
                label="Contract Type"
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                error={!!errors.contractType}
                helperText={errors.contractType}
                disabled={loading}
                InputProps={{ startAdornment: <CategoryIcon sx={{ mr: 1, color: 'action.active' }} /> }}
              >
                {CONTRACT_TYPES.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                select fullWidth required
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                error={!!errors.status}
                helperText={errors.status}
                disabled={loading}
                InputProps={{ startAdornment: <CheckCircleIcon sx={{ mr: 1, color: 'action.active' }} /> }}
              >
                {CONTRACT_STATUSES.map(o => (
                  <MenuItem key={o.value} value={o.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: o.color }} />
                      {o.label}
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Hàng 2: Start Date + End Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
                InputProps={{ startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} /> }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required
                type="date"
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: formData.startDate || today }}
                InputProps={{ startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} /> }}
              />
            </Grid>

            {/* File Upload */}
            <Grid size={{ xs: 6, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                Contract Document (PDF) - Optional
              </Typography>
              <Paper
                variant="outlined"
                onClick={handleFileBoxClick}
                sx={{
                  p: 1,
                  borderStyle: 'dashed',
                  borderColor: formData.fileName ? 'primary.main' : 'grey.400',
                  bgcolor: formData.fileName ? 'primary.50' : 'grey.50',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: formData.fileName ? 'primary.100' : 'grey.100',
                    borderColor: 'primary.main',
                    boxShadow: 3
                  }
                }}
              >
                <UploadFileIcon sx={{ fontSize: 25, color: formData.fileName ? 'primary.main' : 'grey.500', mb: 1 }} />
                <Typography variant="h6" fontWeight={600} color={formData.fileName ? 'primary.main' : 'text.primary'}>
                  {formData.fileName || 'upload'}
                </Typography>
              </Paper>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 4, gap: 2 }}>
          <Button onClick={handleClose} disabled={loading} variant="outlined" size="large" startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
            sx={{
              minWidth: 180,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 4px 15px rgba(33,150,243,0.4)',
              '&:hover': { boxShadow: '0 8px 25px rgba(33,150,243,0.5)' }
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