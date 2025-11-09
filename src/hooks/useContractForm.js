import { useState, useCallback } from 'react';
import { validateStep } from '../utils/contractValidation';

const initialContractState = {
  emp_id: null,
  contract_type: "Full-time",
  start_date: "",
  end_date: "",
  status: "ACTIVE",
  file: null,
  salary: "",
  position: "",
  department: "",
  probation_period: "2 tháng",
  working_hours: "8 giờ/ngày",
  benefits: "",
  notes: ""
};

export const useContractForm = () => {
  const [contractData, setContractData] = useState(initialContractState);
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = useCallback((field, value) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  }, [errors]);

  const handleEmployeeSelect = useCallback((employee) => {
    if (employee) {
      setContractData(prev => ({
        ...prev,
        emp_id: employee.id,
        department: employee.department,
        position: employee.position
      }));
    } else {
      setContractData(prev => ({
        ...prev,
        emp_id: null,
        department: "",
        position: ""
      }));
    }
  }, []);

  const handleFileUpload = useCallback((file) => {
    setContractData(prev => ({
      ...prev,
      file: file
    }));
    
    // Simulate upload progress
    if (file) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }, []);

  const validateCurrentStep = useCallback(() => {
    const stepErrors = validateStep(activeStep, contractData);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [activeStep, contractData]);

  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      setActiveStep(prev => prev + 1);
      return true;
    }
    return false;
  }, [validateCurrentStep]);

  const handleBack = useCallback(() => {
    setActiveStep(prev => prev - 1);
  }, []);

  const resetForm = useCallback(() => {
    setContractData(initialContractState);
    setErrors({});
    setActiveStep(0);
    setUploadProgress(0);
  }, []);

  return {
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
  };
};