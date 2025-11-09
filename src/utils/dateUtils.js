export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  if (formatString === 'dd/MM/yyyy') {
    return `${day}/${month}/${year}`;
  }
  
  return dateObj.toLocaleDateString('vi-VN');
};

export const calculateDaysRemaining = (endDate) => {
  if (!endDate) return null;
  
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "Đã hết hạn";
  if (diffDays === 0) return "Hết hạn hôm nay";
  if (diffDays <= 30) return `Còn ${diffDays} ngày`;
  
  return null;
};