// src/hooks/usePerformanceStatistics.js
import { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';

export const usePerformanceStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await employeeService.getPerformanceStatistics();
      
      // Debug - xem response structure
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // ✅ Sửa: Truy cập response.data thay vì response
      if (response.data.code === 0) {
        setStatistics(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch performance statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return { statistics, isLoading, error, refetch: fetchStatistics };
};