import React, { useState, useEffect, useCallback } from 'react';
import AttendanceTable from '../../components/Attendance/AttendanceTable';
import AttendanceForm from '../../components/Attendance/AttendanceForm';
import { useAuth } from '../../hooks/useAuth';
import { Box, Button, Typography, Stack, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';
import { attendanceService } from '../../services/attendanceService';
import { employeeService } from '../../services/employeeService';

export default function AttendanceManager() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  const currentUserId = user?.id ?? null;

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterEmployeeId, setFilterEmployeeId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [editing, setEditing] = useState(null);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getAllRecords();
      setRecords(response.data);
      setError(null);
    } catch (err) {
      setError(err);
      toast.error('Không thể tải dữ liệu chấm công.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getAllEmployees();
      const employeeList = (response.data || []).map(e => ({ id: e.id, name: e.full_name || e.user?.full_name || e.user?.username || `User ${e.id}` }));
      setEmployees(employeeList);
    } catch (err) {
      toast.error('Không thể tải danh sách nhân viên.');
    }
  }, []);

  useEffect(() => {
    fetchRecords();
    fetchEmployees();
  }, [fetchRecords, fetchEmployees]);

  const handleOpenNew = () => {
    setEditing(null);
    setOpenForm(true);
  };
  const handleCloseForm = () => setOpenForm(false);

  const handleSave = async (payload) => {
    const isUpdating = !!payload.id;
    const loadingToast = toast.loading(isUpdating ? "Đang cập nhật bản ghi chấm công..." : "Đang tạo bản ghi chấm công...");

    try {
      if (isUpdating) {
        const response = await attendanceService.updateRecord(payload.id, payload);
        setRecords(prev => prev.map(r => r.id === payload.id ? response.data : r));
        toast.success('Đã cập nhật bản ghi chấm công thành công!');
      } else {
        const response = await attendanceService.createRecord(payload);
        setRecords(prev => [response.data, ...prev]);
        toast.success('Đã tạo bản ghi chấm công thành công!');
      }
      setOpenForm(false);
      setEditing(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể lưu bản ghi chấm công. Vui lòng thử lại!");
    } finally {
      toast.dismiss(loadingToast);
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
    
    const loadingToast = toast.loading("Đang xóa bản ghi chấm công...");
    try {
      await attendanceService.deleteRecord(recordToDelete);
      setRecords(prev => prev.filter(r => r.id !== recordToDelete));
      toast.success('Đã xóa bản ghi chấm công thành công!');
      setOpenDeleteDialog(false);
      setRecordToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể xóa bản ghi chấm công. Vui lòng thử lại!");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const filtered = records.filter(r => (filterEmployeeId ? r.employeeId === filterEmployeeId : true));

  // Metrics (based on current filter)
  const metricsSource = filtered;
  const totalRecords = metricsSource.length;
  const totalEmployees = new Set(metricsSource.map(r => r.employeeId)).size;
  const totalHours = metricsSource.reduce((s, r) => s + (Number(r.hoursWorked) || 0), 0);
  const totalOvertime = metricsSource.reduce((s, r) => s + (Number(r.overtimeHours) || 0), 0);
  const daysWorked = metricsSource.filter(r => r.timeIn && r.timeOut && (r.type || 'work') === 'work').length;

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box sx={{ textAlign: 'center', mt: 4 }}><Typography color="error">Đã xảy ra lỗi: {error.message}</Typography></Box>;
  }

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
