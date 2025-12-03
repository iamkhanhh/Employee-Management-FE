import React from 'react';
import { Paper, Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function AccountFilters({ filters, setFilters, departments, onSearch, onCreate }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Search */}
        <TextField
          label="Search"
          placeholder="Search by name, username, email"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          size="small"
          className="md:col-span-2"
        />

        {/* Department */}
        <FormControl size="small">
          <InputLabel>Department</InputLabel>
          <Select
            label="Department"
            value={filters.deptId}
            onChange={(e) => setFilters(prev => ({ ...prev, deptId: e.target.value }))}
          >
            <MenuItem value="all">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status */}
        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="DELETED">Deleted</MenuItem>
            <MenuItem value="DISABLED">Disabled</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
          </Select>
        </FormControl>

        {/* Date of Birth */}
        <TextField
          label="Date of Birth"
          type="date"
          value={filters.dob}
          onChange={(e) => setFilters(prev => ({ ...prev, dob: e.target.value }))}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* Buttons */}
      <Box className="flex flex-wrap items-center gap-3 mt-4">
        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
          Create Account
        </Button>
      </Box>
    </Paper>
  );
}
