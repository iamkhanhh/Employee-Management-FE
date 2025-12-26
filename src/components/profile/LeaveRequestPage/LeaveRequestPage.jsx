import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  OutlinedInput,
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent,
  IconButton,
  TablePagination,
  Alert,
  Avatar,
  CircularProgress,
  Snackbar,
  Tooltip,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
  EventNote as EventNoteIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  EditNote as EditNoteIcon,
  Send as SendIcon,
  CalendarToday as CalendarTodayIcon,
  EventBusy as EventBusyIcon,
} from "@mui/icons-material";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CloseIcon from '@mui/icons-material/Close';
import { axiosInstance } from "../../../lib/axios";
import { useAuth } from "../../../hooks/useAuth";
import {
  formatDate,
  formatDateForAPI,
  getTodayForInput,
  calculateDaysBetween,
} from '../../../utils/dateUtils';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const LEAVE_TYPES = [
  { value: "SICK_LEAVE", label: "Sick Leave" },
  { value: "ANNUAL_LEAVE", label: "Annual Leave" },
  { value: "MATERNITY_LEAVE", label: "Maternity Leave" },
  { value: "UNPAID_LEAVE", label: "Unpaid Leave" },
  { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_CONFIG = {
  APPROVED: { color: "success", text: "Approved", icon: <CheckCircleIcon /> },
  REJECTED: { color: "error", text: "Rejected", icon: <CancelIcon /> },
  PENDING: { color: "warning", text: "Pending", icon: <PendingIcon /> },
  CANCELLED: { color: "default", text: "Cancelled", icon: <CancelIcon /> },
};

const INITIAL_FILTERS = {
  status: "",
  startDate: "",
  endDate: "",
};

const INITIAL_FORM = {
  leaveType: "SICK_LEAVE",
  startDate: "",
  endDate: "",
  reason: "",
};

// ═══════════════════════════════════════════════════════════════
// LOADING COMPONENT
// ═══════════════════════════════════════════════════════════════
const AuthLoading = ({ message = "Loading..." }) => (
  <Container
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      flexDirection: "column",
    }}
  >
    <CircularProgress size={70} />
    <Typography mt={3} variant="h6" color="text.secondary">
      {message}
    </Typography>
  </Container>
);

// ═══════════════════════════════════════════════════════════════
// FILTER COMPONENT
// ═══════════════════════════════════════════════════════════════
const LeaveFilters = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  loading,
}) => {
  const [expanded, setExpanded] = useState(true);

  const hasActiveFilters = filters.status || filters.startDate || filters.endDate;

  return (
    <Paper elevation={2} sx={{ mb: 3, overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          bgcolor: "grey.100",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterListIcon color="primary" />
          <Typography variant="subtitle1" fontWeight="bold">
            Filters
          </Typography>
          {hasActiveFilters && (
            <Chip size="small" label="Active" color="primary" variant="filled" />
          )}
        </Stack>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Filter Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {/* Row 1: Filters */}
          <Grid container spacing={2}>
            {/* Status Filter */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel shrink>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => onFilterChange("status", e.target.value)}
                  displayEmpty
                  notched
                  renderValue={(selected) => {
                    if (!selected) {
                      return "All Status";
                    }
                    const option = STATUS_OPTIONS.find((opt) => opt.value === selected);
                    return option?.label || selected;
                  }}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {opt.value && STATUS_CONFIG[opt.value] && (
                          React.cloneElement(STATUS_CONFIG[opt.value].icon, {
                            color: STATUS_CONFIG[opt.value].color,
                            fontSize: "small",
                          })
                        )}
                        <span>{opt.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Start Date Filter */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="From Date"
                value={filters.startDate}
                onChange={(e) => onFilterChange("startDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventNoteIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* End Date Filter */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="To Date"
                value={filters.endDate}
                onChange={(e) => onFilterChange("endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: filters.startDate }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventNoteIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* Row 2: Action Buttons */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ClearIcon />}
              onClick={onClearFilters}
              disabled={loading || !hasActiveFilters}
              sx={{
                minWidth: 100,
                borderColor: "grey.400",
                "&:hover": {
                  borderColor: "grey.600",
                  bgcolor: "grey.100",
                },
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={onApplyFilters}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Search
            </Button>
          </Box>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee" }}>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                alignItems="center"
                useFlexGap
              >
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Active filters:
                </Typography>
                {filters.status && (
                  <Chip
                    size="small"
                    label={`Status: ${STATUS_OPTIONS.find((o) => o.value === filters.status)?.label || filters.status}`}
                    onDelete={() => onFilterChange("status", "")}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.startDate && (
                  <Chip
                    size="small"
                    label={`From: ${formatDate(filters.startDate)}`}
                    onDelete={() => onFilterChange("startDate", "")}
                    color="info"
                    variant="outlined"
                  />
                )}
                {filters.endDate && (
                  <Chip
                    size="small"
                    label={`To: ${formatDate(filters.endDate)}`}
                    onDelete={() => onFilterChange("endDate", "")}
                    color="info"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════
const getStatusChip = (status) => {
  const config = STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.PENDING;
  return (
    <Chip
      icon={config.icon}
      label={config.text}
      color={config.color}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
};

const getLeaveTypeLabel = (type) => {
  const found = LEAVE_TYPES.find((t) => t.value === type);
  return found?.label || type?.replace(/_/g, " ");
};

// ═══════════════════════════════════════════════════════════════
// MAIN CONTENT COMPONENT
// ═══════════════════════════════════════════════════════════════
const LeaveRequestContent = ({ user }) => {
  // ─────────────────────────────────────────────────────────────
  // STATE: Employee Info
  // ─────────────────────────────────────────────────────────────
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [employeeError, setEmployeeError] = useState("");

  // ─────────────────────────────────────────────────────────────
  // STATE: Leave Requests
  // ─────────────────────────────────────────────────────────────
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ─────────────────────────────────────────────────────────────
  // STATE: Filters
  // ─────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);

  // ─────────────────────────────────────────────────────────────
  // STATE: Dialogs
  // ─────────────────────────────────────────────────────────────
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // 🆕 STATE: Approve Dialog
  const [openApprove, setOpenApprove] = useState(false);
  const [approving, setApproving] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // STATE: Pagination
  // ─────────────────────────────────────────────────────────────
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ─────────────────────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────────────────────
  const isHead = useMemo(() => employeeInfo?.roleInDept === "HEAD", [employeeInfo]);
  const isViewingDepartment = isHead && departmentId;
  const hasActiveFilters = appliedFilters.status || appliedFilters.startDate || appliedFilters.endDate;

  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "PENDING").length,
      approved: requests.filter((r) => r.status === "APPROVED").length,
      rejected: requests.filter((r) => r.status === "REJECTED").length,
    }),
    [requests]
  );

  const paginatedRequests = useMemo(
    () => requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [requests, page, rowsPerPage]
  );

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: Filters
  // ─────────────────────────────────────────────────────────────
  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({ ...filters });
    setPage(0);
  }, [filters]);

  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setPage(0);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: Snackbar
  // ─────────────────────────────────────────────────────────────
  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // ─────────────────────────────────────────────────────────────
  // FETCH: Employee Info
  // ─────────────────────────────────────────────────────────────
  const fetchEmployeeInfo = useCallback(async () => {
    setLoadingEmployee(true);
    setEmployeeError("");

    try {
      const empRes = await axiosInstance.get("/employees/me");
      const empData = empRes.data?.data;
      setEmployeeInfo(empData);

      if (empData?.roleInDept === "HEAD" && empData?.department) {
        try {
          const deptRes = await axiosInstance.get("/departments");
          const deptList = deptRes.data?.data || [];
          const foundDept = deptList.find((d) => d.deptName === empData.department);
          if (foundDept) {
            setDepartmentId(foundDept.id);
          }
        } catch (deptErr) {
          console.error("Failed to fetch departments:", deptErr);
        }
      }
    } catch (err) {
      console.error("Failed to fetch employee:", err);
      setEmployeeError(err.response?.data?.message || "Failed to load employee info");
    } finally {
      setLoadingEmployee(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // FETCH: Leave Requests
  // ─────────────────────────────────────────────────────────────
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      if (appliedFilters.status) {
        params.status = appliedFilters.status;
      }
      if (appliedFilters.startDate) {
        params.startDate = formatDateForAPI(appliedFilters.startDate);
      }
      if (appliedFilters.endDate) {
        params.endDate = formatDateForAPI(appliedFilters.endDate);
      }

      console.log("📌 API Params:", params);

      let res;
      if (isHead && departmentId) {
        res = await axiosInstance.get(`/leaves/department/${departmentId}`, { params });
      } else {
        res = await axiosInstance.get("/leaves/my", { params });
      }

      const leaveData = res.data?.data || [];
      setRequests(Array.isArray(leaveData) ? leaveData : []);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
      const msg = err.response?.data?.message || "Server connection error";
      setError(msg);
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [isHead, departmentId, appliedFilters, showSnackbar]);

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: Create Leave
  // ─────────────────────────────────────────────────────────────
  const handleCreateLeave = async () => {
    if (!form.startDate || !form.endDate) {
      setFormError("Please select start and end dates");
      return;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      setFormError("Start date must be before or equal to end date");
      return;
    }
    if (form.reason.trim().length < 10) {
      setFormError("Reason must be at least 10 characters");
      return;
    }

    try {
      await axiosInstance.post("/leaves", {
        leaveType: form.leaveType,
        startDate: formatDateForAPI(form.startDate),
        endDate: formatDateForAPI(form.endDate),
        reason: form.reason.trim(),
      });

      showSnackbar("Leave request created successfully!");
      setOpenCreate(false);
      setForm(INITIAL_FORM);
      setFormError("");
      fetchRequests();
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Failed to create leave request", "error");
    }
  };

  const handleCloseCreateDialog = () => {
    setOpenCreate(false);
    setFormError("");
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: Approve (🆕 CẬP NHẬT)
  // ─────────────────────────────────────────────────────────────
  const handleOpenApproveDialog = (request) => {
    setSelectedRequest(request);
    setOpenApprove(true);
  };

  const handleCloseApproveDialog = () => {
    if (!approving) {
      setOpenApprove(false);
      setSelectedRequest(null);
    }
  };

  const handleApproveConfirm = async () => {
    if (!selectedRequest) return;

    setApproving(true);
    try {
      await axiosInstance.post(`/leaves/${selectedRequest.id}/approve`);
      showSnackbar("Leave request approved successfully!", "success");
      setOpenApprove(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Approval failed", "error");
    } finally {
      setApproving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: Reject
  // ─────────────────────────────────────────────────────────────
  const handleOpenRejectDialog = (request) => {
    setSelectedRequest(request);
    setOpenReject(true);
    setRejectReason("");
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      showSnackbar("Please enter rejection reason", "warning");
      return;
    }

    try {
      await axiosInstance.post(`/leaves/${selectedRequest.id}/reject`, {
        rejectReason: rejectReason.trim(),
      });
      showSnackbar("Leave request rejected!");
      setOpenReject(false);
      setRejectReason("");
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Rejection failed", "error");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: View Detail
  // ─────────────────────────────────────────────────────────────
  const handleOpenDetailDialog = (request) => {
    setSelectedRequest(request);
    setOpenDetail(true);
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: Pagination
  // ─────────────────────────────────────────────────────────────
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ─────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchEmployeeInfo();
  }, [fetchEmployeeInfo]);

  useEffect(() => {
    if (!loadingEmployee) {
      fetchRequests();
    }
  }, [loadingEmployee, fetchRequests]);

  // ─────────────────────────────────────────────────────────────
  // RENDER: Loading State
  // ─────────────────────────────────────────────────────────────
  if (loadingEmployee) {
    return <AuthLoading message="Loading employee info..." />;
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: Error State
  // ─────────────────────────────────────────────────────────────
  if (employeeError) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Alert severity="error" action={<Button onClick={fetchEmployeeInfo}>Retry</Button>}>
          <Typography variant="h6" gutterBottom>
            Failed to load employee info
          </Typography>
          <Typography variant="body2">{employeeError}</Typography>
        </Alert>
      </Container>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: Main Content
  // ─────────────────────────────────────────────────────────────
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {isViewingDepartment ? "Department Leave Management" : "My Leave Requests"}
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Welcome, <strong>{employeeInfo?.fullName}</strong>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {!isHead && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreate(true)}
              size="large"
            >
              New Leave Request
            </Button>
          )}
        </Box>
      </Box>

      {/* Warning if HEAD but no departmentId */}
      {isHead && !departmentId && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Department ID not found for "{employeeInfo?.department}". Showing personal leave requests only.
        </Alert>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FILTERS */}
      {/* ═══════════════════════════════════════════════════════ */}
      <LeaveFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        loading={loading}
      />

      {/* Loading State */}
      {loading && (
        <Box textAlign="center" my={10}>
          <CircularProgress size={60} />
          <Typography mt={2}>Loading data...</Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} action={<Button onClick={fetchRequests}>Retry</Button>}>
          {error}
        </Alert>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═══════════════════════════════════════════════════════ */}
      {!loading && !error && (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} mb={4}>
            {[
              { label: "Total", value: stats.total, color: "#1976d2", Icon: EventNoteIcon },
              { label: "Pending", value: stats.pending, color: "#ed6c02", Icon: PendingIcon },
              { label: "Approved", value: stats.approved, color: "#2e7d32", Icon: CheckCircleIcon },
              { label: "Rejected", value: stats.rejected, color: "#d32f2f", Icon: CancelIcon },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.label}>
                <Card elevation={3} sx={{ borderLeft: `5px solid ${item.color}` }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: item.color }}>
                          {item.value}
                        </Typography>
                      </Box>
                      <item.Icon sx={{ fontSize: 48, color: item.color, opacity: 0.2 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Table */}
          <Paper elevation={3}>
            <TableContainer>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                    {isViewingDepartment && <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>}
                    <TableCell sx={{ fontWeight: 700 }}>Leave Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>From</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>To</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Days</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isViewingDepartment ? 8 : 7} align="center" sx={{ py: 10 }}>
                        <EventNoteIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          {hasActiveFilters
                            ? "No leave requests match your filters"
                            : isViewingDepartment
                              ? "No leave requests in department"
                              : "You have no leave requests"}
                        </Typography>
                        {hasActiveFilters ? (
                          <Button
                            variant="outlined"
                            startIcon={<ClearIcon />}
                            onClick={handleClearFilters}
                            sx={{ mt: 2 }}
                          >
                            Clear Filters
                          </Button>
                        ) : (
                          !isHead && (
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() => setOpenCreate(true)}
                              sx={{ mt: 2 }}
                            >
                              Create First Request
                            </Button>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRequests.map((req, index) => (
                      <TableRow key={req.id} hover>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        {isViewingDepartment && (
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", bgcolor: "primary.main" }}>
                                {(req.employeeName || req.fullName || "?")?.[0]?.toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" fontWeight={500}>
                                {req.employeeName || req.fullName || `Employee #${req.empId}`}
                              </Typography>
                            </Stack>
                          </TableCell>
                        )}
                        <TableCell>
                          <Chip label={getLeaveTypeLabel(req.leaveType)} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{req.startDate}</TableCell>
                        <TableCell>{req.endDate}</TableCell>
                        <TableCell>
                          <strong>{calculateDaysBetween(req.startDate, req.endDate)}</strong> days
                        </TableCell>
                        <TableCell>{getStatusChip(req.status)}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleOpenDetailDialog(req)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {isViewingDepartment && req.status === "PENDING" && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleOpenApproveDialog(req)}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleOpenRejectDialog(req)}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {requests.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={requests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
              />
            )}
          </Paper>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DIALOG: Create Leave Request */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog
        open={openCreate}
        onClose={handleCloseCreateDialog}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              overflow: "hidden",
            },
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 2,
            px: 3,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AddIcon />
            <Typography variant="h6" fontWeight="bold" component="span">
              New Leave Request
            </Typography>
          </Stack>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2.5}>
              {/* First Row: Three Fields */}
              <Grid container spacing={2}>
                {/* Leave Type */}
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    select
                    fullWidth
                    label="Leave Type"
                    value={form.leaveType}
                    onChange={(e) => setForm((prev) => ({ ...prev, leaveType: e.target.value }))}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventNoteIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  >
                    {LEAVE_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Start Date */}
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="From Date"
                    value={form.startDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventNoteIcon color="action" />
                          </InputAdornment>
                        ),
                        min: getTodayForInput(),
                      },
                      htmlInput: {
                        min: getTodayForInput(),
                      },
                    }}
                  />
                </Grid>

                {/* End Date */}
                <Grid size={{ xs: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="To Date"
                    value={form.endDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventNoteIcon color="action" />
                          </InputAdornment>
                        ),
                        min: form.startDate || getTodayForInput(),
                      },
                      htmlInput: {
                        min: form.startDate || getTodayForInput(),
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Reason - Full Width on Second Row */}
              <Grid size={{ xs: 12, md: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Reason"
                  placeholder="Please provide a detailed reason for your leave request (minimum 10 characters)..."
                  value={form.reason}
                  onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                  error={!!formError}
                  helperText={formError || `${form.reason.length}/10 characters minimum`}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mt: 1.5, alignSelf: "flex-start" }}>
                          <EditNoteIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "grey.50",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={handleCloseCreateDialog}
            variant="outlined"
            color="inherit"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateLeave}
            startIcon={<SendIcon />}
            sx={{ minWidth: 120 }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOG: View Details */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              overflow: "hidden",
            },
          },
        }}
      >
        {/* Header giống hệt Create */}
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 2,
            px: 3,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <VisibilityIcon />
            <Typography variant="h6" fontWeight="bold" component="span">
              Leave Request Details
            </Typography>
          </Stack>
        </DialogTitle>

        {/* Content giống hệt Create */}
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2.5}>
              {/* Row 1: Leave Type | From Date | To Date */}
              <Grid container spacing={2}>
                {/* Leave Type */}
                <Grid size={{ xs: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5 }}>
                    Leave Type
                  </Typography>
                    <OutlinedInput
                      readOnly
                      value={
                        LEAVE_TYPES.find((t) => t.value === selectedRequest?.leaveType)?.label ||
                        "N/A"
                      }
                      startAdornment={
                        <InputAdornment position="start">
                          <EventNoteIcon color="action" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>

                {/* From Date */}
                <Grid size={{ xs: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5 }}>
                    From Date
                  </Typography>
                    <OutlinedInput
                      readOnly
                      value={selectedRequest?.startDate || "N/A"}
                      startAdornment={
                        <InputAdornment position="start">
                          <EventNoteIcon color="action" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>

                {/* To Date */}
                <Grid size={{ xs: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5 }}>
                    To Date
                  </Typography>
                    <OutlinedInput
                      readOnly
                      value={selectedRequest?.endDate || "N/A"}
                      startAdornment={
                        <InputAdornment position="start">
                          <EventNoteIcon color="action" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>

              {/* Status */}
              <Grid size={{ xs: 6, md: 1 }}>
                <FormControl >
                  <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5 }}>
                    Status
                  </Typography>
                  <OutlinedInput
                    readOnly
                    startAdornment={
                      <InputAdornment position="start">
                        {getStatusChip(selectedRequest?.status)}
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>


              {/* Reason */}
              <Grid size={{ xs: 6, md: 6 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Reason"
                  value={selectedRequest?.reason || "No reason provided"}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Reject Reason */}
              {selectedRequest?.status === "REJECTED" && selectedRequest?.rejectReason && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Rejection Reason"
                    value={selectedRequest.rejectReason}
                    InputProps={{ readOnly: true }}
                    error
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>

        {/* Footer giống hệt form Create */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "grey.50",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setOpenDetail(false)}
            startIcon={<CloseIcon />}
            sx={{ minWidth: 120 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 🆕 DIALOG: Approve Confirmation */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Dialog
        open={openApprove}
        onClose={handleCloseApproveDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: "success.main", color: "white", py: 2.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CheckCircleIcon />
            <Typography variant="h6" fontWeight="bold">
              Confirm Approval
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {selectedRequest && (
            <Box>
              {/* Confirmation Message */}
              <Alert severity="info" sx={{ m: 3 }}>
                Are you sure you want to approve this leave request?
              </Alert>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={handleCloseApproveDialog}
            variant="outlined"
            color="inherit"
            disabled={approving}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleApproveConfirm}
            disabled={approving}
            startIcon={approving ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
            sx={{ minWidth: 140 }}
          >
            {approving ? "Approving..." : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOG: Reject */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Dialog open={openReject} onClose={() => setOpenReject(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CancelIcon />
            <Typography variant="h6" fontWeight="bold">Reject Leave Request</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedRequest && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Rejecting request from: <strong>{selectedRequest.employeeName || selectedRequest.fullName}</strong>
            </Alert>
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenReject(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRejectConfirm}
            disabled={!rejectReason.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SNACKBAR */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={closeSnackbar} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const LeaveRequestPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  if (authLoading || !isAuthenticated || !user) {
    return <AuthLoading message="Loading user info..." />;
  }

  return <LeaveRequestContent user={user} />;
};

export default LeaveRequestPage;