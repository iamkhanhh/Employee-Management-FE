import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export function CreateEditDialog({ open, onClose, onSubmit, editingAccount, formData, setFormData }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle sx={{ fontWeight: 600 }}>{editingAccount ? 'Edit Account' : 'Create New Account'}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required disabled={!!editingAccount} fullWidth />
            <TextField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required fullWidth />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} disabled={!!editingAccount && formData.status !== 'pending'}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="locked">Locked</MenuItem>
              </Select>
            </FormControl>

            {!editingAccount && (
              <>
                <TextField label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required fullWidth helperText="Password is required for new accounts" />
                <TextField label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required fullWidth helperText="Please confirm your password" />
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">{editingAccount ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export function DeleteDialog({ open, onClose, onConfirm, deleteAccount }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
      <DialogContent>
        <div>
          Are you sure you want to delete the account for <strong>{deleteAccount?.full_name}</strong> ({deleteAccount?.username})?
          <br />
          <span className="text-red-600 mt-2 block">This action cannot be undone.</span>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export function ResetPasswordDialog({ open, onClose, onConfirm, resetAccount }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle sx={{ fontWeight: 600 }}>Reset Password</DialogTitle>
      <DialogContent>
        <div>
          Are you sure you want to reset the password for <strong>{resetAccount?.full_name}</strong> ({resetAccount?.username})?
          <br />
          <span className="mt-2 block">A password reset email will be sent to <strong>{resetAccount?.email}</strong>.</span>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="primary" variant="contained">Reset Password</Button>
      </DialogActions>
    </Dialog>
  );
}
