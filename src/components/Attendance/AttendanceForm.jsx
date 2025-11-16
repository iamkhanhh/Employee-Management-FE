import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import toast from 'react-hot-toast';

export default function AttendanceForm({ open, onClose, employees, isAdmin, initialData, onSave, currentUserId }) {
  const [form, setForm] = useState({ id: null, employeeId: employees[0]?.id ?? null, date: new Date().toISOString().slice(0,10), timeIn: '', timeOut: '', overtimeHours: 0, hoursWorked: 0, note: '', type: 'work' });

  useEffect(() => {
    if (initialData) setForm({ ...initialData });
    else setForm(prev => ({ ...prev, id: null, date: new Date().toISOString().slice(0,10), timeIn: '', timeOut: '', overtimeHours: 0, hoursWorked: 0 }));
  }, [initialData]);

  useEffect(() => {
    if (!isAdmin && currentUserId) {
      setForm(prev => ({ ...prev, employeeId: currentUserId }));
    }
  }, [isAdmin, currentUserId]);

  const parseTime = (date, time) => {
    if (!time) return null;
    // support HH:mm or HH:mm:ss
    const t = time.length === 5 ? `${time}:00` : time;
    return new Date(`${date}T${t}`);
  };

  const computeHours = (date, timeIn, timeOut) => {
    const inDt = parseTime(date, timeIn);
    const outDt = parseTime(date, timeOut);
    if (!inDt || !outDt) return { hours: 0, overtime: 0 };
    const diffMs = outDt - inDt;
    if (isNaN(diffMs) || diffMs < 0) return { hours: 0, overtime: 0 };
    const hours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // 2 decimals
    const overtime = Math.max(0, Math.round((hours - 8) * 100) / 100);
    return { hours, overtime };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'overtimeHours' || name === 'hoursWorked' ? Number(value) : value }));
  };

  const handleSubmit = () => {
    if (!form.employeeId) {
      toast.error('Vui lòng chọn nhân viên!');
      return;
    }
    
    if (form.timeIn && form.timeOut) {
      const inDt = parseTime(form.date, form.timeIn);
      const outDt = parseTime(form.date, form.timeOut);
      if (!inDt || !outDt) {
        toast.error('Định dạng thời gian không hợp lệ!');
        return;
      }
      if (outDt < inDt) {
        toast.error('Giờ ra phải lớn hơn hoặc bằng giờ vào!');
        return;
      }
    }

    const { hours, overtime } = computeHours(form.date, form.timeIn, form.timeOut);
    const payload = { ...form, hoursWorked: hours, overtimeHours: overtime };
    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{form.id ? 'Edit Attendance' : 'New Attendance'}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Employee</InputLabel>
          <Select name="employeeId" value={form.employeeId} onChange={handleChange} label="Employee" disabled={!isAdmin}>
            {employees.map(emp => (<MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>))}
          </Select>
        </FormControl>
        <TextField label="Date" name="date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={form.date} onChange={handleChange} />
        <TextField label="Time In" name="timeIn" type="time" fullWidth margin="normal" value={form.timeIn} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <TextField label="Time Out" name="timeOut" type="time" fullWidth margin="normal" value={form.timeOut} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <TextField label="Overtime Hours" name="overtimeHours" type="number" fullWidth margin="normal" value={form.overtimeHours} onChange={handleChange} />
        <TextField label="Note" name="note" fullWidth margin="normal" value={form.note} onChange={handleChange} />

        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select name="type" value={form.type} onChange={handleChange} label="Type">
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="leave">Leave</MenuItem>
            <MenuItem value="remote">Remote</MenuItem>
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="holiday">Holiday</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{form.id ? 'Update' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  );
}
