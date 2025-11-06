import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

export default function PayrollList() {
  const rows = [
    { id: 1, employee: "Nguyen Van A", month: "October", salary: 1500 },
    { id: 2, employee: "Tran Thi B", month: "October", salary: 1800 },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "employee", headerName: "Employee", width: 200 },
    { field: "month", headerName: "Month", width: 150 },
    { field: "salary", headerName: "Salary ($)", width: 150 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Payroll Management</h1>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]} />
      </Paper>
    </div>
  );
}
