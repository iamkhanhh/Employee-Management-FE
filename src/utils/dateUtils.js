// src/utils/dateUtils.js
// ═══════════════════════════════════════════════════════════════
// DATE UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════
// Database format: yyyy-MM-dd (2025-12-02)
// Display format:  dd/MM/yyyy (02/12/2025)
// ═══════════════════════════════════════════════════════════════

/**
 * Parse date string hoặc Date object thành Date object hợp lệ
 * @param {string|Date} date
 * @returns {Date|null}
 */
// Hàm parseDate chuẩn — xử lý dd/MM/yyyy & yyyy-MM-dd
export const parseDate = (date) => {
  if (!date) return null;

  // Nếu đã là Date object
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }

  // Nếu là string -> chuẩn hóa trước khi parse
  if (typeof date === "string") {
    // Kiểm tra định dạng dd/MM/yyyy (phổ biến tại VN)
    const match = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const [_, day, month, year] = match;
      const parsedDate = new Date(`${year}-${month}-${day}T00:00:00`);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // Thử parse với Date chuẩn (ISO: yyyy-mm-dd)
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

/**
 * Lấy các thành phần của date
 * @param {Date} dateObj
 * @returns {Object}
 */
const getDateParts = (dateObj) => {
  return {
    day: String(dateObj.getDate()).padStart(2, '0'),
    month: String(dateObj.getMonth() + 1).padStart(2, '0'),
    year: dateObj.getFullYear(),
    hours: String(dateObj.getHours()).padStart(2, '0'),
    minutes: String(dateObj.getMinutes()).padStart(2, '0'),
    seconds: String(dateObj.getSeconds()).padStart(2, '0'),
  };
};

// ═══════════════════════════════════════════════════════════════
// DISPLAY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Format date để HIỂN THỊ trên UI
 * 
 * @param {string|Date} date - Date từ database (yyyy-MM-dd) hoặc Date object
 * @param {string} format - Format output
 * @returns {string} Formatted date string
 * 
 * @example
 * formatDate("2025-12-02")                      // "02/12/2025"
 * formatDate("2025-12-02", "yyyy-MM-dd")        // "2025-12-02"
 * formatDate("2025-12-02T08:30:00", "dd/MM/yyyy HH:mm")  // "02/12/2025 08:30"
 */
export const formatDate = (date, format = 'dd/MM/yyyy') => {
  const dateObj = parseDate(date);
  if (!dateObj) return '-';

  const { day, month, year, hours, minutes, seconds } = getDateParts(dateObj);

  const formats = {
    'dd/MM/yyyy': `${day}/${month}/${year}`,
    'yyyy-MM-dd': `${year}-${month}-${day}`,
    'dd/MM/yyyy HH:mm': `${day}/${month}/${year} ${hours}:${minutes}`,
    'dd/MM/yyyy HH:mm:ss': `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`,
    'HH:mm': `${hours}:${minutes}`,
    'HH:mm:ss': `${hours}:${minutes}:${seconds}`,
    'MM/yyyy': `${month}/${year}`,
    'dd/MM': `${day}/${month}`,
  };

  return formats[format] || formats['dd/MM/yyyy'];
};

// ═══════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Format date để GỬI LÊN API (filter parameters)
 * Chuyển từ HTML input (yyyy-MM-dd) sang API format (dd/MM/yyyy)
 * 
 * @param {string} dateStr - Date từ HTML input (yyyy-MM-dd)
 * @returns {string} Date format dd/MM/yyyy cho API
 * 
 * @example
 * formatDateForAPI("2025-12-02")  // "02/12/2025"
 * formatDateForAPI("")            // ""
 */
export const formatDateForAPI = (dateStr) => {
  if (!dateStr) return '';

  // Input từ HTML date input: yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  // Fallback: parse và format
  const dateObj = parseDate(dateStr);
  if (!dateObj) return '';

  const { day, month, year } = getDateParts(dateObj);
  return `${day}/${month}/${year}`;
};

/**
 * Format date từ API response (dd/MM/yyyy) sang database format (yyyy-MM-dd)
 * 
 * @param {string} dateStr - Date từ API (dd/MM/yyyy)
 * @returns {string} Date format yyyy-MM-dd
 * 
 * @example
 * formatDateFromAPI("02/12/2025")  // "2025-12-02"
 */
export const formatDateFromAPI = (dateStr) => {
  if (!dateStr) return '';

  // Input từ API: dd/MM/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  // Đã đúng format hoặc fallback
  return formatDate(dateStr, 'yyyy-MM-dd');
};

// ═══════════════════════════════════════════════════════════════
// INPUT FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Format date cho HTML date input
 * HTML date input yêu cầu format: yyyy-MM-dd
 * 
 * @param {string|Date} date
 * @returns {string} Date format yyyy-MM-dd
 * 
 * @example
 * formatDateForInput("2025-12-02")   // "2025-12-02" (giữ nguyên)
 * formatDateForInput("02/12/2025")   // "2025-12-02" (convert)
 * formatDateForInput(new Date())     // "2025-01-15" (today)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';

  // String input
  if (typeof date === 'string') {
    // Đã đúng format yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // Convert từ dd/MM/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}`;
    }
  }

  // Parse và format
  const dateObj = parseDate(date);
  if (!dateObj) return '';

  const { day, month, year } = getDateParts(dateObj);
  return `${year}-${month}-${day}`;
};

/**
 * Lấy ngày hôm nay cho HTML date input
 * 
 * @returns {string} Today trong format yyyy-MM-dd
 * 
 * @example
 * getTodayForInput()  // "2025-01-15"
 */
export const getTodayForInput = () => {
  const today = new Date();
  const { day, month, year } = getDateParts(today);
  return `${year}-${month}-${day}`;
};

// ═══════════════════════════════════════════════════════════════
// CALCULATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Tính số ngày giữa 2 ngày (bao gồm cả ngày đầu và ngày cuối)
 * 
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {number} Số ngày
 * 
 * @example
 * calculateDaysBetween("2025-12-02", "2025-12-02")  // 1
 * calculateDaysBetween("2025-12-02", "2025-12-05")  // 4
 */
// Hàm tính số ngày giữa 2 ngày (bao gồm ngày đầu & cuối)
export const calculateDaysBetween = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start || !end) return 0;

  // Xóa giờ để tránh lệch ngày do timezone
  start.setHours(12, 0, 0, 0);
  end.setHours(12, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1; // Bao gồm cả ngày đầu + cuối
};

/**
 * Tính số ngày còn lại đến một ngày
 * 
 * @param {string|Date} endDate
 * @returns {string|null} Mô tả số ngày còn lại
 * 
 * @example
 * calculateDaysRemaining("2025-12-31")  // "350 days left"
 * calculateDaysRemaining("2020-01-01")  // "Expired"
 */
export const calculateDaysRemaining = (endDate) => {
  const end = parseDate(endDate);
  if (!end) return null;

  const today = new Date();

  // Reset time
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Expires today';
  if (diffDays === 1) return '1 day left';
  if (diffDays <= 30) return `${diffDays} days left`;
  if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months left`;

  return null;
};

// ═══════════════════════════════════════════════════════════════
// VALIDATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Kiểm tra date có hợp lệ không
 * 
 * @param {string|Date} date
 * @returns {boolean}
 * 
 * @example
 * isValidDate("2025-12-02")  // true
 * isValidDate("invalid")     // false
 * isValidDate("")            // false
 */
export const isValidDate = (date) => {
  return parseDate(date) !== null;
};

/**
 * Kiểm tra khoảng ngày có hợp lệ không (startDate <= endDate)
 * 
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {boolean}
 * 
 * @example
 * isDateRangeValid("2025-12-02", "2025-12-05")  // true
 * isDateRangeValid("2025-12-05", "2025-12-02")  // false
 */
export const isDateRangeValid = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start || !end) return false;

  return start <= end;
};

/**
 * Kiểm tra date có phải là quá khứ không
 * 
 * @param {string|Date} date
 * @returns {boolean}
 * 
 * @example
 * isPastDate("2020-01-01")  // true
 * isPastDate("2030-01-01")  // false
 */
export const isPastDate = (date) => {
  const dateObj = parseDate(date);
  if (!dateObj) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  return dateObj < today;
};

/**
 * Kiểm tra date có phải là hôm nay hoặc tương lai không
 * 
 * @param {string|Date} date
 * @returns {boolean}
 * 
 * @example
 * isFutureOrToday("2030-01-01")  // true
 * isFutureOrToday("2020-01-01")  // false
 */
export const isFutureOrToday = (date) => {
  const dateObj = parseDate(date);
  if (!dateObj) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  return dateObj >= today;
};

/**
 * Kiểm tra date có phải là hôm nay không
 * 
 * @param {string|Date} date
 * @returns {boolean}
 * 
 * @example
 * isToday(new Date())        // true
 * isToday("2020-01-01")      // false
 */
export const isToday = (date) => {
  const dateObj = parseDate(date);
  if (!dateObj) return false;

  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Thêm/bớt ngày
 * 
 * @param {string|Date} date
 * @param {number} days - Số ngày cần thêm (âm để bớt)
 * @param {string} format - Format output
 * @returns {string}
 * 
 * @example
 * addDays("2025-12-02", 5)              // "07/12/2025"
 * addDays("2025-12-02", 5, "yyyy-MM-dd") // "2025-12-07"
 * addDays("2025-12-02", -5)             // "27/11/2025"
 */
export const addDays = (date, days, format = 'dd/MM/yyyy') => {
  const dateObj = parseDate(date);
  if (!dateObj) return '';

  dateObj.setDate(dateObj.getDate() + days);
  return formatDate(dateObj, format);
};

/**
 * Lấy ngày đầu tháng
 * 
 * @param {string|Date} date
 * @param {string} format
 * @returns {string}
 * 
 * @example
 * getFirstDayOfMonth("2025-12-15")  // "01/12/2025"
 */
export const getFirstDayOfMonth = (date, format = 'dd/MM/yyyy') => {
  const dateObj = parseDate(date);
  if (!dateObj) return '';

  dateObj.setDate(1);
  return formatDate(dateObj, format);
};

/**
 * Lấy ngày cuối tháng
 * 
 * @param {string|Date} date
 * @param {string} format
 * @returns {string}
 * 
 * @example
 * getLastDayOfMonth("2025-12-15")  // "31/12/2025"
 */
export const getLastDayOfMonth = (date, format = 'dd/MM/yyyy') => {
  const dateObj = parseDate(date);
  if (!dateObj) return '';

  dateObj.setMonth(dateObj.getMonth() + 1);
  dateObj.setDate(0);
  return formatDate(dateObj, format);
};

/**
 * So sánh 2 ngày
 * 
 * @param {string|Date} date1
 * @param {string|Date} date2
 * @returns {number} -1: date1 < date2, 0: bằng nhau, 1: date1 > date2
 * 
 * @example
 * compareDates("2025-12-02", "2025-12-05")  // -1
 * compareDates("2025-12-02", "2025-12-02")  // 0
 * compareDates("2025-12-05", "2025-12-02")  // 1
 */
export const compareDates = (date1, date2) => {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);

  if (!d1 || !d2) return 0;

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
};