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
  onCalculate,
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 'all', label: 'All' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <FormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
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
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 pb-6">
        <Button variant="contained" color="secondary" className="normal-case" onClick={onCalculate}>Calculate Payroll</Button>
     </div>
    </Paper>
  );
}
