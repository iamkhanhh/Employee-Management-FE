import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  MenuItem,
  Box,
  Typography,
  Button,
  Stack,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Add as AddIcon
} from '@mui/icons-material';

import { CONTRACT_TYPES, CONTRACT_STATUS } from '../../../constants/contractConstants';

const ContractFilters = ({
  filters,
  onFilterChange,
  onSearch,
  onClearFilters,
  onAdd
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        background: 'linear-gradient(145deg, #ffffff, #f8faff)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
        border: '1px solid #e3e6f0'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterListIcon sx={{ fontSize: 28, mr: 1.5, color: '#4361ee' }} />
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Contract Search Filters
        </Typography>
      </Box>

      <Grid container spacing={3}>

        {/* Full-width Search Bar */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Search Employee"
            placeholder="Enter name, email, phone, employee ID..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#4361ee' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 56,
                fontSize: '1.05rem',
              }
            }}
          />
        </Grid>

        {/* Row with 4 perfectly equal fields */}
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            label="Contract Type"
            value={filters.contractType || 'all'}
            onChange={(e) => onFilterChange('contractType', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { height: 56 } }}
          >
            <MenuItem value="all">All Contract Types</MenuItem>
            <MenuItem value={CONTRACT_TYPES.FULL_TIME}>Full-time</MenuItem>
            <MenuItem value={CONTRACT_TYPES.PART_TIME}>Part-time</MenuItem>
            <MenuItem value={CONTRACT_TYPES.INTERNSHIP}>Internship</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            label="Status"
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange('status', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { height: 56 } }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value={CONTRACT_STATUS.ACTIVE}>Active</MenuItem>
            <MenuItem value={CONTRACT_STATUS.PENDING}>Pending</MenuItem>
            <MenuItem value={CONTRACT_STATUS.EXPIRED}>Expired</MenuItem>
            <MenuItem value={CONTRACT_STATUS.TERMINATED}>Terminated</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            type="date"
            fullWidth
            label="From Date"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { height: 56 } }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            type="date"
            fullWidth
            label="To Date"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { height: 56 } }}
          />
        </Grid>

      </Grid>

      {/* Action Buttons */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          sx={{
            height: 52,
            px: 4,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #4361ee 30%, #3f37c9 90%)',
            boxShadow: '0 4px 15px rgba(67, 97, 238, 0.4)',
            '&:hover': { boxShadow: '0 6px 20px rgba(67, 97, 238, 0.5)' }
          }}
        >
          Search
        </Button>

        <Button
          variant="outlined"
          size="large"
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          sx={{
            height: 52,
            px: 4,
            fontWeight: 600,
            borderColor: '#e74c3c',
            color: '#e74c3c',
            '&:hover': {
              borderColor: '#c0392b',
              color: '#c0392b',
              backgroundColor: 'rgba(231, 76, 60, 0.04)'
            }
          }}
        >
          Clear Filters
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            height: 52,
            px: 5,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #00d2d3 30%, #00b894 90%)',
            boxShadow: '0 4px 15px rgba(0, 210, 211, 0.4)',
            '&:hover': { boxShadow: '0 6px 20px rgba(0, 210, 211, 0.5)' }
          }}
        >
          Add New Contract
        </Button>
      </Stack>
    </Paper>
  );
};

export default ContractFilters;