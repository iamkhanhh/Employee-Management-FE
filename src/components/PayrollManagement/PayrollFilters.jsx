import React from 'react';
import { Paper,TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

export default function PayrollFilters({
  query,
  setQuery,
  status,
  setStatus,
  month,
  setMonth,
  year,
  setYear,
  departments,
  department,
  setDepartment,
  onCreate,
  onSearch,
  onCalculate,
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 'all', label: 'All' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <TextField
          label="Employee"
          placeholder="Search by employee name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
        />
        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Month</InputLabel>
          <Select label="Month" value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Year</InputLabel>
          <Select label="Year" value={year} onChange={(e) => setYear(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Department</InputLabel>
          <Select label="Department" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 pb-6">
        <Button variant="outlined" className="normal-case" onClick={onSearch}>Search</Button>
        <Button variant="contained" color="secondary" className="normal-case" onClick={onCalculate}>Calculate Payroll</Button>
     </div>
    </Paper>
  );
}
