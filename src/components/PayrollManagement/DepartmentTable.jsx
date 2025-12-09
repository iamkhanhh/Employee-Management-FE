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
  Box,
  Typography,
  Avatar,
  LinearProgress,
  alpha
} from '@mui/material';
import {
  Business as BusinessIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

const DepartmentTable = ({
  departments,
  onRowClick,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  loading
}) => {
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
              <TableCell>Department Info</TableCell>
              <TableCell>Head</TableCell>
              <TableCell align="center">Employees</TableCell>
              <TableCell>Created Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((department) => (
                <TableRow
                  key={department.id}
                  hover
                  onClick={() => onRowClick(department)}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha('#1976d2', 0.04)
                    },
                    cursor: 'pointer'
                  }}
                >
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
                          {department.deptName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {department.managerName}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {department.employeeCount || 0}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(department.createdAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
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
