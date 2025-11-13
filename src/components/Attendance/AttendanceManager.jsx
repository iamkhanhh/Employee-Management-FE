import React, { useState, useEffect } from 'react';
import AttendanceTable from './AttendanceTable';
import AttendanceForm from './AttendanceForm';
import { mockEmployees } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { Box, Button, Typography, Stack, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const STORAGE_KEY = 'attendance_records_v1';

export default function AttendanceManager() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  const currentUserId = user?.id ?? null;

  // seed employees list (map to id/name)
  const employees = (mockEmployees || []).map(e => ({ id: e.id, name: e.full_name || e.user?.full_name || e.user?.username || `User ${e.id}` }));

  // attendance records: { id, employeeId, date, timeIn, timeOut, hoursWorked, overtimeHours, note, type }
  const [records, setRecords] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    // fallback sample seed
    return [
      { id: 1, employeeId: employees[0]?.id ?? 1, date: new Date().toISOString().slice(0,10), timeIn: '08:30', timeOut: '17:30', hoursWorked: 9, overtimeHours: 1, note: '' },
    ];
  });

  // This page is the global attendance management view for all employees in development
  const [filterEmployeeId, setFilterEmployeeId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // persist to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch (e) {}
  }, [records]);

  const handleOpenNew = () => {
    setEditing(null);
    setOpenForm(true);
  };
  const handleCloseForm = () => setOpenForm(false);

  const handleSave = (payload) => {
    // normalize payload
    const p = { ...payload, employeeId: Number(payload.employeeId), overtimeHours: Number(payload.overtimeHours || 0), hoursWorked: Number(payload.hoursWorked || payload.hours || 0) };

    // prevent duplicates: same employee + date when creating new
    if (!p.id) {
      const exists = records.some(r => r.employeeId === p.employeeId && r.date === p.date);
      if (exists) { alert('Đã tồn tại bản ghi chấm công cho nhân viên này trong ngày đã chọn'); return; }
      p.id = Date.now();
      setRecords(prev => [p, ...prev]);
    } else {
      setRecords(prev => prev.map(r => r.id === p.id ? p : r));
    }
    setOpenForm(false);
  };

  const handleEdit = (id) => {
    const r = records.find(x => x.id === id);
    if (r) {
      setEditing(r);
      setOpenForm(true);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Xóa bản ghi chấm công này?')) return;
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records.filter(r => (filterEmployeeId ? r.employeeId === filterEmployeeId : true));

  // Metrics (based on current filter)
  const metricsSource = filtered;
  const totalRecords = metricsSource.length;
  const totalEmployees = new Set(metricsSource.map(r => r.employeeId)).size || employees.length;
  const totalHours = metricsSource.reduce((s, r) => s + (Number(r.hoursWorked) || Number(r.hours) || 0), 0);
  const totalOvertime = metricsSource.reduce((s, r) => s + (Number(r.overtimeHours) || Number(r.overtime) || 0), 0);
  const daysWorked = metricsSource.filter(r => r.timeIn && r.timeOut && (r.type || 'work') === 'work').length;

  return (
    <Box>
      {/* center content and align with AdminLayout padding */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 0 } }}>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h5">Quản lý chấm công</Typography>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenNew} sx={{ width: { xs: '100%', sm: 'auto' } }}>New Record</Button>
          </Box>
        </Stack>

        {/* Metrics */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 160px', minWidth: 160 }}>
              <Paper sx={{ p: 2 }} elevation={1}>
                <Typography variant="h6">{totalRecords}</Typography>
                <Typography variant="caption" color="text.secondary">Tổng bản ghi</Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 160px', minWidth: 160 }}>
              <Paper sx={{ p: 2 }} elevation={1}>
                <Typography variant="h6">{totalEmployees}</Typography>
                <Typography variant="caption" color="text.secondary">Nhân viên có bản ghi</Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 160px', minWidth: 160 }}>
              <Paper sx={{ p: 2 }} elevation={1}>
                <Typography variant="h6">{Number(totalHours.toFixed(2))}</Typography>
                <Typography variant="caption" color="text.secondary">Tổng giờ</Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 160px', minWidth: 160 }}>
              <Paper sx={{ p: 2 }} elevation={1}>
                <Typography variant="h6">{Number(totalOvertime.toFixed(2))}</Typography>
                <Typography variant="caption" color="text.secondary">Tổng OT (h)</Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 160px', minWidth: 160 }}>
              <Paper sx={{ p: 2 }} elevation={1}>
                <Typography variant="h6">{daysWorked}</Typography>
                <Typography variant="caption" color="text.secondary">Số ngày công</Typography>
              </Paper>
            </Box>
          </Box>
        </Box>

        {/* Table */}
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <AttendanceTable
            records={filtered}
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAdmin={true}
            onFilterEmployee={(id) => setFilterEmployeeId(id)}
            filterEmployeeId={filterEmployeeId}
          />
        </Box>
      </Box>

      <AttendanceForm
        open={openForm}
        onClose={handleCloseForm}
        employees={employees}
        isAdmin={true}
        currentUserId={currentUserId}
        initialData={editing}
        onSave={(data) => handleSave(data)}
      />
    </Box>
  );
}
