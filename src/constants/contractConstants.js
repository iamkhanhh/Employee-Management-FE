// src/constants/contractConstants.js

export const CONTRACT_TYPES = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  INTERNSHIP: 'INTERNSHIP'
};

export const CONTRACT_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  PENDING: 'PENDING',
  TERMINATED: 'TERMINATED'
};

export const STATUS_CONFIG = {
  [CONTRACT_STATUS.ACTIVE]: {
    label: "ACTIVE",
    color: "success"
  },
  [CONTRACT_STATUS.EXPIRED]: {
    label: "EXPIRED",
    color: "error"
  },
  [CONTRACT_STATUS.PENDING]: {
    label: "PENDING",
    color: "warning"
  },
  [CONTRACT_STATUS.TERMINATED]: {
    label: "TERMINATED",
    color: "default"
  }
};

export const CONTRACT_TYPE_CONFIG = {
  [CONTRACT_TYPES.FULL_TIME]: {
    label: "Full_time",
    color: "primary",
    variant: "filled"
  },
  [CONTRACT_TYPES.PART_TIME]: {
    label: "Part_time",
    color: "secondary",
    variant: "outlined"
  },
  [CONTRACT_TYPES.INTERNSHIP]: {
    label: "Intership",
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