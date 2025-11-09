// src/constants/contractConstants.js

export const CONTRACT_TYPES = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time'
};

export const CONTRACT_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  PENDING: 'PENDING',
  TERMINATED: 'TERMINATED'
};

export const STATUS_CONFIG = {
  [CONTRACT_STATUS.ACTIVE]: { 
    label: "Đang hiệu lực", 
    color: "success" 
  },
  [CONTRACT_STATUS.EXPIRED]: { 
    label: "Hết hạn", 
    color: "error" 
  },
  [CONTRACT_STATUS.PENDING]: { 
    label: "Chờ duyệt", 
    color: "warning" 
  },
  [CONTRACT_STATUS.TERMINATED]: { 
    label: "Đã chấm dứt", 
    color: "default" 
  }
};

export const CONTRACT_TYPE_CONFIG = {
  [CONTRACT_TYPES.FULL_TIME]: { 
    label: "Toàn thời gian", 
    color: "primary", 
    variant: "filled" 
  },
  [CONTRACT_TYPES.PART_TIME]: { 
    label: "Bán thời gian", 
    color: "secondary", 
    variant: "outlined" 
  }
};

export const PROBATION_PERIODS = [
  { value: "Không", label: "Không có" },
  { value: "1 tháng", label: "1 tháng" },
  { value: "2 tháng", label: "2 tháng" },
  { value: "3 tháng", label: "3 tháng" }
];

export const WORKING_HOURS = [
  { value: "8 giờ/ngày", label: "8 giờ/ngày" },
  { value: "4 giờ/ngày", label: "4 giờ/ngày (Part-time)" },
  { value: "Linh hoạt", label: "Linh hoạt" }
];

export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  ALLOWED_EXTENSIONS: '.pdf,.doc,.docx'
};