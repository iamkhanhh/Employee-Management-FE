import React from 'react';
import { TextField, MenuItem, FormControl, InputLabel, Box, Paper, Button, Select } from '@mui/material';

const TaskFilter = ({ filters, onFilterChange, handleClickOpen }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      {/* FILTER FIELDS */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Start Date"
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => onFilterChange('startDate', e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ minWidth: 150, flex: 1 }}
        />

        <TextField
          label="End Date"
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => onFilterChange('endDate', e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ minWidth: 150, flex: 1 }}
        />

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
      {handleClickOpen && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
          <Button variant="contained" onClick={handleClickOpen}>
            + Add Task
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default TaskFilter;
