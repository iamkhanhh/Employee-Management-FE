import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  DialogContentText 
} from '@mui/material';

export function AddPayrollDialog({ open, onClose, onSubmit, formState, setFormState, employees }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Payroll</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl required>
              <InputLabel>Employee</InputLabel>
              <Select 
                label="Employee" 
                value={formState.employeeId} 
                onChange={(e) => setFormState({ ...formState, employeeId: e.target.value })}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>{emp.fullName}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField 
              label="Basic Salary" 
              type="number" 
              value={formState.basicSalary} 
              onChange={(e) => setFormState({ ...formState, basicSalary: e.target.value })} 
              required 
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField 
              label="Allowance" 
              type="number" 
              value={formState.allowance} 
              onChange={(e) => setFormState({ ...formState, allowance: e.target.value })} 
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField 
              label="Bonus" 
              type="number" 
              value={formState.bonus} 
              onChange={(e) => setFormState({ ...formState, bonus: e.target.value })} 
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField 
              label="Deduction" 
              type="number" 
              value={formState.deduction} 
              onChange={(e) => setFormState({ ...formState, deduction: e.target.value })} 
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField 
              label="Month" 
              type="month" 
              value={formState.month} 
              onChange={(e) => setFormState({ ...formState, month: e.target.value })} 
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select 
                label="Status" 
                value={formState.status} 
                onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
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

export function DeletePayrollDialog({ open, onClose, onConfirm, payrollInfo }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xoá</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc muốn xoá bảng lương của <strong>{payrollInfo?.fullName}</strong> (Tháng {payrollInfo?.month})? 
          Hành động này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>Xoá</Button>
      </DialogActions>
    </Dialog>
  );
}

