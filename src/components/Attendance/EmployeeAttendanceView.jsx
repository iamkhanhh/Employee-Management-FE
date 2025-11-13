import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function EmployeeAttendanceView({ employee, records, onAdd, onEdit }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5">Bảng công của tôi</Typography>
          <Typography variant="body2" color="text.secondary">{employee?.name || 'You'}</Typography>
        </Box>
        <Box>
          <Button variant="contained" onClick={onAdd}>Chấm công mới</Button>
        </Box>
      </Box>

      <Paper sx={{ overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Giờ vào</TableCell>
              <TableCell>Giờ ra</TableCell>
              <TableCell>Giờ công</TableCell>
              <TableCell>OT (giờ)</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Không có bản ghi</TableCell>
              </TableRow>
            ) : (
              records.map(r => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.timeIn || '-'}</TableCell>
                  <TableCell>{r.timeOut || '-'}</TableCell>
                  <TableCell>{r.hoursWorked ?? r.hours ?? '-'}</TableCell>
                  <TableCell>{r.overtimeHours ?? r.overtime ?? '-'}</TableCell>
                  <TableCell>{r.note}</TableCell>
                  <TableCell align="right">
                    <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(r.id)}>Sửa</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
