import React, { useState } from "react";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function DepartmentList() {
  const [openAdd, setOpenAdd] = useState(false);
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState([
    { id: 1, name: "Human Resources", manager: "Tran Thi B" },
    { id: 2, name: "IT Department", manager: "Nguyen Van A" },
  ]);

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Department Name", width: 220 },
    { field: "manager", headerName: "Manager", width: 200 },
  ];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name) return;
    setDepartments([...departments, { id: departments.length + 1, name, manager: "-" }]);
    setName("");
    setOpenAdd(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Department List</h1>

      <Button variant="contained" onClick={() => setOpenAdd(true)}>+ Add Department</Button>

      <Paper sx={{ height: 400, width: "100%", mt: 3 }}>
        <DataGrid rows={departments} columns={columns} pageSizeOptions={[5, 10]} />
      </Paper>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add Department</DialogTitle>
        <form onSubmit={handleAdd}>
          <DialogContent>
            <TextField
              label="Department Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
