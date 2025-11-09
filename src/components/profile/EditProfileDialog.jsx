import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

const EditProfileDialog = ({ open, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    emergency_contact: '',
    emergency_name: '',
    emergency_relation: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        emergency_contact: user.emergency_contact || '',
        emergency_name: user.emergency_name || '',
        emergency_relation: user.emergency_relation || ''
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name) {
      newErrors.full_name = 'Vui lòng nhập họ tên';
    }
    
    if (!formData.phone_number) {
      newErrors.phone_number = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.address) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Chỉnh sửa thông tin cá nhân</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Họ và tên"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              error={!!errors.full_name}
              helperText={errors.full_name}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              error={!!errors.phone_number}
              helperText={errors.phone_number}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={user?.email}
              disabled
              helperText="Email không thể thay đổi"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa chỉ"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Liên hệ khẩn cấp
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Họ tên người liên hệ"
              value={formData.emergency_name}
              onChange={(e) => handleChange('emergency_name', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mối quan hệ"
              value={formData.emergency_relation}
              onChange={(e) => handleChange('emergency_relation', e.target.value)}
              placeholder="Vợ/Chồng, Bố/Mẹ, ..."
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Số điện thoại khẩn cấp"
              value={formData.emergency_contact}
              onChange={(e) => handleChange('emergency_contact', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;