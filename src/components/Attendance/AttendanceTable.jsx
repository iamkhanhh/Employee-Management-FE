import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AttendanceTable({ records, employees, onEdit, onDelete, isAdmin, onFilterEmployee, filterEmployeeId }) {
  const rows = records.map(r => ({
    id: r.id,
    employeeId: r.empId,
    employeeName: r.fullName,
    date: r.date,
    timeIn: r.timeIn,
    timeOut: r.timeOut,
    hoursWorked: r.hoursWorked,
    overtimeHours: r.overtimeHours,
    type: r.type,
    note: r.note
  }));

  const columns = [
  { field: 'employeeName', headerName: 'Nhân viên', flex: 2, minWidth: 150 },
  { field: 'date', headerName: 'Ngày', flex: 1, minWidth: 100 },
  { field: 'timeIn', headerName: 'Giờ vào', flex: 1, minWidth: 100 },
  { field: 'timeOut', headerName: 'Giờ ra', flex: 1, minWidth: 100 },
  { field: 'hoursWorked', headerName: 'Giờ công', flex: 1, minWidth: 100 },
  { field: 'overtimeHours', headerName: 'OT (h)', flex: 1, minWidth: 100 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        {isAdmin ? (
          <Select value={filterEmployeeId ?? ''} onChange={(e) => onFilterEmployee(e.target.value || null)} size="small">
            <MenuItem value="">Tất cả</MenuItem>
            {employees.map(emp => <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>)}
          </Select>
        ) : (
          <Typography variant="subtitle2">Your attendance records</Typography>
        )}
      </Box>
        <div style={{ height: '520px', width: '100%', overflowX: 'auto' }}>
          <DataGrid 
            rows={rows} 
            columns={columns} 
            pageSize={10} 
            rowsPerPageOptions={[10]} 
            disableSelectionOnClick 
            autoHeight={false}
          />
        </div>
    </Box>
  );
}
