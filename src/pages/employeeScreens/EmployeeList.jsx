import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import EmployeeFilters from '../../components/EmployeeManagement/EmployeeFilters';
import EmployeeTable from '../../components/EmployeeManagement/EmployeeTable';
import { AddEmployeeDialog } from '../../components/EmployeeManagement/EmployeeDialogs';
import { mockDepartments as defaultMockDepartments, mockEmployees as defaultMockEmployees } from '../../data/mockData';

// columns and paginationModel unchanged
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

export default function EmployeeList() {
  // ...existing code...
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

  const initialEmployees = (defaultMockEmployees && defaultMockEmployees.length) ? defaultMockEmployees.map((e) => ({
    id: e.id,
    user_id: e.user_id ?? (e.user?.id ?? null),
    dept_id: e.dept_id ?? (e.department?.id ?? null),
    full_name: e.full_name || e.user?.full_name || e.user?.name || e.user?.username || '',
    gender: e.gender || '',
    dob: e.dob ? (typeof e.dob === 'string' ? e.dob.split('T')[0] : e.dob) : '',
    phone_number: e.phone_number || '',
    address: e.address || '',
    hire_date: e.hire_date ? (typeof e.hire_date === 'string' ? e.hire_date.split('T')[0] : e.hire_date) : '',
    status: e.status ? e.status.toLowerCase() : 'active',
    role_in_dept: e.role_in_dept || e.role || 'Staff',
    created_at: e.created_at ? e.created_at.replace('T', ' ').slice(0, 19) : new Date().toISOString().replace('T', ' ').slice(0, 19),
    updated_at: e.updated_at ? e.updated_at.replace('T', ' ').slice(0, 19) : new Date().toISOString().replace('T', ' ').slice(0, 19),
    is_deleted: e.is_deleted ?? false,
  })) : [
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
  ];

  const [employees, setEmployees] = useState(initialEmployees);

  const departments = (defaultMockDepartments && defaultMockDepartments.length) ? defaultMockDepartments : [
    { id: 1, name: 'Phòng Kỹ thuật (IT)' },
    { id: 2, name: 'Phòng Nhân sự (HR)' },
    { id: 3, name: 'Phòng Kế toán' },
    { id: 4, name: 'Phòng Marketing' },
    { id: 5, name: 'Ban Giám đốc' },
  ];

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

  const [formState, setFormState] = useState({
    full_name: "",
    user_id: "",
    dept_id: "",
    gender: "",
    dob: "",
    phone_number: "",
    address: "",
    hire_date: "",
    status: "active",
    role_in_dept: "Staff",
  });

  const resetForm = () => {
    setFormState({
      full_name: "",
      user_id: "",
      dept_id: "",
      gender: "",
      dob: "",
      phone_number: "",
      address: "",
      hire_date: "",
      status: "active",
      role_in_dept: "Staff",
    });
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (!formState.full_name || !formState.user_id || !formState.dept_id) {
      console.error("Missing required fields: Full Name, User ID, Dept ID");
      return;
    }

    const nextId = employees.length ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
    const newEmployee = {
      id: nextId,
      user_id: parseInt(formState.user_id, 10) || null,
      dept_id: parseInt(formState.dept_id, 10) || null,
      full_name: formState.full_name,
      gender: formState.gender,
      dob: formState.dob,
      phone_number: formState.phone_number,
      address: formState.address,
      hire_date: formState.hire_date || new Date().toISOString().slice(0, 10),
      status: formState.status,
      role_in_dept: formState.role_in_dept,
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
          
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Employee List</h1>

          <EmployeeFilters
            query={query}
            setQuery={setQuery}
            department={department}
            setDepartment={setDepartment}
            position={position}
            setPosition={setPosition}
            jobLevel={jobLevel}
            setJobLevel={setJobLevel}
            nationality={nationality}
            setNationality={setNationality}
            workStatus={workStatus}
            setWorkStatus={setWorkStatus}
            onCreate={() => setOpenAdd(true)}
            onSearch={() => { /* future search handler */ }}
          />

          <EmployeeTable rows={rows} columns={columns} onRowClick={handleRowClick} />
            </Paper>
          </div>
        </div>

       <AddEmployeeDialog open={openAdd} onClose={() => { setOpenAdd(false); resetForm(); }} onSubmit={handleSaveEmployee} formState={formState} setFormState={setFormState} departments={departments} />
    </div>
  );
}