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
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const DepartmentFilters = ({
  filters,
  onFilterChange,
  onSearch,
  onClearFilters,
  onAdd,
  onDeleteSelected,
  selectedCount
}) => {
  return (
    <Paper sx={{
      p: 3,
      mb: 3,
      borderRadius: 2,
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      background: 'linear-gradient(to right bottom, #ffffff, #fafafa)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterListIcon sx={{ mr: 1, color: '#1976d2' }} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Search Filters
        </Typography>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            name="search"
            label="Search Department"
            placeholder="Enter department name..."
            fullWidth
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onFilterChange('search', '')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={onSearch}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              Search
            </Button>

            <Tooltip title="Refresh">
              <IconButton
                onClick={onClearFilters}
                sx={{
                  bgcolor: '#f5f5f5',
                  '&:hover': { bgcolor: '#e0e0e0' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{
              background: 'linear-gradient(45deg, #00C853 30%, #B2FF59 90%)',
              boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
            }}
          >
            Add Department
          </Button>

          {selectedCount > 0 && (
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              color="error"
              onClick={onDeleteSelected}
            >
              Delete ({selectedCount})
            </Button>
          )}
        </Box>

        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          color="success"
        >
          Export Excel
        </Button>
      </Box>
    </Paper>
  );
};

export default DepartmentFilters;
