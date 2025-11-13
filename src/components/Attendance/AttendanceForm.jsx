import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

export default function AttendanceForm({ open, onClose, employees, isAdmin, initialData, onSave, currentUserId }) {
  const [form, setForm] = useState({ id: null, employeeId: employees[0]?.id ?? null, date: new Date().toISOString().slice(0,10), timeIn: '08:30', timeOut: '17:30', overtimeHours: 0, note: '', type: 'work' });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(prev => ({ ...prev, id: null, date: new Date().toISOString().slice(0,10) }));
  }, [initialData]);

  useEffect(() => {
    if (!isAdmin && currentUserId) {
      setForm(prev => ({ ...prev, employeeId: currentUserId }));
    }
  }, [isAdmin, currentUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.employeeId) { alert('Chọn nhân viên'); return; }
    onSave(form);
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
        <TextField label="Time In" name="timeIn" type="time" fullWidth margin="normal" value={form.timeIn} onChange={handleChange} />
        <TextField label="Time Out" name="timeOut" type="time" fullWidth margin="normal" value={form.timeOut} onChange={handleChange} />
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
