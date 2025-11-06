import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

export default function TaskList() {
  const rows = [
    { id: 1, task: "Build API", assigned_to: "Nguyen Van A", deadline: "2025-11-10", status: "In Progress" },
    { id: 2, task: "Design UI", assigned_to: "Tran Thi B", deadline: "2025-11-15", status: "Completed" },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "task", headerName: "Task", width: 200 },
    { field: "assigned_to", headerName: "Assigned To", width: 180 },
    { field: "deadline", headerName: "Deadline", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Task Management</h1>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]} />
      </Paper>
    </div>
  );
}
