// src/components/contracts/ContractForm/FileUploadStep.jsx
import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { FILE_UPLOAD_CONFIG } from '../../../constants/contractConstants';

const FileUploadStep = ({ 
  contractData, 
  errors, 
  uploadProgress,
  onFileUpload 
}) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file
      const { ALLOWED_TYPES, MAX_SIZE } = FILE_UPLOAD_CONFIG;
      
      if (!ALLOWED_TYPES.includes(file.type)) {
        // Handle error
        return;
      }
      
      if (file.size > MAX_SIZE) {
        // Handle error
        return;
      }
      
      onFileUpload(file);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'rgba(25, 118, 210, 0.02)',
            border: '2px dashed',
            borderColor: errors.file ? 'error.main' : '#1976d2',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
              borderColor: '#1565c0',
            }
          }}
        >
          <input
            type="file"
            hidden
            id="contract-file-upload"
            accept={FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS}
            onChange={handleFileChange}
          />
          <label htmlFor="contract-file-upload" style={{ cursor: 'pointer' }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {contractData.file ? contractData.file.name : "Nhấn để tải lên file hợp đồng"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hỗ trợ file PDF, Word (Tối đa 5MB)
            </Typography>
            {errors.file && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.file}
              </Typography>
            )}
          </label>
          
          {contractData.file && uploadProgress > 0 && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {uploadProgress}% đã tải lên
              </Typography>
            </Box>
          )}
          
          {contractData.file && uploadProgress === 100 && (
            <Alert 
              severity="success" 
              sx={{ mt: 2 }}
              action={
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileUpload(null);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              File đã được tải lên thành công!
            </Alert>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Alert severity="info" icon={<DescriptionIcon />}>
          <Typography variant="body2">
            <strong>Lưu ý:</strong> File hợp đồng nên được scan rõ ràng và có đầy đủ chữ ký của các bên.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );
};

export default FileUploadStep;