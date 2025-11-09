// src/components/contracts/ContractForm/ContractInfoStep.jsx

import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
// Sửa đường dẫn: từ ContractForm lên 3 cấp để đến src, sau đó vào constants
import { 
  CONTRACT_TYPES, 
  CONTRACT_STATUS,
  PROBATION_PERIODS,
  WORKING_HOURS 
} from '../../../constants/contractConstants';

const ContractInfoStep = ({ contractData, errors, onInputChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.contract_type}>
          <FormLabel>Loại hợp đồng</FormLabel>
          <RadioGroup
            value={contractData.contract_type}
            onChange={(e) => onInputChange('contract_type', e.target.value)}
            row
          >
            <FormControlLabel 
              value={CONTRACT_TYPES.FULL_TIME} 
              control={<Radio />} 
              label="Toàn thời gian" 
            />
            <FormControlLabel 
              value={CONTRACT_TYPES.PART_TIME} 
              control={<Radio />} 
              label="Bán thời gian" 
            />
          </RadioGroup>
          {errors.contract_type && (
            <FormHelperText>{errors.contract_type}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Trạng thái"
          value={contractData.status}
          onChange={(e) => onInputChange('status', e.target.value)}
          fullWidth
        >
          <MenuItem value={CONTRACT_STATUS.ACTIVE}>Đang hiệu lực</MenuItem>
          <MenuItem value={CONTRACT_STATUS.PENDING}>Chờ duyệt</MenuItem>
        </TextField>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          type="date"
          label="Ngày bắt đầu"
          value={contractData.start_date}
          onChange={(e) => onInputChange('start_date', e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.start_date}
          helperText={errors.start_date}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          type="date"
          label="Ngày kết thúc"
          value={contractData.end_date}
          onChange={(e) => onInputChange('end_date', e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.end_date}
          helperText={errors.end_date}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DateRangeIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          label="Mức lương"
          value={contractData.salary}
          onChange={(e) => onInputChange('salary', e.target.value)}
          fullWidth
          error={!!errors.salary}
          helperText={errors.salary}
          InputProps={{
            endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Thời gian thử việc"
          value={contractData.probation_period}
          onChange={(e) => onInputChange('probation_period', e.target.value)}
          fullWidth
        >
          {PROBATION_PERIODS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Thời gian làm việc"
          value={contractData.working_hours}
          onChange={(e) => onInputChange('working_hours', e.target.value)}
          fullWidth
        >
          {WORKING_HOURS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          label="Quyền lợi"
          value={contractData.benefits}
          onChange={(e) => onInputChange('benefits', e.target.value)}
          fullWidth
          multiline
          rows={2}
          placeholder="Ví dụ: BHXH, BHYT, phụ cấp ăn trưa..."
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          label="Ghi chú"
          value={contractData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
      </Grid>
    </Grid>
  );
};

export default ContractInfoStep;