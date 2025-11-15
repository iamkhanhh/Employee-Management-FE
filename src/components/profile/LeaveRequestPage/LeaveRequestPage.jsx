import React, { useState, useMemo } from "react";
import {
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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  IconButton,
  TablePagination,
  Divider,
  Alert,
  Container,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
  EventNote as EventNoteIcon,
  CalendarMonth as CalendarIcon,
  FilterList as FilterListIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { mockLeaveRequests, addLeaveRequestToMockData } from "../../../data/mockData";

const LeaveRequestPage = () => {
  const [open, setOpen] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState(mockLeaveRequests);
  const [form, setForm] = useState({
    emp_id: 1,
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("All");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const leaveTypes = ["Annual Leave", "Sick Leave", "Personal Leave", "Maternity Leave"];
  const currentUserId = 1;

  // Statistics for current user
  const userStats = useMemo(() => {
    const userRequests = requests.filter((r) => r.emp_id === currentUserId);
    const total = userRequests.length;
    const pending = userRequests.filter((r) => r.status === "Pending").length;
    const approved = userRequests.filter((r) => r.status === "Approved").length;
    const rejected = userRequests.filter((r) => r.status === "Rejected").length;
    return { total, pending, approved, rejected };
  }, [requests, currentUserId]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => req.emp_id === currentUserId)
      .filter((req) => {
        const matchesSearch =
          req.leave_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.reason.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || req.status === statusFilter;
        const matchesLeaveType = leaveTypeFilter === "All" || req.leave_type === leaveTypeFilter;

        return matchesSearch && matchesStatus && matchesLeaveType;
      });
  }, [requests, currentUserId, searchTerm, statusFilter, leaveTypeFilter]);

  // Paginated requests
  const paginatedRequests = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredRequests.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRequests, page, rowsPerPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "warning";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircleIcon fontSize="small" />;
      case "Rejected":
        return <CancelIcon fontSize="small" />;
      default:
        return <PendingIcon fontSize="small" />;
    }
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.leave_type) {
      newErrors.leave_type = "Please select a leave type";
    }

    if (!form.start_date) {
      newErrors.start_date = "Please select start date";
    }

    if (!form.end_date) {
      newErrors.end_date = "Please select end date";
    }

    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      if (end < start) {
        newErrors.end_date = "End date must be after start date";
      }
    }

    if (!form.reason || form.reason.trim().length < 10) {
      newErrors.reason = "Please provide a detailed reason (at least 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newReq = addLeaveRequestToMockData(form);
    setRequests([...requests, newReq]);
    setOpen(false);
    setForm({
      emp_id: 1,
      leave_type: "",
      start_date: "",
      end_date: "",
      reason: "",
    });
    setErrors({});
  };

  const handleViewDetails = (req) => {
    setSelectedRequest(req);
    setOpenDetailDialog(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = () => {
    setForm({
      emp_id: 1,
      leave_type: "",
      start_date: "",
      end_date: "",
      reason: "",
    });
    setErrors({});
    setOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
            My Leave Requests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your leave requests and track their status
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: 3,
          }}
        >
          Request Leave
        </Button>
      </Stack>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderLeft: "4px solid #1976d2" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Requests
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {userStats.total}
                  </Typography>
                </Box>
                <EventNoteIcon sx={{ fontSize: 48, color: "#1976d2", opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderLeft: "4px solid #ed6c02" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {userStats.pending}
                  </Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 48, color: "#ed6c02", opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderLeft: "4px solid #2e7d32" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Approved
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {userStats.approved}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, color: "#2e7d32", opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderLeft: "4px solid #d32f2f" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Rejected
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="error.main">
                    {userStats.rejected}
                  </Typography>
                </Box>
                <CancelIcon sx={{ fontSize: 48, color: "#d32f2f", opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <FilterListIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Filters
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by leave type or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={leaveTypeFilter}
                  label="Leave Type"
                  onChange={(e) => setLeaveTypeFilter(e.target.value)}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  {leaveTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Card elevation={3}>
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Leave Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((req, index) => (
                  <TableRow
                    key={req.id}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#f9f9f9" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Chip label={req.leave_type} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2">{req.start_date}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2">{req.end_date}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${calculateDuration(req.start_date, req.end_date)} days`}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(req.status)}
                        label={req.status}
                        color={getStatusColor(req.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small" color="info" onClick={() => handleViewDetails(req)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <EventNoteIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No leave requests found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      You haven't submitted any leave requests yet
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
                      Create Your First Request
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {paginatedRequests.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredRequests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Card>

      {/* Create Request Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          elevation: 5,
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#f5f5f5", fontWeight: 700 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AddIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Request Leave
            </Typography>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
            Please fill in all required fields. Your request will be reviewed by HR.
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Leave Type"
                name="leave_type"
                value={form.leave_type}
                onChange={handleChange}
                error={!!errors.leave_type}
                helperText={errors.leave_type}
                required
              >
                {leaveTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.start_date}
                helperText={errors.start_date}
                required
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.end_date}
                helperText={errors.end_date}
                required
                inputProps={{ min: form.start_date || new Date().toISOString().split("T")[0] }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "#f0f7ff",
                  border: "1px solid #90caf9",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {calculateDuration(form.start_date, form.end_date)} days
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!errors.reason}
                helperText={errors.reason || "Provide a detailed reason for your leave request"}
                required
                placeholder="Please explain the reason for your leave request in detail..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} startIcon={<AddIcon />}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 5,
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#f5f5f5", fontWeight: 700 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <VisibilityIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Leave Request Details
            </Typography>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          {selectedRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Leave Type
                </Typography>
                <Typography variant="body1" fontWeight={600} mt={0.5}>
                  {selectedRequest.leave_type}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Box mt={0.5}>
                  <Chip
                    icon={getStatusIcon(selectedRequest.status)}
                    label={selectedRequest.status}
                    color={getStatusColor(selectedRequest.status)}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1" fontWeight={600} mt={0.5}>
                  {selectedRequest.start_date}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body1" fontWeight={600} mt={0.5}>
                  {selectedRequest.end_date}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1" fontWeight={600} mt={0.5}>
                  {calculateDuration(selectedRequest.start_date, selectedRequest.end_date)} days
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Submitted Date
                </Typography>
                <Typography variant="body1" fontWeight={600} mt={0.5}>
                  {selectedRequest.created_at?.split("T")[0] || "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Reason
                </Typography>
                <Paper sx={{ p: 2, mt: 0.5, backgroundColor: "#f9f9f9" }}>
                  <Typography variant="body2">{selectedRequest.reason}</Typography>
                </Paper>
              </Grid>

              {selectedRequest.approved_date && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Processed Date
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    {selectedRequest.approved_date}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDetailDialog(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LeaveRequestPage;