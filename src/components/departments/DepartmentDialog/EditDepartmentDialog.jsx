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
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const EditDepartmentDialog = ({ open, onClose, onSubmit, department }) => {
  const [formData, setFormData] = useState({
    deptName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Load department data khi dialog mở
  useEffect(() => {
    if (department && open) {
      setFormData({
        deptName: department.deptName || ''
      });
      setErrors({});
      setSubmitError('');
    }
  }, [department, open]);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.deptName.trim()) {
      newErrors.deptName = 'Department name is required';
    } else if (formData.deptName.trim().length < 2) {
      newErrors.deptName = 'Department name must be at least 2 characters';
    } else if (formData.deptName.trim().length > 100) {
      newErrors.deptName = 'Department name must not exceed 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ deptName: value });
    
    // Clear error khi user gõ
    if (errors.deptName) {
      setErrors({});
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
        deptName: formData.deptName.trim()
      });

      if (result.success) {
        handleClose();
      } else {
        setSubmitError(result.error || 'Failed to update department');
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
      setFormData({ deptName: '' });
      setErrors({});
      setSubmitError('');
      onClose();
    }
  };

  if (!department) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
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
              Edit Department
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Update department information
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

          {/* Current Department Info */}
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
              Current Department Information
            </Typography>
            <Divider sx={{ my: 1 }} />
            
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  <strong>ID:</strong> {department.id}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  <strong>Name:</strong> {department.deptName}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  <strong>Created:</strong> {department.createdAt}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Input Field */}
          <TextField
            fullWidth
            label="New Department Name"
            name="deptName"
            value={formData.deptName}
            onChange={handleChange}
            error={!!errors.deptName}
            helperText={errors.deptName || 'Enter the new name for this department'}
            required
            disabled={loading}
            autoFocus
            placeholder="e.g. Human Resources, IT Department"
            InputProps={{
              startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
          />
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
            disabled={loading || !formData.deptName.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FFE66D 90%)',
              boxShadow: '0 3px 5px 2px rgba(255,107,107,.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252 30%, #FFD740 90%)',
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

export default EditDepartmentDialog;