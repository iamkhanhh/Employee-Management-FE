import React, { useState, useEffect, useCallback } from 'react';
import AttendanceTable from '../../components/Attendance/AttendanceTable';
import AttendanceForm from '../../components/Attendance/AttendanceForm';
import { useAuth } from '../../hooks/useAuth';
import {
  Box, Button, Typography, Stack, Paper, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';
import { attendanceService } from '../../services/attendanceService';
import { employeeService } from '../../services/employeeService';
import moment from 'moment';

export default function AttendanceManager() {
  const { user,employeeInfo } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  const currentUserId = user?.id ?? null;

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetail, setUser] = useState(null);

  const [filterEmployeeId, setFilterEmployeeId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [editing, setEditing] = useState(null);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // Fetch attendance records
  useEffect(() => {
      console.log(">>> employeeInfo in AttendanceManager useEffect:", employeeInfo);
      if (employeeInfo) {
        setUser(employeeInfo);
      }
  }, [employeeInfo]);
  
  const fetchRecords = useCallback(async () => {
    if (userDetail) {
      try {
        setLoading(true);
        console.log(">>> employeeInfo in AttendanceManager:", userDetail);
        const response = await attendanceService.getRecordsByDeparmentId(userDetail.deptId);
        console.log(">>> response in AttendanceManager:", response.data.data);
        const formattedRecords = response.data.data.map((r, index) => ({
          ...r,
          id: r.id ?? `temp-${index}`,
          empId: r.employeeId,
          date: r.checkInTime ? moment(r.checkInTime, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY") : '',
          timeIn: r.checkInTime ? moment(r.checkInTime, "DD/MM/YYYY HH:mm:ss").format("HH:mm:ss") : '',
          timeOut: r.checkOutTime ? moment(r.checkOutTime, "DD/MM/YYYY HH:mm:ss").format("HH:mm:ss") : '',
          hoursWorked: r.hoursWorked ?? 0,
          overtimeHours: r.overtimeHours ?? 0,
          type: r.type ?? 'work',
          note: r.note ?? ''
        }));
        setRecords(formattedRecords);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err);
        toast.error("Không thể tải dữ liệu chấm công.");
      } finally {
        setLoading(false);
      }
    }
  }, [month, year, userDetail]);

  // Fetch employee list
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getAllEmployees();
      const employeeList = (response.data.data.content || []).map(e => ({
        id: e.id,
        name: e.fullName || e.user?.fullName || e.user?.username || `User ${e.id}`
      }));
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

  const filtered = records.filter(r => (filterEmployeeId ? r.empId === filterEmployeeId : true));

  // Metrics
  const totalRecords = filtered.length;
  const totalEmployees = new Set(filtered.map(r => r.empId)).size;
  const totalHours = filtered.reduce((s, r) => s + (Number(r.hoursWorked) || 0), 0);
  const totalOvertime = filtered.reduce((s, r) => s + (Number(r.overtimeHours) || 0), 0);
  const daysWorked = filtered.filter(r => r.timeIn && r.timeOut && r.type === 'work').length;

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box sx={{ textAlign: 'center', mt: 4 }}><Typography color="error">Đã xảy ra lỗi: {error.message}</Typography></Box>;
  }

  return (
    <Box>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 0 } }}>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h5">Quản lý chấm công</Typography>
        </Stack>

        {/* Metrics */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {[
              { label: 'Tổng bản ghi', value: totalRecords },
              { label: 'Nhân viên có bản ghi', value: totalEmployees },
              { label: 'Tổng giờ', value: totalHours.toFixed(2) },
              { label: 'Tổng OT (h)', value: totalOvertime.toFixed(2) },
              { label: 'Số ngày công', value: daysWorked }
            ].map((m, i) => (
              <Paper key={i} sx={{ p: 2, minWidth: 120 }}>
                <Typography variant="h6">{m.value}</Typography>
                <Typography variant="caption" color="text.secondary">{m.label}</Typography>
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* Table */}
        <AttendanceTable
          records={filtered}
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin}
          onFilterEmployee={setFilterEmployeeId}
          filterEmployeeId={filterEmployeeId}
        />
      </Box>

      {/* Form */}
      <AttendanceForm
        open={openForm}
        onClose={handleCloseForm}
        employees={employees}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        initialData={editing}
        onSave={handleSave}
      />

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(() => {
              const record = records.find(r => r.id === recordToDelete);
              const employeeName = record ? employees.find(e => e.id === record.empId)?.name || 'Nhân viên' : 'bản ghi này';
              return (
                <>
                  Bạn có chắc muốn xóa bản ghi chấm công của <strong>{employeeName}</strong>?
                  <br />
                  <span style={{ color: '#ef4444' }}>Hành động này không thể hoàn tác.</span>
                </>
              );
            })()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
