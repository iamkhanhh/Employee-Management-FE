import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box, Paper, Button } from '@mui/material';

const TaskFilter = ({ filters, onFilterChange, handleClickOpen }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      {/* FILTER FIELDS */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl variant="outlined" sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={filters.year || ''}
            onChange={(e) => onFilterChange('year', e.target.value)}
            label="Year"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={filters.month || ''}
            onChange={(e) => onFilterChange('month', e.target.value)}
            label="Month"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
            label="Status"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ADD BUTTON */}
      <Box sx={{ display: 'flex', justifyContent: 'flex', mt: 2 }}>
        <Button variant="contained" onClick={handleClickOpen}>
          + Add Task
        </Button>
      </Box>
    </Paper>
  );
};

export default TaskFilter;
