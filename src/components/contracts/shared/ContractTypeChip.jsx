import React from 'react';
import { Chip } from '@mui/material';
import { CONTRACT_TYPE_CONFIG } from '../../../constants/contractConstants';

const ContractTypeChip = ({ type }) => {
  const config = CONTRACT_TYPE_CONFIG[type] || { 
    label: type, 
    color: "default", 
    variant: "outlined" 
  };

  return (
    <Chip
      label={config.label}
      color={config.color}
      variant={config.variant}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default ContractTypeChip;
