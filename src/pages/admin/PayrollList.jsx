import React, { useState, useEffect, useCallback } from "react";
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Custom Hooks
import { usePayroll } from "../../hooks/usePayroll";
import { useDepartments } from "../../hooks/useDepartments";

// Components
import PayrollTable from '../../components/PayrollManagement/PayrollTable';
import DepartmentTable from '../../components/PayrollManagement/DepartmentTable'; // Import DepartmentTable
import EditPayrollDialog from '../../components/PayrollManagement/EditPayrollDialog';

// Services
import { payrollService } from "../../services/payrollService";
import { employeeService } from "../../services/employeeService";

// UI
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function PayrollList() {
  const navigate = useNavigate();

  const { payrolls, totalRows, loading, error, fetchPayrolls } = usePayroll();
  const { fetchDepartments: fetchDeptList, departments: deptList, loading: deptLoading } = useDepartments();

  const [openEdit, setOpenEdit] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [openConfirmCalculate, setOpenConfirmCalculate] = useState(false);

  // New state for department selection
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [deptPagination, setDeptPagination] = useState({
    page: 0,
    rowsPerPage: 10,
  });

  const [employees, setEmployees] = useState([]);
  const [bonusPenalty, setBonusPenalty] = useState({});
  const [savedAdjustments, setSavedAdjustments] = useState([]);

  // Fetch departments on initial load
  useEffect(() => {
    fetchDeptList();
  }, [fetchDeptList]);

  // Fetch employees when a department is selected
  useEffect(() => {
    const fetchEmployees = async () => {
      if (selectedDepartment) {
        try {
          const response = await employeeService.getAllEmployees({ deptId: selectedDepartment.id, page: 0, limit: 1000 });
          setEmployees(response.data?.data?.content || []);
        } catch (err) {
          console.error("Failed to fetch employees:", err);
          setEmployees([]);
        }
      } else {
        setEmployees([]);
      }
    };
    fetchEmployees();
  }, [selectedDepartment]);
  
  // Fetch payrolls when filters change (for the payroll view)
  const getPayrolls = useCallback(() => {
    if (selectedDepartment) {
      const params = { deptId: selectedDepartment.id };
      fetchPayrolls(params);
    }
  }, [selectedDepartment, fetchPayrolls]);

  useEffect(() => {
    if (selectedDepartment) {
      getPayrolls();
    }
  }, [selectedDepartment, getPayrolls]);


  const handleCalculate = () => {
    if (!selectedDepartment) {
      toast.error("Please select a department.");
      return;
    }
    setOpenConfirmCalculate(true);
  };

  const handleConfirmCalculate = async () => {
    if (savedAdjustments.length === 0) {
      toast.error("No adjustments have been saved. Please save adjustments for at least one employee.");
      return;
    }

    const loadingToast = toast.loading("Calculating payroll...");
    try {
      const adjustments = savedAdjustments.map(adj => ({
        empId: adj.empId,
        allowance: adj.allowance,
        bonus: adj.bonus,
        deduction: adj.deduction
      }));

      await payrollService.createPayrollForDepartment(selectedDepartment.id, adjustments);
      toast.dismiss(loadingToast);
      toast.success("Payroll calculated successfully!");
      setOpenConfirmCalculate(false);
      setSavedAdjustments([]); // Clear saved adjustments after successful calculation
      getPayrolls();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Failed to calculate payroll:", err);
      toast.error(err.response?.data?.message || "Failed to calculate payroll.");
    }
  };

  const handleEdit = (row) => {
    setEditingPayroll(row);
    setOpenEdit(true);
  };

  const handleBonusPenaltyChange = (employeeId, field, value) => {
    setBonusPenalty(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleSaveAdjustment = (employeeId) => {
    const adjustment = bonusPenalty[employeeId];
    if (!adjustment) {
      toast.error("No adjustments to save.");
      return;
    }

    const newAdjustment = {
      empId: employeeId,
      allowance: adjustment.allowance || 0,
      bonus: adjustment.bonus || 0,
      deduction: adjustment.deduction || 0,
    };
    console.log("Saving adjustment:", newAdjustment);

    setSavedAdjustments(prev => {
      const existingIndex = prev.findIndex(item => item.empId === employeeId);
      if (existingIndex > -1) {
        const updatedAdjustments = [...prev];
        updatedAdjustments[existingIndex] = newAdjustment;
        return updatedAdjustments;
      } else {
        return [...prev, newAdjustment];
      }
    });
    console.log("Current saved adjustments:", savedAdjustments);
    toast.success(`Saved adjustments for employee ID: ${employeeId}`);
  };

  const employeeColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'fullName', headerName: 'Full name', width: 200, renderCell: (params) => <span className="font-medium">{params.row.fullName}</span> },
    { field: 'empId', headerName: 'Employee ID', width: 130,renderCell: (params) => <span className="font-medium">{params.row.id}</span>  },
    { field: 'allowance', headerName: 'Allowance', width: 150, renderCell: (params) => (
        <TextField type="number" size="small" value={bonusPenalty[params.row.id]?.allowance || ''} onChange={(e) => handleBonusPenaltyChange(params.row.id, 'allowance', e.target.value)} />
    )},
    { field: 'bonus', headerName: 'Bonus', width: 150, renderCell: (params) => (
        <TextField type="number" size="small" value={bonusPenalty[params.row.id]?.bonus || ''} onChange={(e) => handleBonusPenaltyChange(params.row.id, 'bonus', e.target.value)} />
    )},
    { field: 'penalty', headerName: 'Deduction', width: 150, renderCell: (params) => (
        <TextField type="number" size="small" value={bonusPenalty[params.row.id]?.deduction || ''} onChange={(e) => handleBonusPenaltyChange(params.row.id, 'deduction', e.target.value)} />
    )},
    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton color="success" onClick={() => handleSaveAdjustment(params.row.id)}>
          <CheckCircleIcon />
        </IconButton>
      ),
    }
  ];

  const payrollColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'fullName', headerName: 'Full name', width: 200, renderCell: (params) => <span className="font-medium">{params.row.fullName}</span> },
    { field: 'empId', headerName: 'Employee ID', width: 130 },
    { field: 'basicSalary', headerName: 'Basic Salary', width: 140 },
    { field: 'allowance', headerName: 'Allowance', width: 130 },
    { field: 'bonus', headerName: 'Bonus', width: 130, renderCell: (params) => (<span className="text-green-600">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(params.value)}</span>) },
    { field: 'deduction', headerName: 'Deduction', width: 130, renderCell: (params) => (<span className="text-red-600">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(params.value)}</span>) },
    { field: 'netSalary', headerName: 'Net Salary', width: 150, renderCell: (params) => (<span className="font-semibold text-green-600">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(params.value)}</span>) },
    { field: 'status', headerName: 'Status', width: 130, renderCell: (params) => {
        const statusColors = { 'pending': 'bg-yellow-100 text-yellow-800', 'approved': 'bg-blue-100 text-blue-800', 'paid': 'bg-green-100 text-green-800', 'cancelled': 'bg-red-100 text-red-800' };
        const statusColor = statusColors[params.value?.toLowerCase()] || 'bg-gray-100 text-gray-800';
        return (<span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>{params.value}</span>);
    }},
    { field: 'action', headerName: 'Action', width: 130, sortable: false, filterable: false, renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleEdit(params.row); }}><EditIcon fontSize="small" /></IconButton>
        </div>
    )},
  ];

  const renderContent = () => {
    if (!selectedDepartment) {
      return (
        <DepartmentTable
          departments={deptList}
          loading={deptLoading}
          onRowClick={(dept) => setSelectedDepartment(dept)}
          page={deptPagination.page}
          rowsPerPage={deptPagination.rowsPerPage}
          onPageChange={(e, newPage) => setDeptPagination(prev => ({ ...prev, page: newPage }))}
          onRowsPerPageChange={(e) => setDeptPagination({ page: 0, rowsPerPage: parseInt(e.target.value, 10) })}
        />
      );
    }

    return (
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => setSelectedDepartment(null)}
            >
                Back to Departments
            </Button>
            <Typography variant="h5" fontWeight={600}>{selectedDepartment.deptName} - Payroll</Typography>
            <Button variant="contained" color="primary" onClick={handleCalculate}>
                Calculate Payroll
            </Button>
        </Box>

        {error && <Typography color="error">{error}</Typography>}

        <Box mt={4}>
            <Typography variant="h6">Enter Bonus/Penalty</Typography>
            <PayrollTable
            rows={employees}
            columns={employeeColumns}
            loading={loading}
            onRowClick={() => {}}
            rowCount={employees.length}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationMode="client"
            bonusPenalty={bonusPenalty}
            setBonusPenalty={setBonusPenalty}
            />
        </Box>
      </>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 flex items-start justify-center p-4 sm:p-6">
        <div className="w-full max-w-7xl">
          <Paper className="p-4 sm:p-6 md:p-8" elevation={0} sx={{ borderRadius: "16px", border: "1px solid #e5e7eb" }}>
            <Box mb={3}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                Payroll Management
              </Typography>
            </Box>
            {renderContent()}
          </Paper>
        </div>
      </div>
      <EditPayrollDialog open={openEdit} onClose={() => setOpenEdit(false)} payroll={editingPayroll} onSuccess={getPayrolls} />
      <Dialog open={openConfirmCalculate} onClose={() => setOpenConfirmCalculate(false)}>
        <DialogTitle>Confirm Payroll Calculation</DialogTitle>
        <DialogContent>Are you sure you want to calculate payroll for this department?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmCalculate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmCalculate}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
