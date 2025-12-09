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
  FormHelperText,
  DialogContentText,
} from '@mui/material';

/* ===================== ADD EMPLOYEE ===================== */

export function AddEmployeeDialog({
  open,
  onClose,
  onSubmit,
  formState,
  setFormState,
  departments,
  accounts
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Employee</DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <TextField
              label="Full name"
              value={formState.fullName}
              onChange={(e) =>
                setFormState({ ...formState, fullName: e.target.value })
              }
              required
            />
            <TextField
              label="Basic Salary"
              type="number"
              value={formState.basicSalary}
              onChange={(e) =>
                setFormState({ ...formState, basicSalary: e.target.value })
              }
              required
            />

            {/* Select Email -> userId */}
            <FormControl required>
              <InputLabel>Email</InputLabel>
              <Select
                label="Email"
                value={formState.userId}
                onChange={(e) =>
                  setFormState({ ...formState, userId: e.target.value })
                }
              >
                {accounts?.map((acc) => (
                  <MenuItem key={acc.id} value={acc.id}>
                    {acc.email}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Chọn email của tài khoản chưa liên kết</FormHelperText>
            </FormControl>

            <FormControl required>
              <InputLabel>Department</InputLabel>
              <Select
                label="Department"
                value={formState.deptId}
                onChange={(e) =>
                  setFormState({ ...formState, deptId: e.target.value })
                }
              >
                {departments?.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                value={formState.gender}
                onChange={(e) =>
                  setFormState({ ...formState, gender: e.target.value })
                }
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Date of birth"
              type="date"
              value={formState.dob}
              onChange={(e) =>
                setFormState({ ...formState, dob: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Phone number"
              value={formState.phoneNumber}
              onChange={(e) =>
                setFormState({ ...formState, phoneNumber: e.target.value })
              }
            />

            <TextField
              label="Hire date"
              type="date"
              value={formState.hireDate}
              onChange={(e) =>
                setFormState({ ...formState, hireDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />

            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={formState.status}
                onChange={(e) =>
                  setFormState({ ...formState, status: e.target.value })
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Role in dept</InputLabel>
              <Select
                label="Role in dept"
                value={formState.roleInDept}
                onChange={(e) =>
                  setFormState({ ...formState, roleInDept: e.target.value })
                }
              >
                <MenuItem value="Staff">Staff</MenuItem>
                <MenuItem value="Head">Head</MenuItem>
              </Select>
            </FormControl>

          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}


/* ===================== EDIT EMPLOYEE ===================== */

export function EditEmployeeDialog({
  open,
  onClose,
  onSubmit,
  formState,
  setFormState,
  departments
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Employee</DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <TextField
              label="Full name"
              value={formState.fullName}
              onChange={(e) =>
                setFormState({ ...formState, fullName: e.target.value })
              }
              required
            />
            <TextField
              label="Basic Salary"
              type="number"
              value={formState.basicSalary}
              onChange={(e) =>
                setFormState({ ...formState, basicSalary: e.target.value })
              }
              required
            />

            {/* Email - cannot edit */}
            <TextField label="User ID" type="number" value={formState.id} onChange={(e) => setFormState({ ...formState, userId: e.target.value })} required helperText="ID of the user account"  />
            <FormControl required>
              <InputLabel>Department</InputLabel>
              <Select
                label="Department"
                value={formState.deptId}
                onChange={(e) =>
                  setFormState({ ...formState, deptId: e.target.value })
                }
              >
                {departments?.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                value={formState.gender}
                onChange={(e) =>
                  setFormState({ ...formState, gender: e.target.value })
                }
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Date of birth"
              type="date"
              value={formState.dob}
              onChange={(e) =>
                setFormState({ ...formState, dob: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Phone number"
              value={formState.phoneNumber}
              onChange={(e) =>
                setFormState({ ...formState, phoneNumber: e.target.value })
              }
            />

            <TextField
              label="Hire date"
              type="date"
              value={formState.hireDate}
              onChange={(e) =>
                setFormState({ ...formState, hireDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />

            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={formState.status}
                onChange={(e) =>
                  setFormState({ ...formState, status: e.target.value })
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Role in dept</InputLabel>
              <Select
                label="Role in dept"
                value={formState.roleInDept}
                onChange={(e) =>
                  setFormState({ ...formState, roleInDept: e.target.value })
                }
              >
                <MenuItem value="Staff">Staff</MenuItem>
                <MenuItem value="Head">Head</MenuItem>
              </Select>
            </FormControl>

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


/* ===================== DELETE EMPLOYEE ===================== */

export function DeleteEmployeeDialog({
  open,
  onClose,
  onConfirm,
  employeeName
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xoá</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc muốn xoá nhân viên <strong>{employeeName}</strong>?  
          Hành động này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  );
}
