import React from "react";
import { Paper, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box } from "@mui/material";

export default function EmployeeFilters({ filters, setFilters, departments, onCreate, onSearch }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <TextField
          label="Employee"
          placeholder="Search employees"
          value={filters.query}
          onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          size="small"
        />
        <FormControl size="small">
          <InputLabel>Department</InputLabel>
          <Select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
          >
            <MenuItem value="all">All</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Work Status</InputLabel>
          <Select
            value={filters.workStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, workStatus: e.target.value }))}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
            <MenuItem value="INTERN">Intern</MenuItem>
            <MenuItem value="ON_LEAVE">On Leave</MenuItem>
            <MenuItem value="TERMINATED">Terminated</MenuItem>
          </Select>
        </FormControl>

        {/* Bạn có thể thêm khoảng trống hoặc các filter khác ở đây */}
      </Box>

      <Box className="flex flex-wrap items-center gap-3 mt-4">
      <Button variant="contained" onClick={onCreate}>+ Add employee</Button>
      </Box>
    </Paper>
  );
}
