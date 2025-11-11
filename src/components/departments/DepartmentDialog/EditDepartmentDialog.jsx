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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const EditDepartmentDialog = ({ open, onClose, onSubmit, department }) => {
  const [tabValue, setTabValue] = useState(0);
  const [departmentData, setDepartmentData] = useState({
    dept_name: '',
    description: '',
    head_id: null,

    budget: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableEmployees = mockEmployees.filter(emp => emp.status === 'ACTIVE' && !emp.is_deleted);
  const departmentEmployees = department
    ? mockEmployees.filter(emp => emp.dept_id === department.id && emp.status === 'ACTIVE' && !emp.is_deleted)
    : [];

  useEffect(() => {
    if (department) {
      setDepartmentData({
        dept_name: department.dept_name || '',
        description: department.description || '',
        head_id: department.head_id || null,
        budget: department.budget || ''
      });
    }
  }, [department]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleInputChange = (field, value) => {
    setDepartmentData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!departmentData.dept_name.trim()) newErrors.dept_name = "Department name is required";
    if (departmentData.dept_name.length > 100) newErrors.dept_name = "Department name cannot exceed 100 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    const result = await onSubmit(departmentData);
    if (result.success) handleClose();
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setDepartmentData({ dept_name: '', description: '', head_id: null, budget: '' });
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
      HEAD: { label: 'Head', color: 'error' },
      DEPUTY: { label: 'Deputy', color: 'warning' },
      STAFF: { label: 'Staff', color: 'default' }
    };
    const config = roleConfig[role] || roleConfig.STAFF;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (!department) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)', color: 'white', pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EditIcon />
          <Typography variant="h6">Edit Department</Typography>
        </Stack>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="General Info" />
          <Tab label={`Employees (${departmentEmployees.length})`} />
        </Tabs>
      </Box>

      <DialogContent sx={{ mt: 2 }}>
        <TabPanel value={tabValue} index={0}>
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
                InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon /></InputAdornment> }}
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
                InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon /></InputAdornment> }}
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
                    <Avatar sx={{ mr: 2, width: 32, height: 32 }}>{option.full_name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="body1">{option.full_name}</Typography>
                      <Typography variant="caption" color="text.secondary">{option.position?.position_name}</Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Department Head"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start"><PersonIcon /></InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Employee List</Typography>
            <Button startIcon={<PersonAddIcon />} variant="contained" size="small">Add Employee</Button>
          </Box>

          <List>
            {departmentEmployees.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                <GroupIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography color="text.secondary">No employees in this department</Typography>
              </Paper>
            ) : (
              departmentEmployees.map((employee, index) => (
                <React.Fragment key={employee.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: employee.gender === 'Male' ? '#1976d2' : '#e91e63' }}>
                        {employee.full_name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Stack direction="row" spacing={1} alignItems="center"><Typography>{employee.full_name}</Typography>{getRoleChip(employee.role_in_dept)}</Stack>}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">{employee.position?.position_name}</Typography>
                          <Typography variant="caption" color="text.secondary">Hire Date: {formatDate(employee.hire_date)}</Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Remove from department">
                        <IconButton edge="end" onClick={() => handleRemoveEmployee(employee.id)} color="error">
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
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleClose} startIcon={<CancelIcon />}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || tabValue !== 0} startIcon={<SaveIcon />}
          sx={{ background: 'linear-gradient(45deg, #FF6B6B 30%, #FFE66D 90%)', boxShadow: '0 3px 5px 2px rgba(255,107,107,.3)' }}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDepartmentDialog;
