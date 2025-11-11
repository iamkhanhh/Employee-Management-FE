import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Stack,
  Alert,
  Autocomplete,
  Avatar,
  InputAdornment
} from '@mui/material';
import {
  Business as BusinessIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { mockEmployees } from '../../../data/mockData';

const AddDepartmentDialog = ({ open, onClose, onSubmit }) => {
  const [departmentData, setDepartmentData] = useState({
    dept_name: '',
    description: '',
    head: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableEmployees = mockEmployees.filter(
    emp => emp.status === 'ACTIVE' && !emp.is_deleted
  );

  const handleInputChange = (field, value) => {
    setDepartmentData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!departmentData.dept_name.trim()) {
      newErrors.dept_name = "Please enter the department name";
    } else if (departmentData.dept_name.length > 100) {
      newErrors.dept_name = "Department name cannot exceed 100 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await onSubmit(departmentData); 

    if (result.success) {
      handleClose();
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    setDepartmentData({
      dept_name: '',
      description: '',
      head: null,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2,   // padding top-bottom
          px: 3,   // padding left-right
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <BusinessIcon />
          <Typography variant="h6">Add New Department</Typography>
        </Stack>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ mt: 2, px: 3, pb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Department Name"
              value={departmentData.dept_name}
              onChange={(e) => handleInputChange('dept_name', e.target.value)}
              fullWidth
              required
              error={!!errors.dept_name}
              helperText={errors.dept_name}
              placeholder="e.g., Engineering Department"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              value={departmentData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Describe the department's functions and responsibilities..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={availableEmployees}
              getOptionLabel={(option) => option.full_name || ''}
              value={departmentData.head}
              onChange={(event, value) => handleInputChange('head', value)}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>{option.full_name.charAt(0)}</Avatar>
                  <Typography variant="body2">{option.full_name}</Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Department Head"
                  placeholder="Select Head"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" icon={<BusinessIcon />}>
              <Typography variant="body2">
                <strong>Note:</strong> After creating the department, you can add employees through the employee management page.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, justifyContent: 'flex-end', gap: 2 }}>
        <Button
          onClick={handleClose}
          startIcon={<CancelIcon />}
          variant="outlined"
          sx={{ minWidth: 120 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={isSubmitting}
          sx={{
            minWidth: 150,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Department'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDepartmentDialog;
