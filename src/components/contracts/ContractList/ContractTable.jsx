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
  CircularProgress,
} from '@mui/material';

import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudDownload as CloudDownloadIcon,
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
  totalElements,
  onPageChange,
  onRowsPerPageChange,
  loading
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
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contract Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contract Duration</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Attachment</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading contracts...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1" color="text.secondary">
                    No contracts found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => {
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
                        {contract.employeeName || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {contract.empId}
                      </Typography>
                    </TableCell>

                    {/* Contract Type */}
                    <TableCell>
                      <ContractTypeChip type={contract.contractType} />
                    </TableCell>

                    {/* Dates */}
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {(contract.startDate)} - {(contract.endDate)}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" display="block">
                          Created: {formatDate(contract.createdAt)}
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
                            onClick={() => onDownloadFile(contract.fileUrl, `contract_${contract.id}.pdf`)}
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
                          <IconButton
                            size="small"
                            onClick={() => onView(contract.id)}
                            sx={{
                              color: '#4caf50',
                              '&:hover': { backgroundColor: alpha('#4caf50', 0.1) }
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
                              onEdit(contract);
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
                            onClick={() => onDelete(contract)}
                            sx={{
                              color: '#f44336',
                              '&:hover': { backgroundColor: alpha('#f44336', 0.1) }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination - ✅ Dùng totalElements từ API */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalElements || 0}
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