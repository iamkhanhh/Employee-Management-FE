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
  DialogActions,
  FormHelperText // <-- 1. THÊM IMPORT NÀY
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';


const columns = [
  // ... (Nội dung các cột không đổi)
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

// --- 2. THÊM DỮ LIỆU GIẢ CHO PHÒNG BAN ---
const mockDepartments = [
  { id: 1, name: 'Phòng Kỹ thuật (IT)' },
  { id: 2, name: 'Phòng Nhân sự (HR)' },
  { id: 3, name: 'Phòng Kế toán' },
  { id: 4, name: 'Phòng Marketing' },
  { id: 5, name: 'Ban Giám đốc' },
];
// -----------------------------------------


export default function EmployeeList() {
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
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([
    // ... (Dữ liệu employees không đổi)
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
    
  const [formFullName, setFormFullName] = useState("");
  const [formUserId, setFormUserId] = useState("");
  const [formDeptId, setFormDeptId] = useState(""); // State này vẫn giữ nguyên
  const [formGender, setFormGender] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formPhoneNumber, setFormPhoneNumber] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formHireDate, setFormHireDate] = useState("");
  const [formStatus, setFormStatus] = useState("active");
  const [formRoleInDept, setFormRoleInDept] = useState("Staff");

  const resetForm = () => {
    setFormFullName("");
    setFormUserId("");
    setFormDeptId("");
    setFormGender("");
    setFormDob("");
    setFormPhoneNumber("");
    setFormAddress("");
    setFormHireDate("");
    setFormStatus("active");
    setFormRoleInDept("Staff");
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (!formFullName || !formUserId || !formDeptId) {
        console.error("Missing required fields: Full Name, User ID, Dept ID");
        return;
    }

    const nextId = employees.length ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
    const newEmployee = {
      id: nextId,
      user_id: parseInt(formUserId, 10) || null,
      dept_id: parseInt(formDeptId, 10) || null, // Vẫn lưu Dept ID là một con số
      full_name: formFullName,
      gender: formGender,
      dob: formDob,
      phone_number: formPhoneNumber,
      address: formAddress,
      hire_date: formHireDate || new Date().toISOString().slice(0, 10),
      status: formStatus,
      role_in_dept: formRoleInDept,
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

  const handleRowClick = (params) => {
    navigate(`/admin/employees/${params.row.id}`);
  };

  return (
      <div className="min-h-screen flex bg-linear-to-br from-white via-gray-50 to-white">
        {/* Main content */}
        <div className="flex-1 flex items-start justify-center">
          <div className="mx-auto w-full max-w-6xl my-6">
            <Paper className="p-6 md:p-8" elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          
          {/* ... (Phần Filters và Actions không đổi) ... */}
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
                  onRowClick={handleRowClick}
                  sx={{ 
                    border: 0,
                    '& .MuiDataGrid-row': {
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }
                  }}
                />
            </Paper>
            </Paper>
          </div>
        </div>
        
       {/* --- Cập nhật Dialog Add Employee --- */}
       <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add employee</DialogTitle>
        <form onSubmit={handleSaveEmployee}>
          <DialogContent dividers>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Full name"
                value={formFullName}
                onChange={(e) => setFormFullName(e.target.value)}
                required
              />
              <TextField
                label="User ID"
                type="number"
                value={formUserId}
                onChange={(e) => setFormUserId(e.target.value)}
                required
                helperText="ID của tài khoản (user account)"
              />
              
              {/* --- 3. BẮT ĐẦU THAY ĐỔI: Thay thế TextField bằng Select --- */}
              <FormControl required>
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  value={formDeptId}
                  onChange={(e) => setFormDeptId(e.target.value)}
                >
                  {/* Lặp qua dữ liệu giả để tạo MenuItem */}
                  {mockDepartments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Chọn phòng ban</FormHelperText>
              </FormControl>
              {/* --- KẾT THÚC THAY ĐỔI --- */}

              <FormControl>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  value={formGender}
                  onChange={(e) => setFormGender(e.target.value)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Date of birth"
                type="date"
                value={formDob}
                onChange={(e) => setFormDob(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Phone number"
                value={formPhoneNumber}
                onChange={(e) => setFormPhoneNumber(e.target.value)}
              />
              <TextField
                label="Hire date"
                type="date"
                value={formHireDate}
                onChange={(e) => setFormHireDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
               <FormControl>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Role in dept"
                value={formRoleInDept}
                onChange={(e) => setFormRoleInDept(e.target.value)}
                placeholder="e.g. Staff, Manager"
              />
              <TextField
                label="Address"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="md:col-span-2"
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