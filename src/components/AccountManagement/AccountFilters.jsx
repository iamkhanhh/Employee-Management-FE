import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function AccountFilters({
  query,
  setQuery,
  filterRole,
  setFilterRole,
  filterStatus,
  setFilterStatus,
  onCreate,
}) {
  return (
    <div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <TextField
          label="Search"
          placeholder="Search by name, email, username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          className="md:col-span-3"
        />
        <FormControl size="small">
          <InputLabel>Role</InputLabel>
          <Select label="Role" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="locked">Locked</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 pb-6">
        <Button variant="contained" className="normal-case" onClick={onCreate} startIcon={<AddIcon />}>
          Create Account
        </Button>
      </div>
    </div>
  );
}
