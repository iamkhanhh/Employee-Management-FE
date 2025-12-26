import React, { useState, useEffect, useCallback, useMemo } from "react";
import Paper from '@mui/material/Paper';
import { Box, Typography } from "@mui/material";
import PayrollFilters from '../../components/PayrollManagement/PayrollFilters';
import PayrollTable from '../../components/PayrollManagement/PayrollTable';
import { useDepartments } from "../../hooks/useDepartments";
import { usePayroll } from "../../hooks/usePayroll";

export default function PayrolllManager() {
  const { payrolls: rawPayrolls, totalRows, loading, error, fetchPayrolls } = usePayroll();

  // State for filters
  const [status, setStatus] = useState("all");
  const [month, setMonth] = useState("all");
  const [year, setYear] = useState("all");
  const [department, setDepartment] = useState("all");
  const [departments, setDepartments] = useState([]);
  const { fetchDepartments } = useDepartments();

  const handleFetchPayrolls = useCallback(() => {
    const params = {
      status: status !== 'all' ? status : undefined,
      month: month !== 'all' ? month : undefined,
      year: year !== 'all' ? year : undefined,
      departmentId: department !== 'all' ? department : undefined,
    };
    fetchPayrolls(params);
  }, [status, month, year, department, fetchPayrolls]);

  useEffect(() => {
    handleFetchPayrolls();
  }, [handleFetchPayrolls]);
  
  const loadDepartments = useCallback(async () => {
    const data = await fetchDepartments();
    if (Array.isArray(data)) {
      const formatted = data.map(d => ({ id: d.id, name: d.deptName }));
      setDepartments(formatted);
    }
  }, [fetchDepartments]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const payrolls = useMemo(() => {
    return rawPayrolls.map(p => ({
      ...p,
      basicSalary: p.basicSalary ? parseFloat(p.basicSalary) : 0,
    }));
  }, [rawPayrolls]);

  // --- Columns Definition ---
  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 70, type: 'number' },
    {
      field: 'fullName',
      headerName: 'Full name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
            {params.row.fullName?.charAt(0)?.toUpperCase?.()}
          </span>
          <div className="text-gray-900 font-medium">{params.row.fullName}</div>
        </div>
      ),
    },
    { field: 'employeeId', headerName: 'Employee ID', flex: 1, minWidth: 120 },
   
    { field: 'allowance', headerName: 'Allowance', flex: 1, minWidth: 120, type: 'number',
      renderCell: (params) => (
        <span>{params.value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value) : '-'}</span>
      )
    },
    { field: 'bonus', headerName: 'Bonus', flex: 1, minWidth: 120, type: 'number',
      renderCell: (params) => (
        <span>{params.value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value) : '-'}</span>
      )
    },
    { field: 'deduction', headerName: 'Deduction', flex: 1, minWidth: 120, type: 'number',
      renderCell: (params) => (
        <span>{params.value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value) : '-'}</span>
      )
    },
    { field: 'netSalary', headerName: 'Net Salary', flex: 1.2, minWidth: 140, type: 'number',
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
          {params.value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value) : '-'}
        </span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const statusColors = {
          'pending': 'bg-yellow-100 text-yellow-800',
          'approved': 'bg-blue-100 text-blue-800',
          'paid': 'bg-green-100 text-green-800',
          'cancelled': 'bg-red-100 text-red-800',
        };
        const statusColor = statusColors[params.value?.toLowerCase()] || 'bg-gray-100 text-gray-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {params.value}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen flex bg-linear-to-br from-white via-gray-50 to-white">
      <div className="flex-1 flex items-start justify-center">
        <div className="mx-auto w-full max-w-6xl my-6">
          <Paper className="p-6 md:p-8" elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
            <Box mb={3}>
              <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
                Payroll Management
              </Typography>
            </Box>
            <PayrollFilters
              status={status}
              setStatus={setStatus}
              month={month}
              setMonth={setMonth}
              year={year}
              setYear={setYear}
              departments={departments}
              department={department}
              setDepartment={setDepartment}
              onSearch={handleFetchPayrolls}
            />

            {error && <Typography color="error" sx={{ my: 2 }}>{error}</Typography>}

            <Box sx={{ mt: 4 }}>
              <PayrollTable
                rows={payrolls}
                columns={columns}
                onRowClick={() => {}} // No action on row click
                loading={loading}
                rowCount={totalRows}
              />
            </Box>
          </Paper>
        </div>
      </div>
    </div>
  );
}
