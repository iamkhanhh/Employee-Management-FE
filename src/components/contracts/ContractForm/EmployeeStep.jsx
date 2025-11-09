// src/components/contracts/ContractForm/EmployeeStep.jsx

import React from 'react';
import {
  Grid,
  TextField,
  Autocomplete,
  Avatar,
  Box,
  Typography,
  InputAdornment,
  Chip,
  Paper
} from '@mui/material';
import {
  Badge as BadgeIcon,
  WorkHistory as WorkHistoryIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Cake as CakeIcon
} from '@mui/icons-material';
// Sửa đường dẫn: từ ContractForm lên 3 cấp để đến src
import { formatDate } from '../../../utils/dateUtils';
import { generateEmployeeCode } from '../../../data/mockData';

const EmployeeStep = ({ 
  contractData, 
  errors, 
  employees, 
  onInputChange, 
  onEmployeeSelect 
}) => {
  const selectedEmployee = employees?.find(e => e.id === contractData.emp_id);

  const getRoleChip = (role) => {
    const roleConfig = {
      HEAD: { label: 'Trưởng phòng', color: 'error' },
      DEPUTY: { label: 'Phó phòng', color: 'warning' },
      STAFF: { label: 'Nhân viên', color: 'default' }
    };
    const config = roleConfig[role] || roleConfig.STAFF;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getStatusChip = (status) => {
    return status === 'ACTIVE' ? 
      <Chip label="Đang làm việc" color="success" size="small" /> :
      <Chip label="Đã nghỉ việc" color="error" size="small" />;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Autocomplete
          options={employees || []}
          getOptionLabel={(option) => `${generateEmployeeCode(option.id)} - ${option.full_name}`}
          value={selectedEmployee || null}
          onChange={(event, value) => onEmployeeSelect(value)}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Avatar 
                sx={{ 
                  mr: 2, 
                  width: 40, 
                  height: 40,
                  backgroundColor: option.gender === 'Nam' ? '#1976d2' : '#e91e63'
                }}
              >
                {option.full_name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {option.full_name} ({generateEmployeeCode(option.id)})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.department?.dept_name} • {option.position?.position_name} • {getRoleChip(option.role_in_dept)}
                </Typography>
              </Box>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Chọn nhân viên"
              placeholder="Tìm kiếm nhân viên..."
              error={!!errors.emp_id}
              helperText={errors.emp_id}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Grid>
      
      {selectedEmployee && (
        <>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phòng ban"
              value={selectedEmployee.department?.dept_name || ''}
              disabled
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WorkHistoryIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Vị trí công việc"
              value={selectedEmployee.position?.position_name || contractData.position}
              onChange={(e) => onInputChange('position', e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AssignmentIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3, 
              bgcolor: 'background.default', 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 2 }}>
                Thông tin chi tiết nhân viên
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Họ tên:</strong> {selectedEmployee.full_name}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Giới tính:</strong> {selectedEmployee.gender}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <CakeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Ngày sinh:</strong> {formatDate(selectedEmployee.dob)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Số điện thoại:</strong> {selectedEmployee.phone_number}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedEmployee.user?.email}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Ngày vào làm:</strong> {formatDate(selectedEmployee.hire_date)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <strong>Địa chỉ:</strong> {selectedEmployee.address}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Chức vụ trong phòng:</strong> {getRoleChip(selectedEmployee.role_in_dept)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Trạng thái:</strong> {getStatusChip(selectedEmployee.status)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default EmployeeStep;