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
  Chip,
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
    head_id: null,
    location: '',
    budget: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableEmployees = mockEmployees.filter(emp => 
    emp.status === 'ACTIVE' && !emp.is_deleted
  );

  const handleInputChange = (field, value) => {
    setDepartmentData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!departmentData.dept_name.trim()) {
      newErrors.dept_name = "Vui lòng nhập tên phòng ban";
    }
    
    if (departmentData.dept_name.length > 100) {
      newErrors.dept_name = "Tên phòng ban không được quá 100 ký tự";
    }

    if (departmentData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(departmentData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (departmentData.phone && !/^[0-9]{10,11}$/.test(departmentData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

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
      head_id: null,
      location: '',
      budget: '',
      email: '',
      phone: ''
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
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        pb: 2
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <BusinessIcon />
          <Typography variant="h6">Thêm phòng ban mới</Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Tên phòng ban"
              value={departmentData.dept_name}
              onChange={(e) => handleInputChange('dept_name', e.target.value)}
              fullWidth
              required
              error={!!errors.dept_name}
              helperText={errors.dept_name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Ví dụ: Phòng Kỹ thuật"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Mô tả"
              value={departmentData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Mô tả chức năng, nhiệm vụ của phòng ban..."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={availableEmployees}
              getOptionLabel={(option) => option.full_name}
              value={availableEmployees.find(e => e.id === departmentData.head_id) || null}
              onChange={(event, value) => handleInputChange('head_id', value?.id || null)}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                    {option.full_name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{option.full_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.position?.position_name}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Trưởng phòng"
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

          <Grid item xs={12} md={6}>
            <TextField
              label="Vị trí"
              value={departmentData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              fullWidth
              placeholder="Ví dụ: Tầng 3, Tòa nhà A"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Email phòng ban"
              value={departmentData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              placeholder="department@company.com"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Số điện thoại"
              value={departmentData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="0901234567"
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" icon={<BusinessIcon />}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Sau khi tạo phòng ban, bạn có thể thêm nhân viên vào phòng ban thông qua trang quản lý nhân viên.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2.5 }}>
        <Button 
          onClick={handleClose}
          startIcon={<CancelIcon />}
        >
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={<SaveIcon />}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu phòng ban'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDepartmentDialog;