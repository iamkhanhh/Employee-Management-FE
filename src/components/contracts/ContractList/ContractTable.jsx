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
  Stack,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';

import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudDownload as CloudDownloadIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

import ContractStatusChip from '../shared/ContractStatusChip';
import ContractTypeChip from '../shared/ContractTypeChip';
import { formatDate, calculateDaysRemaining } from '../../../utils/dateUtils';

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

  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }}>
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

              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Department</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contract Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contract Duration</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Attachment</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {contracts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contract) => {

                const selected = isSelected(contract.id);
                const daysRemaining = calculateDaysRemaining(contract.endDate);

                return (
                  <TableRow
                    key={contract.id}
                    hover
                    selected={selected}
                    sx={{ '&:hover': { backgroundColor: alpha('#1976d2', 0.04) } }}
                  >
                    {/* Checkbox */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected}
                        onChange={() => onSelectOne(contract.id)}
                        color="primary"
                      />
                    </TableCell>

                    {/* Employee Name */}
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                        {contract.employeeName ?? 'N/A'}
                      </Typography>
                    </TableCell>

                    {/* Department – hiện API chưa có */}
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          <BusinessIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          N/A
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Position: N/A
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Contract Type */}
                    <TableCell>
                      <ContractTypeChip type={contract.contractType} />
                    </TableCell>

                    {/* Dates */}
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                        </Typography>

                        {daysRemaining && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: daysRemaining.includes('Remaining') &&
                                parseInt(daysRemaining.match(/\d+/)) <= 30
                                ? '#ff9800'
                                : '#f44336',
                              fontWeight: 500,
                            }}
                          >
                            {daysRemaining}
                          </Typography>
                        )}

                        <Typography variant="caption" color="text.secondary" display="block">
                          Created on: {formatDate(contract.createdAt)}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <ContractStatusChip status={contract.status} />
                    </TableCell>

                    {/* Attachment */}
                    <TableCell>
                      {contract.fileUrl ? (
                        <Tooltip title="Download contract file">
                          <IconButton
                            size="small"
                            onClick={() => onDownloadFile(contract.fileUrl)}
                            sx={{ color: '#1976d2' }}
                          >
                            <CloudDownloadIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No file
                        </Typography>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => onView(contract.id)} sx={{ color: '#4caf50', '&:hover': { backgroundColor: alpha('#4caf50', 0.1) } }} >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => onEdit(contract.id)} sx={{ color: '#ff9800' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => onDelete(contract)} sx={{ color: '#f44336' }}>
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

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={contracts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Rows per page:"
      />
    </Paper>
  );
};

export default ContractTable;
