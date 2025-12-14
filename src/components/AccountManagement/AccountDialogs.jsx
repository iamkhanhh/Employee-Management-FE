import React from "react";
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
} from "@mui/material";

/* =====================================================
   ADD ACCOUNT
===================================================== */
export function AddAccountDialog({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Create New Account
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="ACCOUNTANT">Accountant</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
                <Select
                label="Status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="DISABLED">Disabled</MenuItem>
                <MenuItem value="DELETED">Deleted</MenuItem>                
              </Select>
            </FormControl>
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              fullWidth
            />

            <TextField
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              fullWidth
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
export function EditAccountDialog({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Edit Account
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Username (readonly) */}
            <TextField
              label="Username"
              value={formData.username}
              disabled
              fullWidth
            />

            {/* Full Name */}
            <TextField
              label="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              fullWidth
            />

            {/* Email (nếu backend cho phép sửa thì giữ, không thì disable) */}
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              disabled
              fullWidth
            />

            {/* Gender */}
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>

            {/* Country */}
            <TextField
              label="Country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              fullWidth
            />

            {/* Date of birth */}
            <TextField
              label="Date of Birth"
              type="date"
              value={formData.dob || ""}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            {/* Role */}
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="ACCOUNTANT">Accountant</MenuItem>
              </Select>
            </FormControl>

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="DISABLED">Disabled</MenuItem>
                <MenuItem value="DELETED">Deleted</MenuItem>                
              </Select>
            </FormControl>

            {/* Current Password */}
            <TextField
              label="Current Password"
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              helperText="Required if changing password"
              fullWidth
            />

            {/* New Password */}
            <TextField
              label="New Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              fullWidth
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

/* =====================================================
   EDIT ACCOUNT
===================================================== */


/* =====================================================
   DELETE ACCOUNT
===================================================== */
export function DeleteAccountDialog({
  open,
  onClose,
  onConfirm,
  deleteAccount,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Confirm Delete
      </DialogTitle>

      <DialogContent>
        Are you sure you want to delete the account for{" "}
        <strong>{deleteAccount?.full_name}</strong> (
        {deleteAccount?.username})?
        <br />
        <span className="text-red-600 block mt-2">
          This action cannot be undone.
        </span>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* =====================================================
   RESET PASSWORD
===================================================== */
export function ResetPasswordDialog({
  open,
  onClose,
  onConfirm,
  resetAccount,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Reset Password
      </DialogTitle>

      <DialogContent>
        Are you sure you want to reset the password for{" "}
        <strong>{resetAccount?.full_name}</strong> (
        {resetAccount?.username})?
        <br />
        <span className="block mt-2">
          A password reset email will be sent to{" "}
          <strong>{resetAccount?.email}</strong>.
        </span>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm}>
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}
