import React, { useState, useEffect, useRef } from 'react';
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
    status: '',
    file: null,           // File object mới chọn
    fileName: ''          // Tên file để hiển thị (cũ hoặc mới)
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fileInputRef = useRef(null);

  // Load dữ liệu khi mở dialog
  useEffect(() => {
    if (contract && open) {
      setFormData({
        contractType: contract.contractType || '',
        startDate: contract.startDate || '',
        endDate: contract.endDate || '',
        status: contract.status || '',
        file: null,
        fileName: contract.fileUrl ? contract.fileUrl.split('/').pop() : ''
      });
      setErrors({});
      setSubmitError('');
    }
  }, [contract, open]);

  // Xử lý chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setSubmitError('Only PDF files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setSubmitError('File size must be less than 10MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        file,
        fileName: file.name
      }));
      setSubmitError('');
    }
  };

  // Click vào box để mở file picker
  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.contractType) newErrors.contractType = 'Contract type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        contractType: formData.contractType,
        startDate: formData.startDate,   // giữ string YYYY-MM-DD
        endDate: formData.endDate,       // giữ string YYYY-MM-DD
        status: formData.status
      };

      console.log("📤 Sending contract update:", payload);

      // Gửi file mới (nếu có) sang onSubmit để xử lý upload S3
      const result = await onSubmit(payload, contract.id, formData.file);

      if (result?.success) {
        handleClose();
      } else {
        setSubmitError(result?.error || "Failed to update contract");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError("An unexpected error occurred");
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
        status: '',
        file: null,
        fileName: ''
      });
      setErrors({});
      setSubmitError('');
      onClose();
    }
  };

  if (!contract) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <EditIcon sx={{ fontSize: 36 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>Edit Contract</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {contract.employeeName} • Employee ID: {contract.empId}
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={handleClose} disabled={loading} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 4, pb: 2 }}>
          {submitError && <Alert severity="error" sx={{ mb: 3 }}>{submitError}</Alert>}

          {/* Current Info */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Current Contract Information
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}><Typography variant="body2"><strong>Contract ID:</strong> {contract.id}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2"><strong>Created:</strong> {contract.createdAt}</Typography></Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3}>

            {/* Contract Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth select required
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

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth select required
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
                      <span>{o.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Start Date */}
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
                InputProps={{ startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} /> }}
              />
            </Grid>

            {/* End Date */}
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
                InputProps={{ startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} /> }}
              />
            </Grid>

            {/* CHỌN FILE PDF - SIÊU ĐẸP */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                Contract Document (PDF)
              </Typography>
              <Paper
                variant="outlined"
                onClick={handleBoxClick}
                sx={{
                  p: 4,
                  borderStyle: 'dashed',
                  borderColor: formData.fileName ? 'primary.main' : 'grey.400',
                  bgcolor: formData.fileName ? 'primary.50' : 'grey.50',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: formData.fileName ? 'primary.100' : 'grey.100',
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <DescriptionIcon sx={{ fontSize: 56, color: formData.fileName ? 'primary.main' : 'grey.500', mb: 2 }} />
                <Typography variant="h6" fontWeight={600} color={formData.fileName ? 'primary.main' : 'text.primary'}>
                  {formData.fileName || 'Click to upload new contract file'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {formData.fileName ? 'Click to replace • PDF only' : 'PDF only • Maximum 10MB'}
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

        {/* Actions */}
        <DialogActions sx={{ px: 4, pb: 4, pt: 2, gap: 2 }}>
          <Button onClick={handleClose} disabled={loading} variant="outlined" size="large" startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
            sx={{
              minWidth: 180,
              px: 4,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': { boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)' }
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditContractDialog;