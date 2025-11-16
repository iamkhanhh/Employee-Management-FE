import React, { useState, useEffect } from 'react';
import AttendanceTable from './AttendanceTable';
import AttendanceForm from './AttendanceForm';
import { mockEmployees } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { Box, Button, Typography, Stack, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';

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
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed;
      }
    } catch (e) {
      console.error("Error loading attendance records:", e);
    }
    // fallback sample seed
    return [
      { id: 1, employeeId: employees[0]?.id ?? 1, date: new Date().toISOString().slice(0,10), timeIn: '08:30', timeOut: '17:30', hoursWorked: 9, overtimeHours: 1, note: '' },
    ];
  });

  // Load data notification
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          toast.success(`Đã tải ${parsed.length} bản ghi chấm công từ bộ nhớ!`);
        }
      }
    } catch (e) {
      toast.error("Không thể tải dữ liệu chấm công từ bộ nhớ!");
    }
  }, []);

  // This page is the global attendance management view for all employees in development
  const [filterEmployeeId, setFilterEmployeeId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
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

    const loadingToast = toast.loading(p.id ? "Đang cập nhật bản ghi chấm công..." : "Đang tạo bản ghi chấm công...");

    try {
      // prevent duplicates: same employee + date when creating new
      if (!p.id) {
        const exists = records.some(r => r.employeeId === p.employeeId && r.date === p.date);
        if (exists) {
          toast.dismiss(loadingToast);
          toast.error('Đã tồn tại bản ghi chấm công cho nhân viên này trong ngày đã chọn!');
          return;
        }
        p.id = Date.now();
        setRecords(prev => [p, ...prev]);
        toast.dismiss(loadingToast);
        const employeeName = employees.find(e => e.id === p.employeeId)?.name || 'Nhân viên';
        toast.success(`Đã tạo bản ghi chấm công cho ${employeeName} thành công!`);
      } else {
        setRecords(prev => prev.map(r => r.id === p.id ? p : r));
        toast.dismiss(loadingToast);
        const employeeName = employees.find(e => e.id === p.employeeId)?.name || 'Nhân viên';
        toast.success(`Đã cập nhật bản ghi chấm công cho ${employeeName} thành công!`);
      }
      setOpenForm(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Không thể lưu bản ghi chấm công. Vui lòng thử lại!");
    }
  };

  const handleEdit = (id) => {
    const r = records.find(x => x.id === id);
    if (r) {
      setEditing(r);
      setOpenForm(true);
    }
  };

  const handleDelete = (id) => {
    setRecordToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!recordToDelete) return;
    
    const record = records.find(r => r.id === recordToDelete);
    const employeeName = record ? employees.find(e => e.id === record.employeeId)?.name || 'Nhân viên' : 'bản ghi này';
    
    const loadingToast = toast.loading("Đang xóa bản ghi chấm công...");
    try {
      setRecords(prev => prev.filter(r => r.id !== recordToDelete));
      toast.dismiss(loadingToast);
      toast.success(`Đã xóa bản ghi chấm công của ${employeeName} thành công!`);
      setOpenDeleteDialog(false);
      setRecordToDelete(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Không thể xóa bản ghi chấm công. Vui lòng thử lại!");
    }
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setRecordToDelete(null);
        }}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(() => {
              const record = records.find(r => r.id === recordToDelete);
              const employeeName = record ? employees.find(e => e.id === record.employeeId)?.name || 'Nhân viên' : 'bản ghi này';
              return (
                <>
                  Bạn có chắc muốn xóa bản ghi chấm công của <strong>{employeeName}</strong>?
                  <br />
                  <span style={{ color: '#ef4444', marginTop: '8px', display: 'block' }}>
                    Hành động này không thể hoàn tác.
                  </span>
                </>
              );
            })()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDeleteDialog(false);
            setRecordToDelete(null);
          }}>
            Hủy
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
