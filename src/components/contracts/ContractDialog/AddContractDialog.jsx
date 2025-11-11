import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import EmployeeStep from '../ContractForm/EmployeeStep';
import ContractInfoStep from '../ContractForm/ContractInfoStep';
import FileUploadStep from '../ContractForm/FileUploadStep';
import { useContractForm } from '../../../hooks/useContractForm';

const steps = [
  {
    label: 'Employee Information',
    component: EmployeeStep
  },
  {
    label: 'Contract Information',
    component: ContractInfoStep
  },
  {
    label: 'Attached File',
    component: FileUploadStep
  }
];

const AddContractDialog = ({ open, onClose, onSubmit, employees }) => {
  const {
    contractData,
    errors,
    activeStep,
    uploadProgress,
    handleInputChange,
    handleEmployeeSelect,
    handleFileUpload,
    validateCurrentStep,
    handleNext,
    handleBack,
    resetForm,
    setActiveStep
  } = useContractForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);
    
    const result = await onSubmit(contractData);
    
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } else {
      // Handle error
      console.error('Error submitting contract:', result.error);
    }
    
    setIsSubmitting(false);
  };

  const StepContent = steps[activeStep].component;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pb: 2
        }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AssignmentIcon />
            <Typography variant="h6">Add New Contract</Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: activeStep >= index ? '#1976d2' : '#e0e0e0',
                        color: 'white'
                      }}
                    >
                      {activeStep > index ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : (
                        <Typography variant="caption">{index + 1}</Typography>
                      )}
                    </Avatar>
                  )}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 400 }}>
            <StepContent
              contractData={contractData}
              errors={errors}
              employees={employees}
              uploadProgress={uploadProgress}
              onInputChange={handleInputChange}
              onEmployeeSelect={handleEmployeeSelect}
              onFileUpload={handleFileUpload}
            />
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                startIcon={isSubmitting ? null : <SaveIcon />}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  'Save Contract'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Continue
              </Button>
            )}
          </Box>
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} startIcon={<CancelIcon />}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Contract added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddContractDialog;