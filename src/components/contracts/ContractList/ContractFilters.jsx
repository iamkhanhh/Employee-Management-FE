import React from 'react';

// src/components/contracts/ContractList/ContractFilters.jsx
import { CONTRACT_TYPES, CONTRACT_STATUS } from '../../../constants/contractConstants';
import { mockDepartments } from '../../../data/mockData';

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
          Bộ lọc tìm kiếm
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TextField
            name="search"
            label="Tìm kiếm"
            placeholder="Nhập tên, email, SĐT..."
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            select
            name="department"
            label="Phòng ban"
            fullWidth
            value={filters.department || 'all'}
            onChange={(e) => onFilterChange('department', e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            {mockDepartments
              .filter(d => !d.is_deleted)
              .map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.dept_name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            select
            name="contractType"
            label="Loại hợp đồng"
            fullWidth
            value={filters.contractType}
            onChange={(e) => onFilterChange('contractType', e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value={CONTRACT_TYPES.FULL_TIME}>Toàn thời gian</MenuItem>
            <MenuItem value={CONTRACT_TYPES.PART_TIME}>Bán thời gian</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            select
            name="status"
            label="Trạng thái"
            fullWidth
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value={CONTRACT_STATUS.ACTIVE}>Đang hiệu lực</MenuItem>
            <MenuItem value={CONTRACT_STATUS.EXPIRED}>Hết hạn</MenuItem>
            <MenuItem value={CONTRACT_STATUS.PENDING}>Chờ duyệt</MenuItem>
            <MenuItem value={CONTRACT_STATUS.TERMINATED}>Đã chấm dứt</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={1.5}>
          <TextField
            type="date"
            name="startDate"
            label="Từ ngày"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={1.5}>
          <TextField
            type="date"
            name="endDate"
            label="Đến ngày"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
        >
          Tìm kiếm
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          color="error"
        >
          Xóa lọc
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
          Thêm hợp đồng
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<FileUploadIcon />}
          color="info"
          onClick={onImport}
        >
          Nhập Excel
        </Button>

        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          color="success"
          onClick={onExport}
        >
          Xuất báo cáo
        </Button>

        {selectedCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={onDeleteSelected}
          >
            Xóa ({selectedCount})
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ContractFilters;
