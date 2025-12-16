import React, { useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, Checkbox, ListItemText, FormControl, InputLabel } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

export default function TaskDialog({ open, onClose, currentTask, onChange, onSave, onDelete, editMode, employees }) {
  const { employeeInfo } = useAuth();

  const filteredEmployees = useMemo(() => {
    if (!employeeInfo || !employees) return [];
    // Lấy tên phòng ban của người dùng hiện tại
    const currentUserDepartment = employeeInfo.department;
    // Lọc những nhân viên có cùng phòng ban
    return employees.filter(emp => emp.department === currentUserDepartment);
  }, [employees, employeeInfo]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {editMode ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          label="Task Title"
          name="title"
          fullWidth
          margin="normal"
          value={currentTask.title}
          onChange={onChange}
        />

        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={currentTask.description}
          onChange={onChange}
        />
        <TextField
          label="Due Date"
          type="date"
          name="dueDate"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={currentTask.dueDate || ""}
          onChange={onChange}
        />

        <Select
          multiple
          name="assignments"
          value={currentTask.assignments}
          onChange={onChange}
          renderValue={(selected) => (Array.isArray(selected) ? selected.join(', ') : '')}
          fullWidth
          sx={{ mt: 2 }}
        >
          {filteredEmployees.map((emp) => (
            <MenuItem key={emp.id} value={emp.fullName}>
              <Checkbox checked={currentTask.assignments.indexOf(emp.fullName) > -1} />
              <ListItemText primary={emp.fullName} />
            </MenuItem>
          ))}
        </Select>

        {editMode && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={currentTask.status || 'Undone'}
              onChange={onChange}
              label="Status"
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {editMode && (
          <Button color="error" onClick={() => onDelete(currentTask.id)}>
            Delete
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onSave}
        >
          {editMode ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
