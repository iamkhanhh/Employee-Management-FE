import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  Badge,
  TablePagination,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { mockLeaveRequests, mockEmployees } from "../../data/mockData";

const LeaveRequestsAdmin = () => {
  const [requests, setRequests] = useState(mockLeaveRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("All");
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const currentAdminId = 2;

  const getEmployeeName = (emp_id) => {
    const emp = mockEmployees.find((e) => e.id === emp_id);
    return emp ? emp.full_name : "Unknown";
  };

  const getEmployeeAvatar = (emp_id) => {
    const emp = mockEmployees.find((e) => e.id === emp_id);
    return emp ? emp.full_name.charAt(0).toUpperCase() : "?";
  };

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

  // Statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "Pending").length;
    const approved = requests.filter((r) => r.status === "Approved").length;
    const rejected = requests.filter((r) => r.status === "Rejected").length;
    return { total, pending, approved, rejected };
  }, [requests]);

  // Filtered and searched requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch = getEmployeeName(req.emp_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || req.status === statusFilter;
      const matchesLeaveType = leaveTypeFilter === "All" || req.leave_type === leaveTypeFilter;
      
      return matchesSearch && matchesStatus && matchesLeaveType;
    });
  }, [requests, searchTerm, statusFilter, leaveTypeFilter]);

  // Paginated requests
  const paginatedRequests = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredRequests.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRequests, page, rowsPerPage]);

  const handleApprove = (reqId) => {
    const updated = requests.map((r) =>
      r.id === reqId
        ? {
            ...r,
            status: "Approved",
            approved_by: currentAdminId,
            approved_date: new Date().toISOString().split("T")[0],
            updated_at: new Date().toISOString(),
          }
        : r
    );
    setRequests(updated);
  };

  const handleRejectClick = (req) => {
    setSelectedRequest(req);
    setRejectReason("");
    setOpenDialog(true);
  };

  const handleRejectConfirm = () => {
    const updated = requests.map((r) =>
      r.id === selectedRequest.id
        ? {
            ...r,
            status: "Rejected",
            reason: `${r.reason} (Rejected: ${rejectReason})`,
            approved_by: currentAdminId,
            approved_date: new Date().toISOString().split("T")[0],
            updated_at: new Date().toISOString(),
          }
        : r
    );
    setRequests(updated);
    setOpenDialog(false);
    setSelectedRequest(null);
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

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
          Leave Requests Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and review employee leave requests
        </Typography>
      </Box>

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
                    {stats.total}
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
                    {stats.pending}
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
                    {stats.approved}
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
                    {stats.rejected}
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
                placeholder="Search by employee or reason..."
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
                  <MenuItem value="Annual Leave">Annual Leave</MenuItem>
                  <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                  <MenuItem value="Personal Leave">Personal Leave</MenuItem>
                  <MenuItem value="Maternity Leave">Maternity Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Card elevation={3}>
        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Leave Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((req, index) => (
                  <TableRow 
                    key={req.id} 
                    hover
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar 
                          sx={{ 
                            width: 36, 
                            height: 36, 
                            bgcolor: 'primary.main',
                            fontSize: '0.9rem'
                          }}
                        >
                          {getEmployeeAvatar(req.emp_id)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          {getEmployeeName(req.emp_id)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={req.leave_type} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
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
                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleViewDetails(req)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {req.status === "Pending" && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleApprove(req.id)}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRejectClick(req)}
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
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" color="text.secondary">
                      No leave requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Reject Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          elevation: 5,
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#f5f5f5', fontWeight: 700 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CancelIcon color="error" />
            <Typography variant="h6" fontWeight={700}>
              Reject Leave Request
            </Typography>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Please provide a reason for rejecting this leave request:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter detailed reason for rejection..."
            variant="outlined"
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRejectConfirm}
            disabled={!rejectReason.trim()}
            startIcon={<CancelIcon />}
          >
            Confirm Reject
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
        <DialogTitle sx={{ backgroundColor: '#f5f5f5', fontWeight: 700 }}>
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
                  Employee
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {getEmployeeAvatar(selectedRequest.emp_id)}
                  </Avatar>
                  <Typography variant="body1" fontWeight={600}>
                    {getEmployeeName(selectedRequest.emp_id)}
                  </Typography>
                </Stack>
              </Grid>

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

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Reason
                </Typography>
                <Paper sx={{ p: 2, mt: 0.5, backgroundColor: '#f9f9f9' }}>
                  <Typography variant="body2">
                    {selectedRequest.reason}
                  </Typography>
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
          <Button 
            onClick={() => setOpenDetailDialog(false)}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveRequestsAdmin;