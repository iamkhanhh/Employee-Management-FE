import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

export default function EmployeeFilters({
  query,
  setQuery,
  department,
  setDepartment,
  position,
  setPosition,
  jobLevel,
  setJobLevel,
  nationality,
  setNationality,
  workStatus,
  setWorkStatus,
  onCreate,
  onSearch,
}) {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <TextField
          label="Employee"
          placeholder="Search employees"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
        />
        <FormControl size="small">
          <InputLabel>Position</InputLabel>
          <Select label="Position" value={position} onChange={(e) => setPosition(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="staff">Staff</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Work location</InputLabel>
          <Select label="Work location" value={jobLevel} onChange={(e) => setJobLevel(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="office">Office</MenuItem>
            <MenuItem value="remote">Remote</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Department</InputLabel>
          <Select label="Department" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="it">IT</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Nationality</InputLabel>
          <Select label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="vn">Viet Nam</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" className="md:col-span-2">
          <InputLabel>Work status</InputLabel>
          <Select label="Work status" value={workStatus} onChange={(e) => setWorkStatus(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="working">Working</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 pb-6">
        <Button variant="outlined" className="normal-case" onClick={onSearch}>Search</Button>
        <Button variant="contained" className="normal-case" onClick={onCreate}>+ Add employee</Button>
        <Button variant="outlined" color="error" className="normal-case">✕ Delete employee</Button>
        <Button variant="outlined" className="normal-case">📄 Excel report</Button>
      </div>
    </>
  );
}
