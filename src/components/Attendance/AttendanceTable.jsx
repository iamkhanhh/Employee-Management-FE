import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AttendanceTable({ records, employees, onEdit, onDelete, isAdmin, onFilterEmployee, filterEmployeeId }) {
  const rows = records.map(r => ({ id: r.id, employeeId: r.employeeId, employeeName: employees.find(e => e.id === r.employeeId)?.name || 'Unknown', date: r.date, timeIn: r.timeIn, timeOut: r.timeOut, hoursWorked: r.hoursWorked ?? r.hours ?? 0, overtimeHours: r.overtimeHours ?? r.overtime ?? 0, type: r.type, note: r.note }));

  const columns = [
    { field: 'employeeName', headerName: 'Nhân viên', width: 180 },
    { field: 'date', headerName: 'Ngày', width: 120 },
    { field: 'timeIn', headerName: 'Giờ vào', width: 120 },
    { field: 'timeOut', headerName: 'Giờ ra', width: 120 },
    { field: 'hoursWorked', headerName: 'Giờ công', width: 120 },
    { field: 'overtimeHours', headerName: 'OT (h)', width: 120 },
    { field: 'type', headerName: 'Loại', width: 120 },
    { field: 'note', headerName: 'Ghi chú', width: 240 },
    { field: 'actions', headerName: 'Hành động', width: 160, renderCell: (params) => (
      <Box>
        {isAdmin && <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(params.row.id)}>Sửa</Button>}
        {isAdmin && <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(params.row.id)}>Xóa</Button>}
      </Box>
    ) }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        {isAdmin ? (
          <Select value={filterEmployeeId ?? ''} onChange={(e) => onFilterEmployee(e.target.value || null)} size="small">
            <MenuItem value="">Tất cả</MenuItem>
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
