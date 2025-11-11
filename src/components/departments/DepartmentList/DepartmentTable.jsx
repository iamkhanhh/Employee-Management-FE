import React from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Checkbox,
  Box,
  Typography,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  AvatarGroup,
  LinearProgress,
  alpha
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { formatDate } from '../../../utils/dateUtils';

const DepartmentTable = ({
  departments,
  selectedDepartments,
  onSelectAll,
  onSelectOne,
  onView,
  onEdit,
  onDelete,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  loading
}) => {
  const isSelected = (id) => selectedDepartments.indexOf(id) !== -1;

  const getHeadInfo = (head) => {
    if (!head) return { name: 'N/A', avatar: null };
    return {
      name: head.full_name,
      avatar: head.full_name?.charAt(0).toUpperCase()
    };
  };

  const getStatusChip = (status) => {
    return status === 'ACTIVE' ? (
      <Chip 
        label="Active" 
        color="success" 
        size="small"
        sx={{ fontWeight: 500 }}
      />
    ) : (
      <Chip 
        label="Inactive" 
        color="error" 
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Loading data...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: '#1976d2',
              '& .MuiTableCell-head': {
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem'
              }
            }}>
              <TableCell padding="checkbox">
                <Checkbox
                  sx={{ color: 'white' }}
                  checked={selectedDepartments.length === departments.length && departments.length > 0}
                  indeterminate={selectedDepartments.length > 0 && selectedDepartments.length < departments.length}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell>Department Info</TableCell>
              <TableCell>Head</TableCell>
              <TableCell align="center">Employees</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((department) => {
                const selected = isSelected(department.id);
                const headInfo = getHeadInfo(department.head);
                
                return (
                  <TableRow
                    key={department.id}
                    hover
                    selected={selected}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha('#1976d2', 0.04)
                      },
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected}
                        onChange={() => onSelectOne(department.id)}
                        color="primary"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 48, 
                            height: 48,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontSize: 20,
                            fontWeight: 600
                          }}
                        >
                          <BusinessIcon />
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                            {department.dept_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: DEPT{String(department.id).padStart(3, '0')}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                          {headInfo.avatar}
                        </Avatar>
                        <Typography variant="body2">
                          {headInfo.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                        <GroupIcon fontSize="small" color="action" />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {department.employeeCount || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          employees
                        </Typography>
                      </Stack>
                      {department.employees && department.employees.length > 0 && (
                        <AvatarGroup max={3} sx={{ mt: 1, justifyContent: 'center' }}>
                          {department.employees.slice(0, 3).map((emp, index) => (
                            <Avatar 
                              key={index} 
                              sx={{ width: 24, height: 24, fontSize: 10 }}
                            >
                              {emp.full_name?.charAt(0)}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(department.created_at)}
                      </Typography>
                      {department.updated_at && (
                        <Typography variant="caption" color="text.secondary">
                          Updated: {formatDate(department.updated_at)}
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {getStatusChip(department.status || 'ACTIVE')}
                    </TableCell>
                    
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(department);
                            }}
                            sx={{
                              color: '#4caf50',
                              '&:hover': {
                                backgroundColor: alpha('#4caf50', 0.1)
                              }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(department);
                            }}
                            sx={{
                              color: '#ff9800',
                              '&:hover': {
                                backgroundColor: alpha('#ff9800', 0.1)
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(department);
                            }}
                            sx={{
                              color: '#f44336',
                              '&:hover': {
                                backgroundColor: alpha('#f44336', 0.1)
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={departments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
      />
    </Paper>
  );
};

export default DepartmentTable;
