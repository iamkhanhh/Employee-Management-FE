import { useState, useMemo, useEffect, useCallback } from "react";
import { axiosInstance } from "../lib/axios";

const ENDPOINTS = {
  BY_DEPARTMENT: "/leaves/department",
  APPROVE: (id) => `/leaves/${id}/approve`,
  REJECT: (id) => `/leaves/${id}/reject`,
};

export const useLeaveRequestsAdmin = (departmentId) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("All");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ==================== FETCH DATA ====================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/leaves/department`, {
        params: { deptId: departmentId }
      });

      if (res.data?.code === 0) {
        setRequests(res.data.data || []);
      } else {
        throw new Error(res.data?.message || "Lấy dữ liệu thất bại");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Không lấy được danh sách đơn nghỉ phép";
      setError(msg);
      console.error("Lỗi fetch:", err.response?.data);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  // ==================== APPROVE ====================
  const approveRequest = useCallback(async (id) => {
    setApproving(true);
    try {
      const res = await axiosInstance.put(ENDPOINTS.APPROVE(id)); // no body
      if (res.data?.code === 0) {
        setSnackbar({ open: true, message: "Duyệt đơn thành công!", severity: "success" });
        fetchData();
      } else {
        throw new Error(res.data?.message);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Duyệt đơn thất bại",
        severity: "error",
      });
    } finally {
      setApproving(false);
    }
  }, [fetchData]);

  // ==================== REJECT ====================
  const rejectRequest = useCallback(async (id, reason) => {
    setRejecting(true);
    try {
      const res = await axiosInstance.post(ENDPOINTS.REJECT(id), { rejectReason: reason });
      if (res.data?.code === 0) {
        setSnackbar({ open: true, message: "Từ chối đơn thành công!", severity: "success" });
        fetchData();
        return true;
      } else {
        throw new Error(res.data?.message);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Từ chối đơn thất bại",
        severity: "error",
      });
      return false;
    } finally {
      setRejecting(false);
    }
  }, [fetchData]);

  // ==================== HANDLERS ====================
  const handleApprove = useCallback((reqId) => approveRequest(reqId), [approveRequest]);

  const handleRejectClick = useCallback((req) => {
    setSelectedRequest(req);
    setRejectReason("");
    setOpenRejectDialog(true);
  }, []);

  const handleRejectConfirm = useCallback(async () => {
    if (!selectedRequest || !rejectReason.trim()) return;
    const success = await rejectRequest(selectedRequest.id, rejectReason);
    if (success) {
      setOpenRejectDialog(false);
      setSelectedRequest(null);
      setRejectReason("");
    }
  }, [selectedRequest, rejectReason, rejectRequest]);

  const handleRejectDialogClose = useCallback(() => {
    if (!rejecting) {
      setOpenRejectDialog(false);
      setSelectedRequest(null);
      setRejectReason("");
    }
  }, [rejecting]);

  const handleViewDetails = useCallback((req) => {
    setSelectedRequest(req);
    setOpenDetailDialog(true);
  }, []);

  const handleDetailDialogClose = useCallback(() => {
    setOpenDetailDialog(false);
    setSelectedRequest(null);
  }, []);

  const handleChangePage = useCallback((_, newPage) => setPage(newPage), []);
  const handleChangeRowsPerPage = useCallback((e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }, []);

  const handleCloseSnackbar = useCallback(() => setSnackbar(prev => ({ ...prev, open: false })), []);

  const handleSearchChange = useCallback((val) => {
    setSearchTerm(val);
    setPage(0);
  }, []);

  const handleStatusFilterChange = useCallback((val) => {
    setStatusFilter(val);
    setPage(0);
  }, []);

  const handleLeaveTypeFilterChange = useCallback((val) => {
    setLeaveTypeFilter(val);
    setPage(0);
  }, []);

  // ==================== HELPERS ====================
  const getEmployeeName = useCallback((req) => req?.employeeName || `NV #${req?.empId}`, []);
  const getEmployeeAvatar = useCallback((req) => (req?.employeeName || "?").charAt(0).toUpperCase(), []);
  const formatLeaveType = useCallback((type) =>
    type ? type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : "Unknown"
    , []);
  const formatStatus = useCallback((status) => status ? status.charAt(0) + status.slice(1).toLowerCase() : "Unknown", []);
  const formatDate = useCallback((date) => date ? new Date(date).toLocaleDateString("vi-VN") : "-", []);
  const calculateDuration = useCallback((start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  }, []);
  const getStatusColor = useCallback((status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED": return "success";
      case "REJECTED": return "error";
      default: return "warning";
    }
  }, []);

  // ==================== COMPUTED ====================
  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => r.status?.toUpperCase() === "PENDING").length,
    approved: requests.filter(r => r.status?.toUpperCase() === "APPROVED").length,
    rejected: requests.filter(r => r.status?.toUpperCase() === "REJECTED").length,
  }), [requests]);

  const leaveTypes = useMemo(() => [...new Set(requests.map(r => r.leaveType).filter(Boolean))], [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (req.employeeName || "").toLowerCase().includes(search) ||
        (req.reason || "").toLowerCase().includes(search);
      const matchesStatus = statusFilter === "All" || req.status?.toUpperCase() === statusFilter.toUpperCase();
      const matchesLeaveType = leaveTypeFilter === "All" || req.leaveType === leaveTypeFilter;
      return matchesSearch && matchesStatus && matchesLeaveType;
    });
  }, [requests, searchTerm, statusFilter, leaveTypeFilter]);

  const paginatedRequests = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRequests.slice(start, start + rowsPerPage);
  }, [filteredRequests, page, rowsPerPage]);

  useEffect(() => {
    if (departmentId) fetchData();
  }, [fetchData]);

  return {
    paginatedRequests,
    filteredRequests,
    selectedRequest,
    stats,
    leaveTypes,
    loading,
    error,
    approving,
    rejecting,
    openRejectDialog,
    openDetailDialog,
    rejectReason,
    setRejectReason,
    searchTerm,
    statusFilter,
    leaveTypeFilter,
    page,
    rowsPerPage,
    snackbar,
    getEmployeeName,
    getEmployeeAvatar,
    formatLeaveType,
    formatStatus,
    formatDate,
    calculateDuration,
    getStatusColor,
    fetchData,
    handleApprove,
    handleRejectClick,
    handleRejectConfirm,
    handleRejectDialogClose,
    handleViewDetails,
    handleDetailDialogClose,
    handleChangePage,
    handleChangeRowsPerPage,
    handleCloseSnackbar,
    handleSearchChange,
    handleStatusFilterChange,
    handleLeaveTypeFilterChange,
  };
};