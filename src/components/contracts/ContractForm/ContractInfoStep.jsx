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

// ✅ Correct import path for constants (3 levels up from ContractForm)
import {
  CONTRACT_TYPES,
  CONTRACT_STATUS,
  PROBATION_PERIODS,
  WORKING_HOURS
} from '../../../constants/contractConstants';

const ContractInfoStep = ({ contractData, errors, onInputChange }) => {
  return (
    <Grid container spacing={3}>
      {/* Contract Type */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.contract_type}>
          <FormLabel>Contract Type</FormLabel>
          <RadioGroup
            row
            value={contractData.contract_type}
            onChange={(e) => onInputChange('contract_type', e.target.value)}
          >
            <FormControlLabel
              value={CONTRACT_TYPES.FULL_TIME}
              control={<Radio />}
              label="Full-time"
            />
            <FormControlLabel
              value={CONTRACT_TYPES.PART_TIME}
              control={<Radio />}
              label="Part-time"
            />
          </RadioGroup>
          {errors.contract_type && (
            <FormHelperText>{errors.contract_type}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* Status */}
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Status"
          value={contractData.status}
          onChange={(e) => onInputChange('status', e.target.value)}
          fullWidth
        >
          <MenuItem value={CONTRACT_STATUS.ACTIVE}>Active</MenuItem>
          <MenuItem value={CONTRACT_STATUS.PENDING}>Pending Approval</MenuItem>
        </TextField>
      </Grid>

      {/* Start Date */}
      <Grid item xs={12} md={6}>
        <TextField
          type="date"
          label="Start Date"
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

      {/* End Date */}
      <Grid item xs={12} md={6}>
        <TextField
          type="date"
          label="End Date"
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

      {/* Salary */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Salary"
          value={contractData.salary}
          onChange={(e) => onInputChange('salary', e.target.value)}
          fullWidth
          error={!!errors.salary}
          helperText={errors.salary}
          InputProps={{
            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
          }}
        />
      </Grid>

      {/* Probation Period */}
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Probation Period"
          value={contractData.probation_period}
          onChange={(e) => onInputChange('probation_period', e.target.value)}
          fullWidth
        >
          {PROBATION_PERIODS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Working Hours */}
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Working Hours"
          value={contractData.working_hours}
          onChange={(e) => onInputChange('working_hours', e.target.value)}
          fullWidth
        >
          {WORKING_HOURS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Benefits */}
      <Grid item xs={12}>
        <TextField
          label="Benefits"
          value={contractData.benefits}
          onChange={(e) => onInputChange('benefits', e.target.value)}
          fullWidth
          multiline
          rows={2}
          placeholder="Example: Social insurance, health insurance, lunch allowance..."
        />
      </Grid>

      {/* Notes */}
      <Grid item xs={12}>
        <TextField
          label="Notes"
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
