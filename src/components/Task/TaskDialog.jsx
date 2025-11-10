import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import moment from 'moment';

export default function TaskDialog({ open, onClose, currentTask, onChange, onSave, onDelete, editMode, employees }) {
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
          label="Start Date"
          name="start"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={currentTask.start}
          onChange={onChange}
        />
        <TextField
          label="End Date"
          name="end"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={currentTask.end}
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

        <Select
          multiple
          name="assignees"
          value={currentTask.assignees}
          onChange={onChange}
          renderValue={(selected) => (Array.isArray(selected) ? selected.join(', ') : '')}
          fullWidth
          sx={{ mt: 2 }}
        >
          {employees.map((emp) => (
            <MenuItem key={emp} value={emp}>
              <Checkbox checked={currentTask.assignees.indexOf(emp) > -1} />
              <ListItemText primary={emp} />
            </MenuItem>
          ))}
        </Select>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {editMode && (
          <Button color="error" onClick={() => onDelete(currentTask.id)}>
            Delete
          </Button>
        )}
        <Button variant="contained" onClick={onSave}>
          {editMode ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
