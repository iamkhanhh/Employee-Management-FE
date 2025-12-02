import React from "react";
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
  TablePagination,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  EventNote as EventNoteIcon,
  CalendarMonth as CalendarIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useLeaveRequestsAdmin } from "../../hooks/useLeaveRequestsAdmin";

// ==================== SUB COMPONENTS ====================

const StatusIcon = ({ status }) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return <CheckCircleIcon fontSize="small" />;
    case "REJECTED":
      return <CancelIcon fontSize="small" />;
    default:
      return <PendingIcon fontSize="small" />;
  }
};

const StatCard = ({ title, value, color, icon: Icon }) => (
  <Card elevation={2} sx={{ borderLeft: `4px solid ${color}` }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ color }}>
            {value}
          </Typography>
        </Box>
        <Icon sx={{ fontSize: 48, color, opacity: 0.3 }} />
      </Stack>
    </CardContent>
  </Card>
);

// ==================== MAIN COMPONENT ====================

const LeaveRequestsAdmin = () => {
  // Lấy departmentId từ user context hoặc hardcode tạm
  const departmentId = 1; // TODO: Lấy từ auth context

  const {
    // Data
    paginatedRequests,
    filteredRequests,
    selectedRequest,
    stats,
    leaveTypes,

    // Loading & Error states
    loading,
    error,
    approving,
    rejecting,

    // Dialog states
    openRejectDialog,
    openDetailDialog,
    rejectReason,
    setRejectReason,

    // Filter states
    searchTerm,
    statusFilter,
    leaveTypeFilter,

    // Pagination states
    page,
    rowsPerPage,

    // Snackbar
    snackbar,

    // Helper functions
    getEmployeeName,
    getEmployeeAvatar,
    formatLeaveType,
    formatStatus,
    formatDate,
    calculateDuration,
    getStatusColor,

    // Handlers
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
  } = useLeaveRequestsAdmin(departmentId);

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} />
          <Typography color="text.secondary">Loading leave requests...</Typography>
        </Stack>
      </Box>
    );
  }

  // ==================== ERROR STATE ====================
  if (error) {
    return (
      <Box p={3}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
            Leave Requests Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and review employee leave requests
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchData} color="primary" size="large">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requests"
            value={stats.total}
            color="#1976d2"
            icon={EventNoteIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending" value={stats.pending} color="#ed6c02" icon={PendingIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Approved"
            value={stats.approved}
            color="#2e7d32"
            icon={CheckCircleIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Rejected" value={stats.rejected} color="#d32f2f" icon={CancelIcon} />
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
                onChange={(e) => handleSearchChange(e.target.value)}
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
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={leaveTypeFilter}
                  label="Leave Type"
                  onChange={(e) => handleLeaveTypeFilterChange(e.target.value)}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  {leaveTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {formatLeaveType(type)}
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
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "primary.main",
                            fontSize: "0.9rem",
                          }}
                        >
                          {getEmployeeAvatar(req)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          {getEmployeeName(req)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatLeaveType(req.leaveType)}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2">{formatDate(req.startDate)}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2">{formatDate(req.endDate)}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${calculateDuration(req.startDate, req.endDate)} days`}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<StatusIcon status={req.status} />}
                        label={formatStatus(req.status)}
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
                        {req.status?.toUpperCase() === "PENDING" && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleApprove(req.id)}
                                disabled={approving}
                              >
                                {approving ? (
                                  <CircularProgress size={18} />
                                ) : (
                                  <CheckCircleIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRejectClick(req)}
                                disabled={rejecting}
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
        open={openRejectDialog}
        onClose={handleRejectDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ elevation: 5 }}
      >
        <DialogTitle sx={{ backgroundColor: "#f5f5f5", fontWeight: 700 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CancelIcon color="error" />
            <Typography variant="h6" fontWeight={700}>
              Reject Leave Request
            </Typography>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          {selectedRequest && (
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Employee: <strong>{getEmployeeName(selectedRequest)}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Leave Type: <strong>{formatLeaveType(selectedRequest.leaveType)}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Period:{" "}
                <strong>
                  {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                </strong>
              </Typography>
            </Box>
          )}
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
            disabled={rejecting}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleRejectDialogClose} variant="outlined" disabled={rejecting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRejectConfirm}
            disabled={!rejectReason.trim() || rejecting}
            startIcon={rejecting ? <CircularProgress size={18} color="inherit" /> : <CancelIcon />}
          >
            {rejecting ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={handleDetailDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ elevation: 5 }}
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
                  Employee
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                    {getEmployeeAvatar(selectedRequest)}
                  </Avatar>
                  <Typography variant="body1" fontWeight={600}>
                    {getEmployeeName(selectedRequest)}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Leave Type
                </Typography>
                <Typography variant="body1" fontWeight={600} mt={0.5}>
                  {formatLeaveType(selectedRequest.leaveType)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1" fontWeight={600} mt={0.5}>
                  {formatDate(selectedRequest.startDate)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body1" fontWeight={600} mt={0.5}>
                  {formatDate(selectedRequest.endDate)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1" fontWeight={600} mt={0.5}>
                  {calculateDuration(selectedRequest.startDate, selectedRequest.endDate)} days
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Box mt={0.5}>
                  <Chip
                    icon={<StatusIcon status={selectedRequest.status} />}
                    label={formatStatus(selectedRequest.status)}
                    color={getStatusColor(selectedRequest.status)}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Reason
                </Typography>
                <Paper sx={{ p: 2, mt: 0.5, backgroundColor: "#f9f9f9" }}>
                  <Typography variant="body2">
                    {selectedRequest.reason || "No reason provided"}
                  </Typography>
                </Paper>
              </Grid>

              {selectedRequest.rejectReason && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="error">
                    Reject Reason
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      mt: 0.5,
                      backgroundColor: "#fff5f5",
                      border: "1px solid #ffcdd2",
                    }}
                  >
                    <Typography variant="body2" color="error">
                      {selectedRequest.rejectReason}
                    </Typography>
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body2" mt={0.5}>
                  {selectedRequest.createdAt
                    ? new Date(selectedRequest.createdAt).toLocaleString()
                    : "-"}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDetailDialogClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaveRequestsAdmin;