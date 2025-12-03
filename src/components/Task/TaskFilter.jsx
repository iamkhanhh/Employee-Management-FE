import React from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const TaskFilter = ({ filters, onFilterChange }) => {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
      <TextField
        label="Search Tasks"
        variant="outlined"
        value={filters.searchTerm || ''}
        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
      />
      <FormControl variant="outlined" style={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          label="Status"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="Undone">Undone</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default TaskFilter;
