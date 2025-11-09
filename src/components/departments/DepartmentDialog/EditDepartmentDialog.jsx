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
  Stack,
  Alert,
  Autocomplete,
  Avatar,
  Chip,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Business as BusinessIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { mockEmployees } from '../../../data/mockData';
import { formatDate } from '../../../utils/dateUtils';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`department-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const EditDepartmentDialog = ({ open, onClose, onSubmit, department }) => {
  const [tabValue, setTabValue] = useState(0);
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

  // Get employees in this department
  const departmentEmployees = department ? 
    mockEmployees.filter(emp => 
      emp.dept_id === department.id && 
      emp.status === 'ACTIVE' && 
      !emp.is_deleted
    ) : [];

  useEffect(() => {
    if (department) {
      setDepartmentData({
        dept_name: department.dept_name || '',
        description: department.description || '',
        head_id: department.head_id || null,
        location: department.location || '',
        budget: department.budget || '',
        email: department.email || '',
        phone: department.phone || ''
      });
    }
  }, [department]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
    setTabValue(0);
    onClose();
  };

  const handleRemoveEmployee = (empId) => {
    console.log('Remove employee:', empId);
    // Implement remove employee logic
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      HEAD: { label: 'Trưởng phòng', color: 'error' },
      DEPUTY: { label: 'Phó phòng', color: 'warning' },
      STAFF: { label: 'Nhân viên', color: 'default' }
    };
    const config = roleConfig[role] || roleConfig.STAFF;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (!department) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
        color: 'white',
        pb: 2
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EditIcon />
          <Typography variant="h6">Chỉnh sửa phòng ban</Typography>
        </Stack>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Thông tin chung" />
          <Tab label={`Nhân viên (${departmentEmployees.length})`} />
          <Tab label="Lịch sử" />
        </Tabs>
      </Box>

      <DialogContent sx={{ mt: 2 }}>
        <TabPanel value={tabValue} index={0}>
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Danh sách nhân viên
            </Typography>
            <Button
              startIcon={<PersonAddIcon />}
              variant="contained"
              size="small"
            >
              Thêm nhân viên
            </Button>
          </Box>

          <List>
            {departmentEmployees.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                <GroupIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography color="text.secondary">
                  Chưa có nhân viên trong phòng ban này
                </Typography>
              </Paper>
            ) : (
              departmentEmployees.map((employee, index) => (
                <React.Fragment key={employee.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: employee.gender === 'Nam' ? '#1976d2' : '#e91e63' }}>
                        {employee.full_name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography>{employee.full_name}</Typography>
                          {getRoleChip(employee.role_in_dept)}
                        </Stack>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="text.secondary">
                            {employee.position?.position_name} • {employee.user?.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Ngày vào: {formatDate(employee.hire_date)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Xóa khỏi phòng ban">
                        <IconButton 
                          edge="end" 
                          onClick={() => handleRemoveEmployee(employee.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < departmentEmployees.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Stack spacing={2}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" gutterBottom>
                Thông tin khởi tạo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ngày tạo: {formatDate(department.created_at)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Người tạo: Admin
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" gutterBottom>
                Cập nhật lần cuối
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thời gian: {formatDate(department.updated_at)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Người cập nhật: Admin
              </Typography>
            </Paper>

            <Alert severity="info" icon={<BusinessIcon />}>
              <Typography variant="body2">
                ID Phòng ban: DEPT{String(department.id).padStart(3, '0')}
              </Typography>
            </Alert>
          </Stack>
        </TabPanel>
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
          disabled={isSubmitting || tabValue !== 0}
          startIcon={<SaveIcon />}
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B 30%, #FFE66D 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 107, 107, .3)',
          }}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDepartmentDialog;