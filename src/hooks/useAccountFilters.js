import { useState, useMemo } from 'react';

export const useAccountFilters = (accounts) => {
  const [filters, setFilters] = useState({
    query: '',
    filterRole: 'all',
    filterStatus: 'all',
  });

  const filteredAccounts = useMemo(() => {
    if (!accounts) return [];
    
    return accounts.filter((acc) => {
      const queryLower = filters.query.toLowerCase();
      
      const matchesQuery =
        (acc.email?.toLowerCase().includes(queryLower)) ||
        (acc.username?.toLowerCase().includes(queryLower)) ||
        (acc.createdAt?.toString().toLowerCase().includes(queryLower));

      const matchesRole = filters.filterRole === 'all' || acc.role === filters.filterRole;
      
      const status = acc.status?.toLowerCase();
      const filterStatus = filters.filterStatus?.toLowerCase();
      const matchesStatus = filterStatus === 'all' || status === filterStatus;

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [accounts, filters]);

  // Expose filters state as well in case the component needs it
  return { filteredAccounts, setFilters, filters };
};
