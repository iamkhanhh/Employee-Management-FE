import { useState, useCallback } from 'react';
import { payrollService } from '../services/payrollService';
import toast from 'react-hot-toast';

export const usePayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayrolls = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      // Remove undefined params
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await payrollService.getAllPayrolls(params);
      
      // Format data from API
      const formattedData = (response.data?.data || []).map((payroll, index) => ({
        ...payroll,
        // Ensure valid id
        id: payroll.id || payroll.payrollId || index,
        // Map API fields to component fields
        fullName: payroll.empName,
        employeeId: payroll.empId,
        // Ensure numeric fields are parsed correctly
        allowance: payroll.allowance ? parseFloat(payroll.allowance) : 0,
        bonus: payroll.bonus ? parseFloat(payroll.bonus) : 0,
        deduction: payroll.deduction ? parseFloat(payroll.deduction) : 0,
        netSalary: payroll.netSalary ? parseFloat(payroll.netSalary) : 0,
      }));
      
      setPayrolls(formattedData);
      setTotalRows(response.data?.totalElements || response.data?.data?.totalElements || 0);

    } catch (err) {
      console.error("Failed to fetch payrolls:", err);
      setError("Could not fetch payroll list.");
      toast.error("Could not fetch payroll list. Please try again!");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayrollForDepartment = useCallback(async (data) => {
    // This function can be expanded with loading/error handling as needed
    return payrollService.createPayrollForDepartment(data);
  }, []);

  const createSinglePayroll = useCallback(async (data) => {
    // This function can be expanded with loading/error handling as needed
    return payrollService.createSinglePayroll(data);
  }, []);

  return {
    payrolls,
    totalRows,
    loading,
    error,
    fetchPayrolls,
    createPayrollForDepartment,
    createSinglePayroll,
  };
};
