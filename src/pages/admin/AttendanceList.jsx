import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

export default function AttendanceList() {
  const rows = [
    { id: 1, employee: "Nguyen Van A", date: "2025-11-01", status: "Present" },
    { id: 2, employee: "Tran Thi B", date: "2025-11-01", status: "Absent" },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "employee", headerName: "Employee", width: 200 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Attendance Records</h1>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]} />
      </Paper>
    </div>
  );
}
