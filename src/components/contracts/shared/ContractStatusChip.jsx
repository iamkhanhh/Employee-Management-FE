import React from 'react';
import { Chip } from '@mui/material';
// src/components/contracts/shared/ContractStatusChip.jsx
import { STATUS_CONFIG } from '../../../constants/contractConstants';

const ContractStatusChip = ({ status }) => {
  const config = STATUS_CONFIG[status] || { 
    label: status, 
    color: "default" 
  };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default ContractStatusChip;
