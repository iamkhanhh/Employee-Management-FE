import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { NavLink, useLocation } from 'react-router-dom';
import { Sidebar } from '../components';


const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  {
    field: 'full_name',
    headerName: 'Full name',
    width: 200,
    renderCell: (params) => (
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          {params.row.full_name?.charAt(0)?.toUpperCase?.()}
        </span>
        <div className="text-gray-900 font-medium">{params.row.full_name}</div>
      </div>
    ),
  },
  { field: 'gender', headerName: 'Gender', width: 110 },
  { field: 'dob', headerName: 'Date of birth', width: 140 },
  { field: 'phone_number', headerName: 'Phone', width: 140 },
  { field: 'address', headerName: 'Address', width: 220 },
  { field: 'hire_date', headerName: 'Hire date', width: 130 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'role_in_dept', headerName: 'Role in dept', width: 150 },
  { field: 'dept_id', headerName: 'Dept ID', type: 'number', width: 100 },
  { field: 'created_at', headerName: 'Created at', width: 170 },
  { field: 'updated_at', headerName: 'Updated at', width: 170 },
];
const paginationModel = { page: 0, pageSize: 5 };

export default function AccountManagementPage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [position, setPosition] = useState("all");
  const [jobLevel, setJobLevel] = useState("all");
  const [nationality, setNationality] = useState("all");
  const [workStatus, setWorkStatus] = useState("all");
  const [openAdd, setOpenAdd] = useState(false);
  const [openHr, setOpenHr] = useState(true);
  const [openPayroll, setOpenPayroll] = useState(false);
  const location = useLocation();

  const [employees, setEmployees] = useState([
    {
      id: 1,
      user_id: 11,
      dept_id: 3,
      full_name: 'Nguyen Van A',
      gender: 'Male',
      dob: '1995-05-10',
      phone_number: '0900000001',
      address: '123 Nguyen Trai, Ha Noi',
      hire_date: '2022-08-01',
      status: 'active',
      role_in_dept: 'Staff',
      created_at: '2024-01-01 09:00:00',
      updated_at: '2025-01-01 09:00:00',
      is_deleted: false,
    },
    {
      id: 2,
      user_id: 12,
      dept_id: 5,
      full_name: 'Tran Thi B',
      gender: 'Female',
      dob: '1997-11-20',
      phone_number: '0900000002',
      address: '456 Le Loi, Da Nang',
      hire_date: '2023-03-15',
      status: 'active',
      role_in_dept: 'Manager',
      created_at: '2024-02-02 10:00:00',
      updated_at: '2025-02-02 10:00:00',
      is_deleted: false,
    },
  ]);
  const rows = employees
    .filter((e) =>
      e.full_name.toLowerCase().includes(query.toLowerCase()) ||
      e.phone_number.toLowerCase().includes(query.toLowerCase())
    )
    .map((e) => ({
      ...e,
      dob: e.dob ? new Date(e.dob).toLocaleDateString() : '',
      hire_date: e.hire_date ? new Date(e.hire_date).toLocaleDateString() : '',
      created_at: e.created_at,
      updated_at: e.updated_at,
    }));
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("User");
  const [formDepartment, setFormDepartment] = useState("");
  const [formGroup, setFormGroup] = useState("");
  const [formTimekeepingCode, setFormTimekeepingCode] = useState("");
  const [formJoinDate, setFormJoinDate] = useState("");

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormRole("User");
    setFormDepartment("");
    setFormGroup("");
    setFormTimekeepingCode("");
    setFormJoinDate("");
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    const nextId = employees.length ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
    const newEmployee = {
      id: nextId,
      user_id: 100 + nextId,
      dept_id: formDepartment ? 1 : 0,
      full_name: formName,
      gender: '',
      dob: '',
      phone_number: '',
      address: '',
      hire_date: formJoinDate || new Date().toISOString().slice(0, 10),
      status: 'active',
      role_in_dept: formRole || 'Staff',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      is_deleted: false,
    };

    setEmployees([...employees, newEmployee]);
    setOpenAdd(false);
    resetForm();
  };
  const handleToggleHr = () => {
    setOpenHr(!openHr);
  };
  const handleTogglePayroll = () => {
    setOpenPayroll(!openPayroll);
  };

  return (
      <div className="min-h-screen flex bg-linear-to-br from-white via-gray-50 to-white">
        {/* Sidebar */}
        <Sidebar />
        {/* Main content */}
        <div className="flex-1 flex items-start justify-center">
          <div className="mx-auto w-full max-w-6xl my-6">
            <Paper className="p-6 md:p-8" elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Employee List</h1>

          {/* Filters grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            <TextField
              label="Employee"
              placeholder="Search employees"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="small"
            />
            <FormControl size="small">
              <InputLabel>Position</InputLabel>
              <Select label="Position" value={position} onChange={(e) => setPosition(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Work location</InputLabel>
              <Select label="Work location" value={jobLevel} onChange={(e) => setJobLevel(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="office">Office</MenuItem>
                <MenuItem value="remote">Remote</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Department</InputLabel>
              <Select label="Department" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="it">IT</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Nationality</InputLabel>
              <Select label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="vn">Viet Nam</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" className="md:col-span-2">
              <InputLabel>Work status</InputLabel>
              <Select label="Work status" value={workStatus} onChange={(e) => setWorkStatus(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="working">Working</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-3 pb-6">
            <Button variant="outlined" className="normal-case">Search</Button>
            <Button variant="contained" className="normal-case" onClick={() => setOpenAdd(true)}>
              + Add employee
            </Button>
            <Button variant="outlined" color="error" className="normal-case">✕ Delete employee</Button>
            <Button variant="outlined" className="normal-case">📄 Excel report</Button>
          </div>
          <Paper sx={{ height: 440, width: '100%', mt: 2 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection                  
                  sx={{ border: 0 }}
                />
            </Paper>
            </Paper>
          </div>
        </div>
       <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add employee</DialogTitle>
        <form onSubmit={handleSaveEmployee}>
          <DialogContent dividers>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Full name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
              <TextField
                label="Email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
              />
              <FormControl>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Timekeeping code"
                value={formTimekeepingCode}
                onChange={(e) => setFormTimekeepingCode(e.target.value)}
                placeholder="e.g. 0001"
              />
              <TextField
                label="Department"
                value={formDepartment}
                onChange={(e) => setFormDepartment(e.target.value)}
              />
              <TextField
                label="Work group"
                value={formGroup}
                onChange={(e) => setFormGroup(e.target.value)}
              />
              <TextField
                label="Join date"
                type="date"
                value={formJoinDate}
                onChange={(e) => setFormJoinDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenAdd(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}


