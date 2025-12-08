import { useState, useEffect } from 'react';
import { useDepartments } from './useDepartments';
import { employeeService } from '../services/employeeService';

export const useEmployee = (departmentName) => {
  const [employees, setEmployees] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { departments, loading: departmentsLoading } = useDepartments();

  // Convert tên phòng ban → departmentId
  useEffect(() => {
    if (departments.length > 0 && departmentName) {
      const department = departments.find(
        (d) => d.deptName === departmentName
      );
      if (department) {
        setDepartmentId(department.id);
      }
    }
  }, [departments, departmentName]);

  // Gọi getAllEmployees + lọc theo departmentId
  useEffect(() => {
    if (!departmentId) return;

    setLoading(true);
    employeeService
      .getAllEmployees()
      .then((res) => {
        const allEmployees = res?.data?.data || [];

        // Lọc theo departmentName → departmentId
        const filtered = allEmployees.filter(
          (emp) => emp.department === departmentName
        );

        setEmployees(filtered);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Failed to fetch employees:", err);
      });
  }, [departmentId, departmentName]);

  return {
    employees,
    departmentId,
    loading: loading || departmentsLoading,
    error,
  };
};
