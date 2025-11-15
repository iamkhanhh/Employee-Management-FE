import React from 'react';
import { CONTRACT_TYPES, CONTRACT_STATUS } from '../../../constants/contractConstants';


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
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const ContractFilters = ({
  filters,
  departments,
  contractTypes,
  onFilterChange,
  onSearch,
  onClearFilters,
  onAdd,
  onImport,
  onExport,
  onDeleteSelected,
  selectedCount
}) => {
  return (
    <Paper sx={{
      p: 3,
      mb: 3,
      borderRadius: 2,
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterListIcon sx={{ mr: 1, color: '#1976d2' }} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Search Filters
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Row 1: Search, Department, Contract Type, Status */}
        <Grid item xs={12} md={12}>
          <TextField
            name="search"
            label="Search"
            placeholder="Enter name, email, phone..."
            fullWidth
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={3} >
          <TextField
            select
            name="contractType"
            label="Contract Type"
            fullWidth
            value={filters.contractType}
            onChange={(e) => onFilterChange('contractType', e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value={CONTRACT_TYPES.PART_TIME}>Part_time</MenuItem>
            <MenuItem value={CONTRACT_TYPES.FULL_TIME}>Full_time</MenuItem>
            <MenuItem value={CONTRACT_TYPES.INTERNSHIP}>Intership</MenuItem>
          </TextField>
        </Grid>


        <Grid item xs={12} md={3}>
          <TextField
            select
            name="status"
            label="Status"
            fullWidth
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value={CONTRACT_STATUS.ACTIVE}>Actives</MenuItem>
            <MenuItem value={CONTRACT_STATUS.EXPIRED}>Expired</MenuItem>
            <MenuItem value={CONTRACT_STATUS.PENDING}>Pending</MenuItem>
            <MenuItem value={CONTRACT_STATUS.TERMINATED}>Terminated</MenuItem>
          </TextField>
        </Grid>

        {/* Row 2: From Date, To Date */}
        <Grid item xs={12} md={6}>
          <TextField
            type="date"
            name="startDate"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            type="date"
            name="endDate"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Search / Clear Buttons */}
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
        >
          Search
        </Button>

        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          color="error"
        >
          Clear Filters
        </Button>
      </Stack>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          Add Contract
        </Button>

        <Button
          variant="outlined"
          startIcon={<FileUploadIcon />}
          color="info"
          onClick={onImport}
        >
          Import Excel
        </Button>

        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          color="success"
          onClick={onExport}
        >
          Export Report
        </Button>

        {selectedCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={onDeleteSelected}
          >
            Delete ({selectedCount})
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ContractFilters;
