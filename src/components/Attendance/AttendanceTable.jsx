import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AttendanceTable({ records, employees, onEdit, onDelete, isAdmin, onFilterEmployee, filterEmployeeId }) {
  const rows = records.map(r => ({ id: r.id, employeeId: r.employeeId, employeeName: employees.find(e => e.id === r.employeeId)?.name || 'Unknown', date: r.date, timeIn: r.timeIn, timeOut: r.timeOut, overtimeHours: r.overtimeHours, note: r.note }));

  const columns = [
    { field: 'employeeName', headerName: 'Employee', width: 180 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'timeIn', headerName: 'Time In', width: 120 },
    { field: 'timeOut', headerName: 'Time Out', width: 120 },
    { field: 'overtimeHours', headerName: 'Overtime (h)', width: 140 },
    { field: 'note', headerName: 'Note', width: 240 },
    { field: 'actions', headerName: 'Actions', width: 160, renderCell: (params) => (
      <Box>
        <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(params.row.id)}>Edit</Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(params.row.id)}>Delete</Button>
      </Box>
    ) }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        {isAdmin ? (
          <Select value={filterEmployeeId ?? ''} onChange={(e) => onFilterEmployee(e.target.value || null)} size="small">
            <MenuItem value="">All</MenuItem>
            {employees.map(emp => (<MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>))}
          </Select>
        ) : (
          <Typography variant="subtitle2">Your attendance records</Typography>
        )}
      </Box>
      <div style={{ height: 520, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} disableSelectionOnClick />
      </div>
    </Box>
  );
}
