import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

export function AddEmployeeDialog({ open, onClose, onSubmit, formState, setFormState, departments }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add employee</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Full name" value={formState.full_name} onChange={(e) => setFormState({ ...formState, fullName: e.target.value })} required />
            <TextField label="User ID" type="number" value={formState.userId} onChange={(e) => setFormState({ ...formState, userId: e.target.value })} required helperText="ID của tài khoản (user account)" />

            <FormControl required>
              <InputLabel>Department</InputLabel>
              <Select label="Department" value={formState.deptId} onChange={(e) => setFormState({ ...formState, deptId: e.target.value })}>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Chọn phòng ban</FormHelperText>
            </FormControl>

            <FormControl>
              <InputLabel>Gender</InputLabel>
              <Select label="Gender" value={formState.gender} onChange={(e) => setFormState({ ...formState, gender: e.target.value })}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Date of birth" type="date" value={formState.dob} onChange={(e) => setFormState({ ...formState, dob: e.target.value })} InputLabelProps={{ shrink: true }} />
            <TextField label="Phone number" value={formState.phoneNumber} onChange={(e) => setFormState({ ...formState, phoneNumber: e.target.value })} />
            <TextField label="Hire date" type="date" value={formState.hireDate} onChange={(e) => setFormState({ ...formState, hireDate: e.target.value })} InputLabelProps={{ shrink: true }} />
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={formState.status} onChange={(e) => setFormState({ ...formState, status: e.target.value })}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Role in dept" value={formState.roleInDept} onChange={(e) => setFormState({ ...formState, roleInDept: e.target.value })} placeholder="e.g. Staff, Manager" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
