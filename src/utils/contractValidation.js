export const validateEmployeeStep = (data) => {
  const errors = {};
  
  if (!data.emp_id) {
    errors.emp_id = "Vui lòng chọn nhân viên";
  }
  
  return errors;
};

export const validateContractInfoStep = (data) => {
  const errors = {};
  
  if (!data.contract_type) {
    errors.contract_type = "Vui lòng chọn loại hợp đồng";
  }
  
  if (!data.start_date) {
    errors.start_date = "Vui lòng chọn ngày bắt đầu";
  }
  
  if (!data.end_date) {
    errors.end_date = "Vui lòng chọn ngày kết thúc";
  }
  
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    if (endDate <= startDate) {
      errors.end_date = "Ngày kết thúc phải sau ngày bắt đầu";
    }
  }
  
  if (!data.salary) {
    errors.salary = "Vui lòng nhập mức lương";
  }
  
  return errors;
};

export const validateFileUpload = (file) => {
  const errors = {};
  
  if (file) {
    const { MAX_SIZE, ALLOWED_TYPES } = FILE_UPLOAD_CONFIG;
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.file = "Chỉ chấp nhận file PDF hoặc Word";
    }
    
    if (file.size > MAX_SIZE) {
      errors.file = "Kích thước file không được vượt quá 5MB";
    }
  }
  
  return errors;
};

export const validateStep = (stepIndex, data) => {
  switch(stepIndex) {
    case 0:
      return validateEmployeeStep(data);
    case 1:
      return validateContractInfoStep(data);
    case 2:
      return validateFileUpload(data.file);
    default:
      return {};
  }
};