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
  alpha,
  Chip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudDownload as CloudDownloadIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import ContractStatusChip from '../shared/ContractStatusChip';
import ContractTypeChip from '../shared/ContractTypeChip';
// src/components/contracts/ContractList/ContractTable.jsx
import { formatDate, calculateDaysRemaining } from '../../../utils/dateUtils';
import { generateEmployeeCode } from '../../../data/mockData';

const ContractTable = ({
  contracts,
  selectedContracts,
  onSelectAll,
  onSelectOne,
  onView,
  onEdit,
  onDelete,
  onDownloadFile,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  const isSelected = (id) => selectedContracts.indexOf(id) !== -1;

  const getRoleInDeptChip = (role) => {
    const roleConfig = {
      HEAD: { label: 'Trưởng phòng', color: 'error' },
      DEPUTY: { label: 'Phó phòng', color: 'warning' },
      STAFF: { label: 'Nhân viên', color: 'default' }
    };
    const config = roleConfig[role] || roleConfig.STAFF;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <Paper sx={{
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  sx={{ color: 'white' }}
                  checked={selectedContracts.length === contracts.length && contracts.length > 0}
                  indeterminate={selectedContracts.length > 0 && selectedContracts.length < contracts.length}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Thông tin nhân viên</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Phòng ban</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Loại hợp đồng</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Thời hạn hợp đồng</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>File đính kèm</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contract) => {
                const selected = isSelected(contract.id);
                const daysRemaining = calculateDaysRemaining(contract.end_date);
                const employee = contract.employee;
                const empCode = generateEmployeeCode(employee?.id);
                
                return (
                  <TableRow
                    key={contract.id}
                    hover
                    selected={selected}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha('#1976d2', 0.04)
                      }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected}
                        onChange={() => onSelectOne(contract.id)}
                        color="primary"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar 
                          sx={{ 
                            width: 45, 
                            height: 45,
                            backgroundColor: employee?.gender === 'Nam' ? '#1976d2' : '#e91e63',
                            fontSize: 16,
                            fontWeight: 600
                          }}
                        >
                          {employee?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                            {employee?.full_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <PersonIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            {empCode} • {employee?.role_in_dept && getRoleInDeptChip(employee.role_in_dept)}
                          </Typography>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="caption" color="text.secondary">
                              <EmailIcon sx={{ fontSize: 12, mr: 0.5 }} />
                              {employee?.user?.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              <PhoneIcon sx={{ fontSize: 12, mr: 0.5 }} />
                              {employee?.phone_number}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          <BusinessIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          {employee?.department?.dept_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee?.position?.position_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <ContractTypeChip type={contract.contract_type} />
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                        </Typography>
                        {daysRemaining && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: daysRemaining.includes('Còn') && parseInt(daysRemaining.match(/\d+/)) <= 30 
                                ? '#ff9800' 
                                : '#f44336',
                              fontWeight: 500,
                              display: 'block'
                            }}
                          >
                            {daysRemaining}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Ngày tạo: {formatDate(contract.created_at)}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <ContractStatusChip status={contract.status} />
                    </TableCell>
                    
                    <TableCell>
                      {contract.file_url ? (
                        <Tooltip title="Tải xuống file hợp đồng">
                          <IconButton
                            size="small"
                            onClick={() => onDownloadFile(contract.file_url)}
                            sx={{
                              color: '#1976d2',
                              '&:hover': {
                                backgroundColor: alpha('#1976d2', 0.1)
                              }
                            }}
                          >
                            <CloudDownloadIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Chưa có file
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => onView(contract.id)}
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
                        
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(contract.id)}
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
                        
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(contract)}
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
        count={contracts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
      />
    </Paper>
  );
};

export default ContractTable;